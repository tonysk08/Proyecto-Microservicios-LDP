"""Cliente RabbitMQ (pika) para los scrapers: consumir una cola y publicar eventos."""
from __future__ import annotations

import json
import logging
import time
from typing import Callable

import pika

logger = logging.getLogger("rabbitmq_client")


class RabbitMQClient:
    def __init__(self, url: str):
        self._url = url
        self._connection: pika.BlockingConnection | None = None
        self._channel = None

    def connect(self, retries: int = 10, delay_s: float = 3.0) -> None:
        last_err = None
        for attempt in range(1, retries + 1):
            try:
                params = pika.URLParameters(self._url)
                self._connection = pika.BlockingConnection(params)
                self._channel = self._connection.channel()
                logger.info("Conectado a RabbitMQ")
                return
            except Exception as err:  # noqa: BLE001
                last_err = err
                logger.warning(
                    "RabbitMQ no disponible (intento %s/%s): %s", attempt, retries, err
                )
                time.sleep(delay_s)
        raise RuntimeError(f"No se pudo conectar a RabbitMQ: {last_err}")

    def publish(self, exchange: str, routing_key: str, payload: dict) -> None:
        """Publica un mensaje JSON persistente en un exchange con routing key."""
        assert self._channel is not None, "Canal no inicializado (llama a connect())"
        self._channel.basic_publish(
            exchange=exchange,
            routing_key=routing_key,
            body=json.dumps(payload).encode("utf-8"),
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2,  # persistente
            ),
        )

    def consume(self, queue: str, callback: Callable[[dict], None]) -> None:
        """Consume una cola con ack manual. `callback` recibe el mensaje decodificado."""
        assert self._channel is not None, "Canal no inicializado (llama a connect())"
        self._channel.basic_qos(prefetch_count=1)

        def _on_message(ch, method, _properties, body):
            try:
                message = json.loads(body.decode("utf-8"))
            except json.JSONDecodeError:
                logger.error("Mensaje no-JSON descartado")
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
                return
            try:
                callback(message)
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as err:  # noqa: BLE001
                logger.exception("Error procesando mensaje: %s", err)
                # Sin requeue -> a la DLQ (x-dead-letter-exchange de la cola)
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

        self._channel.basic_consume(queue=queue, on_message_callback=_on_message)
        logger.info("Escuchando la cola '%s'...", queue)
        self._channel.start_consuming()

    def close(self) -> None:
        if self._connection and not self._connection.is_closed:
            self._connection.close()
