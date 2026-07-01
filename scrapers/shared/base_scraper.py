"""Clase base para los scrapers: ciclo consumir -> scrapear -> publicar eventos.

Publica mensajes con envoltura compatible con NestJS: {"pattern": <evento>, "data": <BaseEvent>}
para que los consumidores @EventPattern(<evento>) los reciban.
"""
from __future__ import annotations

import logging
import os
import uuid
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import List

from shared.models import RawProduct
from shared.rabbitmq_client import RabbitMQClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def build_event(event_type: str, payload: dict, correlation_id: str) -> dict:
    """Envoltura BaseEvent dentro del sobre NestJS {pattern, data}."""
    return {
        "pattern": event_type,
        "data": {
            "eventId": str(uuid.uuid4()),
            "eventType": event_type,
            "timestamp": _now_iso(),
            "correlationId": correlation_id,
            "payload": payload,
        },
    }


class BaseScraper(ABC):
    def __init__(self) -> None:
        self.scraper_id = os.getenv("SCRAPER_ID", "unknown")
        self.target_url = os.getenv("TARGET_URL", "")
        self.queue = os.getenv("SCRAPER_QUEUE", f"scraper.{self.scraper_id}.queue")
        self.exchange = os.getenv("SCRAPING_EXCHANGE", "scraping.exchange")
        self.rabbit = RabbitMQClient(os.getenv("RABBITMQ_URL", "amqp://localhost:5672"))
        self.log = logging.getLogger(self.__class__.__name__)

    # ----- ciclo de vida -----
    def start(self) -> None:
        self.rabbit.connect()
        self.rabbit.consume(self.queue, self.handle_scrape_request)

    def handle_scrape_request(self, message: dict) -> None:
        # Acepta sobre NestJS {pattern,data} o mensaje plano
        data = message.get("data", message) if isinstance(message, dict) else {}
        payload = data.get("payload", data) if isinstance(data, dict) else {}
        correlation_id = (
            data.get("correlationId")
            or payload.get("correlationId")
            or str(uuid.uuid4())
        )
        self.log.info("[%s] Scrape solicitado (corr=%s)", self.scraper_id, correlation_id)

        self.rabbit.publish(
            self.exchange,
            "scraping.started",
            build_event(
                "scraping.started",
                {"supermarketId": self.scraper_id, "supermarketName": self.scraper_id},
                correlation_id,
            ),
        )

        start = datetime.now(timezone.utc)
        try:
            products = self.scrape()
            duration_ms = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)
            self.rabbit.publish(
                self.exchange,
                "scraping.completed",
                build_event(
                    "scraping.completed",
                    {
                        "supermarketId": self.scraper_id,
                        "supermarketName": self.scraper_id,
                        "productsScraped": len(products),
                        "durationMs": duration_ms,
                        "rawProducts": [p.to_dto() for p in products],
                    },
                    correlation_id,
                ),
            )
            self.log.info(
                "[%s] Completado: %s productos en %sms",
                self.scraper_id,
                len(products),
                duration_ms,
            )
        except Exception as err:  # noqa: BLE001
            self.log.exception("[%s] Scrape falló: %s", self.scraper_id, err)
            self.rabbit.publish(
                self.exchange,
                "scraping.failed",
                build_event(
                    "scraping.failed",
                    {
                        "supermarketId": self.scraper_id,
                        "reason": type(err).__name__,
                        "error": str(err),
                        "retryCount": 0,
                    },
                    correlation_id,
                ),
            )
            raise

    @abstractmethod
    def scrape(self) -> List[RawProduct]:
        """Cada scraper implementa su extracción. Debe ser tolerante a fallos."""
        raise NotImplementedError
