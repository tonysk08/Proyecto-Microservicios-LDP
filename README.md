# Proyecto-Microservicios-LDP

**Arquitectura Backend basada en Microservicios con Scraping Automatizado para el Monitoreo de Precios en Supermercados Locales.**

Universidad Tecnológica de Panamá — FISC · Lenguaje de Programación
Autores: Johan Infante · Antonio Sarmiento

---

## 1. ¿De qué va el proyecto?

Plataforma distribuida (microservicios) para **monitorear y comparar precios de productos entre supermercados locales de Panamá**. La idea de negocio:

- Recolectar precios mediante **scraping automatizado** de cada supermercado.
- **Normalizar** productos equivalentes entre cadenas (ej. "Leche 1L" ≈ "LECHE ENTERA 1 LT").
- Guardar el **histórico de precios** y permitir **comparaciones**.
- Generar **cotizaciones de canasta básica** (qué supermercado sale más barato).
- Exponer todo a través de una **API documentada con Swagger**.

La comunicación entre servicios es **asíncrona vía RabbitMQ**, cada dominio tiene su **propia base de datos PostgreSQL**, y todo se ejecuta con **Docker Compose**.

> **Flujo objetivo:** Cliente → API Gateway → RabbitMQ → Scraper(s) → Catalog/Price/Matching → PostgreSQL → consultas (catálogo, comparación, cotización) de vuelta por el Gateway.

---

## 2. Estado actual (qué está implementado)

> El proyecto está en construcción. Esta tabla refleja lo que hoy **funciona de verdad** vs. lo planificado.

| Componente | Estado | Notas |
|---|---|---|
| **API Gateway** | 🟢 Funcional | Endpoints de catálogo + Swagger |
| **Catalog Service** | 🟢 Funcional | CRUD de catálogo vía RabbitMQ + PostgreSQL (con datos seed) |
| **Price Service** | 🟡 Scaffold | Arranca y conecta a BD; lógica de precios pendiente |
| **RabbitMQ** | 🟢 Operativo | Colas `catalog_queue`, `price_queue` (RPC) |
| **PostgreSQL** | 🟢 Operativo | 4 BDs + esquemas + seed inicial |
| **Docker Compose** | 🟢 Funcional | Levanta los 5 contenedores actuales |
| Scrapers (Python/Playwright) | 🔴 Pendiente | Aún no implementados |
| Matching / Scheduler / Audit | 🔴 Pendiente | Diseñados en el backlog |
| Arquitectura de eventos (exchanges/DLQ) | 🔴 Pendiente | Hoy es RPC directo |

**Lo que ya puedes probar end-to-end:** `GET http://localhost/api/catalog` devuelve productos reales atravesando `Gateway → RabbitMQ → Catalog Service → PostgreSQL`.

---

## 3. Tecnologías utilizadas

| Categoría | Tecnología |
|---|---|
| Lenguaje backend | **TypeScript** sobre **Node.js 22** |
| Framework | **NestJS 11** (monorepo: api-gateway, catalog-service, price-service) |
| Mensajería | **RabbitMQ 3** (`@nestjs/microservices`, transporte RMQ) |
| Persistencia | **PostgreSQL 16** + **TypeORM** |
| Documentación API | **Swagger / OpenAPI** (`@nestjs/swagger`) |
| Contenedores | **Docker** + **Docker Compose** |
| Scraping (planificado) | **Python**, **Playwright**, **BeautifulSoup** |
| Control de versiones | **Git** |

---

## 4. Estructura del repositorio

```
Proyecto-Microservicios-LDP/
├── docker-compose.yml          # Orquesta rabbitmq, postgres y los microservicios
├── init/                       # Scripts SQL que se ejecutan al crear la BD por primera vez
│   ├── 01-init-databases.sql       # Crea bd_catalogs, bd_prices, bd_matching, bd_logs + esquemas
│   ├── 02-init-databases-users.sql # Crea un usuario por base de datos
│   ├── 03-init-catalogs-structures.sql  # Tablas del catálogo
│   ├── 04-init-seed-catalog_products.sql      # Datos de ejemplo (productos)
│   └── 05-init-seed-catalog_raw_products.sql  # Datos de ejemplo (productos crudos)
└── microservices/              # Monorepo NestJS
    ├── apps/
    │   ├── api-gateway/        # Punto de entrada HTTP + Swagger
    │   ├── catalog-service/    # Catálogo (RabbitMQ + PostgreSQL)
    │   └── price-service/      # Precios (scaffold)
    ├── package.json
    └── nest-cli.json
```

