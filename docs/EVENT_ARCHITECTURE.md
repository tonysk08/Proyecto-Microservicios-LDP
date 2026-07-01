# Arquitectura de Eventos (RabbitMQ / EDA) — LDP-020

> Topología objetivo de mensajería. Define los **exchanges** (tipo `topic`), las **colas**
> de trabajo, los **bindings** por routing key y las **Dead Letter Queues (DLQ)**.
> Es la fuente de verdad que materializa `rabbitmq/definitions.json` (LDP-021).
>
> Los nombres de evento (routing keys) provienen de `@app/shared-contracts` → `EVENT_TYPES`.

---

## 1. Exchanges

Todos `type: topic`, `durable: true`.

| Exchange | Propósito | Eventos que recibe |
|---|---|---|
| `scraping.exchange` | Solicitudes y ciclo de vida del scraping | `scraping.requested/started/completed/failed` |
| `products.exchange` | Normalización de productos | `product.normalized` |
| `pricing.exchange` | Precios | `price.created`, `price.updated` |
| `quotes.exchange` | Cotizaciones | `quote.generated` |
| `audit.exchange` | Auditoría explícita | `audit.created` |

---

## 2. Colas de trabajo (consumidores)

Todas `durable: true`, `noAck:false` (ack manual), con `x-dead-letter-exchange` cuando aplica.

| Cola | Servicio consumidor | DLX (dead-letter) |
|---|---|---|
| `scraper_orchestrator_queue` | Scraper Orchestrator | `dlq.scraping.exchange` |
| `catalog_queue` | Catalog Service | `dlq.products.exchange` |
| `pricing_queue` | Price Service | `dlq.products.exchange` |
| `matching_queue` | Matching Service | `dlq.products.exchange` |
| `audit_queue` | Audit & Logging Service | — (tap, sin reproceso) |

> `catalog_queue` ya existe hoy en modo RPC (`{ cmd: 'get_catalogs' }`). La migración a
> binding por routing key se hará al implementar los consumidores de eventos (LDP-031, etc.),
> conservando compatibilidad con las consultas RPC del gateway.

---

## 3. Bindings (exchange → routing key → cola)

```
scraping.exchange (topic)
 ├── scraping.requested  → scraper_orchestrator_queue
 ├── scraping.started    → (audit por tap #)
 ├── scraping.completed  → catalog_queue, pricing_queue, matching_queue
 └── scraping.failed     → (audit por tap #)   [+ DLQ ante fallos de proceso]

products.exchange (topic)
 └── product.normalized  → pricing_queue, matching_queue

pricing.exchange (topic)
 ├── price.created       → catalog_queue        (actualiza snapshot de último precio)
 └── price.updated       → (audit por tap #)

quotes.exchange (topic)
 └── quote.generated     → (audit por tap #)
```

### Auditoría: "tap" de todo el sistema
`audit_queue` se vincula con routing key `#` (todos) a **cada** exchange de dominio, de modo
que el Audit Service observa los 9 eventos sin que cada servicio tenga que re-publicar:

```
audit_queue  ←  scraping.exchange  (#)
audit_queue  ←  products.exchange  (#)
audit_queue  ←  pricing.exchange   (#)
audit_queue  ←  quotes.exchange    (#)
audit_queue  ←  audit.exchange     (#)
```

---

## 4. Dead Letter Queues (DLQ)

Para no perder mensajes que fallan tras N reintentos (política completa en LDP-022).

| DLX (exchange) | Tipo | Cola DLQ | Origen |
|---|---|---|---|
| `dlq.scraping.exchange` | fanout | `dlq_scraping` | `scraper_orchestrator_queue` |
| `dlq.products.exchange` | fanout | `dlq_products` | `catalog_queue`, `pricing_queue`, `matching_queue` |

Mecánica: cada cola de trabajo declara `x-dead-letter-exchange` apuntando a su DLX. Cuando un
mensaje es rechazado (`nack` sin requeue) o expira, RabbitMQ lo enruta a la DLQ correspondiente.

---

## 5. Diagrama

```
            Gateway/Scheduler
                  │ scraping.requested
                  ▼
        ┌───────────────────────┐
        │   scraping.exchange   │(topic)
        └─────────┬─────────────┘
        requested │           completed
                  ▼                 ├──────────────┬───────────────┐
      scraper_orchestrator_queue    ▼              ▼               ▼
                  │            catalog_queue   pricing_queue   matching_queue
        [scraper.<id>.queue]        │              │ price.created
                  │ (scrapers)      │              ▼
                  │            ┌───────────────────────┐
                  │            │   pricing.exchange    │→ catalog_queue (snapshot)
                  │            └───────────────────────┘
                  │
                  ▼ scraping.completed (rawProducts)
            products.exchange  → pricing_queue, matching_queue
                                       │ product.normalized

   audit_queue  ◄── (#) ── scraping/products/pricing/quotes/audit.exchange
                                       │
                                       ▼
                                  bd_logs (Audit Service)

   Fallos →  dlq.scraping.exchange → dlq_scraping
             dlq.products.exchange → dlq_products
```

---

## 6. Convenciones

- **Routing keys = `EVENT_TYPES`** de `@app/shared-contracts` (un solo lugar de verdad).
- **Mensajes**: envoltura `BaseEvent` (`eventId`, `eventType`, `timestamp`, `correlationId`, `payload`).
- **Idempotencia**: los consumidores deben tolerar reentregas (ack manual + claves únicas).
- **`correlationId`**: se propaga desde el `scraping.requested` por todo el flujo para tracing.

---

---

## 7. Resiliencia: ack manual, DLQ y reintentos (LDP-022)

**Consumidores de eventos** (pricing, matching, orchestrator, audit): se configuran con
`noAck:false` (ack manual) para garantizar *at-least-once*. El procesamiento usa el helper
`consumeWithDlq` de `@app/common`:

- éxito → `ack`.
- fallo → `nack` **sin requeue** → el mensaje cae a la **DLQ** de la cola
  (`x-dead-letter-exchange`, definido en `definitions.json`: `dlq.scraping.exchange` /
  `dlq.products.exchange` → `dlq_scraping` / `dlq_products`).

> ⚠️ **Las colas RPC** (`catalog_queue`, `price_queue`, request/response del gateway) **no**
> usan ack manual ni DLQ: los errores se devuelven al llamador como `RpcException`. El ack
> manual solo aplica a los consumidores de eventos.

### Reintentos con backoff (plan)
Para evitar el anti-patrón de *requeue* inmediato (hot-loop), el reintento con backoff se hará
con una **retry-queue + TTL**: la cola de reintento hace dead-letter de vuelta a la de trabajo tras
`computeBackoffMs(attempt)`; superado `DEFAULT_MAX_RETRIES`, el mensaje va a la DLQ definitiva y
se registra en auditoría (`audit.created`). Helpers ya disponibles en `@app/common`
(`computeBackoffMs`, `getDeathCount`, `DEFAULT_MAX_RETRIES`).

**Estado:** infra DLQ + helper `consumeWithDlq` listos; el cableado vivo (retry-queue + audit)
se hará al implementar los consumidores de eventos y el audit-service (Sprint 2/3:
LDP-051/062/100).

---

*Materialización concreta de esta topología → `rabbitmq/definitions.json` (LDP-021), montado en el contenedor de RabbitMQ vía `docker-compose.yml`.*