---

## 5. Arquitectura y bases de datos

### Diagrama de flujo (estado actual)

```
                    ┌──────────────┐        HTTP / Swagger
        Cliente ───▶│  API Gateway │◀── http://localhost/api/docs
                    └──────┬───────┘
       POST /api/scraping/request │           GET /api/catalog
                           │ scraping.requested
                           ▼
                 ╔═══════════════════════ RabbitMQ (topic exchanges) ═══════════════════════╗
                 ║  scraping.exchange · products.exchange · pricing.exchange · audit.exchange ║
                 ╚════┬═══════════════┬═══════════════┬══════════════════════┬═══════════════╝
                      │ scraping.requested            │ scraping.completed    │  # (tap)
                      ▼               │               ▼                       ▼
              ┌───────────────┐      │      ┌──────────────────┐      ┌──────────────┐
              │  Scraper      │      │      │  Catalog Service │      │ audit_queue  │
              │  Orchestrator │      │      │  (persiste raw)  │      │ (Audit, fut.)│
              └──────┬────────┘      │      └────────┬─────────┘      └──────────────┘
            scrape.<id> │ (cola por súper)           ▼
        ┌───────────────┼───────────────┐      ┌──────────────┐
        ▼               ▼               ▼      │  bd_catalogs │
   ┌─────────┐    ┌──────────┐   ┌────────────┐└──────────────┘
   │ super99 │    │riba-smith│   │el-machetazo│   pricing_queue / matching_queue
   │ scraper │    │ scraper  │   │  scraper   │   ───▶ Price / Matching (Sprint 3)
   └─────────┘    └──────────┘   └────────────┘        └─▶ bd_prices / bd_matching
        │ scraping.completed (rawProducts)
        └──────────────────────────────▲ (de vuelta al exchange)
```

Cada microservicio es dueño de su propia base de datos (no comparten tablas):

| Base de datos | Esquema | Servicio | Usuario |
|---|---|---|---|
| `bd_catalogs` | `catalog` | Catalog Service | `catalog_user` |
| `bd_prices` | `pricing` | Price Service | `prices_user` |
| `bd_matching` | `matching` | Matching Service (futuro) | `matching_user` |
| `bd_logs` | `audit` | Audit Service (futuro) | `logs_user` |

Puertos publicados por `docker-compose`:

| Servicio | Host → Contenedor | Para qué |
|---|---|---|
| API Gateway | `80 → 3000` | API REST + Swagger |
| RabbitMQ | `5672` | Broker AMQP |
| RabbitMQ (UI) | `15672` | Consola de administración |
| PostgreSQL | `5432` | Base de datos |

### Eventos del sistema (contratos en `@app/shared-contracts`)

Mensajería event-driven con envoltura `BaseEvent` (`eventId`, `eventType`, `timestamp`, `correlationId`, `payload`):

| Evento | Lo publica | Lo consume |
|---|---|---|
| `scraping.requested` | API Gateway / Scheduler | Scraper Orchestrator |
| `scraping.started` | Scraper / Orchestrator | Audit (tap) |
| `scraping.completed` | Scrapers | Catalog, Pricing, Matching, Audit |
| `scraping.failed` | Scraper / Orchestrator (timeout) | Audit (→ DLQ) |
| `product.normalized` | Matching (futuro) | Pricing, Audit |
| `price.created` / `price.updated` | Pricing (futuro) | Catalog, Audit |
| `quote.generated` | Pricing (futuro) | Audit |
| `audit.created` | Cualquier servicio | Audit Service |

> Detalle de exchanges, colas, bindings y DLQ en [docs/EVENT_ARCHITECTURE.md](docs/EVENT_ARCHITECTURE.md).
> Cómo probar el flujo desde Swagger: [docs/GUIA_PRUEBAS_SWAGGER.md](docs/GUIA_PRUEBAS_SWAGGER.md).

---

## 6. Cómo encender el proyecto en otra máquina / local

### Opción A — Con Docker (recomendada) 🐳

Es la forma más sencilla: **no necesitas instalar Node, Postgres ni RabbitMQ**, solo Docker.

#### Requisitos
- **Docker Desktop** instalado y **en ejecución** (el "engine"/daemon encendido, no solo instalado).
- **Git**.
- Puertos libres en el host: **80**, **5432**, **5672**, **15672**.

#### Pasos
```bash
# 1. Clonar el repositorio
git clone <URL-del-repo>
cd Proyecto-Microservicios-LDP

# 2. Construir y levantar todo
docker compose up -d --build

# 3. Verificar que los contenedores estén arriba
docker compose ps
```

#### Acceder
- **Swagger (API):** http://localhost/api/docs
- **Catálogo:** http://localhost/api/catalog
- **RabbitMQ (consola):** http://localhost:15672 → usuario `admin`, contraseña `admin1234`

#### Apagar
```bash
docker compose down       # detiene y elimina los contenedores (conserva los datos)
docker compose down -v    # además borra los volúmenes (resetea BD y broker desde cero)
```

> **Nota (Windows / PowerShell):** si tras instalar Docker Desktop el comando `docker` no se reconoce, **reabre la terminal**, o antepón su carpeta al PATH de la sesión:
> ```powershell
> $env:PATH = "C:\Program Files\Docker\Docker\resources\bin;" + $env:PATH
> ```
> Esto también resuelve el error `docker-credential-desktop ... not found` al descargar imágenes.

> **Credenciales:** las claves por defecto (`admin/admin1234`, etc.) son **solo para desarrollo local**. No usar en producción.

---

### Opción B — Desarrollo local de un microservicio (sin Docker para el código)

Útil para programar con *hot-reload*. Aun así conviene levantar la **infraestructura** (RabbitMQ + PostgreSQL) con Docker.

#### Requisitos
- **Node.js 22+** y **npm**.
- Infraestructura corriendo. La forma rápida:
  ```bash
  docker compose up -d rabbitmq service-db
  ```

#### Pasos
```bash
cd microservices

# 1. Instalar dependencias del monorepo
npm install

# 2. Crear los .env a partir de los ejemplos (uno por app)
cp apps/api-gateway/.env.example     apps/api-gateway/.env
cp apps/catalog-service/.env.example apps/catalog-service/.env
cp apps/price-service/.env.example   apps/price-service/.env

# 3. Levantar un servicio en modo watch (elige el que vas a tocar)
npm run start:dev api-gateway
# npm run start:dev catalog-service
# npm run start:dev price-service
```

> Los `.env.example` ya traen valores que coinciden con `docker-compose.yml` e `init/*.sql`
> (host `localhost`, RabbitMQ `admin/admin1234`, etc.). **`RABBITMQ_URL` es obligatoria** para
> que el API Gateway arranque.

#### Pruebas
```bash
cd microservices
npm test          # tests unitarios (jest)
npm run lint      # linter
```

---

## 7. Verificación rápida (smoke test)

Con el stack levantado (Opción A):

```bash
# Endpoint real (HTTP → RabbitMQ → catalog-service → PostgreSQL)
curl http://localhost/api/catalog

# Bases de datos creadas
docker exec Service-DB psql -U admin -d postgres -c "\l" 

# Datos seed cargados
docker exec Service-DB psql -U admin -d bd_catalogs -c "SELECT count(*) FROM catalog.catalog_products;"
```

---

## 9. Roadmap (resumen)

1. Estabilización e infraestructura Docker ✅ (en curso)
2. Flujo RabbitMQ completo (exchanges, routing keys, DLQ)
3. Persistencia mínima de los servicios faltantes (price, matching, logs)
4. Scrapers en Python (uno independiente por supermercado)
5. Endpoints funcionales: comparación de precios, historial, cotización
6. Normalización / matching de productos
7. Programación automática de scraping (scheduler)
8. Auditoría, logs y mejoras

