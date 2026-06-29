# Guía de pruebas del sistema vía Swagger

Esta guía te lleva paso a paso para **probar el sistema completo desde el navegador**, usando
Swagger (la documentación interactiva de la API). No necesitas instalar nada salvo Docker.

---

## 1. Levantar el sistema

Desde la carpeta raíz del proyecto (`Proyecto-Microservicios-LDP/`):

```bash
docker compose up -d --build
```

Espera ~1–2 min la primera vez. Verifica que todo esté arriba:

```bash
docker compose ps
```

Deberías ver 9 contenedores: `RabbitMQ-Node`, `Service-DB`, `API-Gateway`,
`Catalog-Service`, `Price-Service`, `Scraper-Orchestrator`, `Scraper-Super99`,
`Scraper-RibaSmith`, `Scraper-ElMachetazo`.

> 💡 Si en Windows el comando `docker` no se reconoce, reabre la terminal o usa la ruta completa
> (`& "C:\Program Files\Docker\Docker\resources\bin\docker.exe"`).

---

## 2. Abrir Swagger

En el navegador:

### 👉 http://localhost/api/docs

Verás la API agrupada por etiquetas:
- **Scraping** — disparar la recolección de precios.
- **Catalog** — consultar el catálogo de productos.

> El gateway está publicado en el **puerto 80**, por eso la URL no lleva `:3000`.

---

## 3. Prueba guiada (flujo completo)

### Paso 1 — Disparar un scraping

1. En Swagger, abre **`POST /api/scraping/request`**.
2. Click en **"Try it out"**.
3. En el body, puedes dejar `{}` (scrapea **todos** los supermercados) o especificar uno:
   ```json
   { "supermarketId": "super99" }
   ```
   Valores válidos: `super99`, `riba-smith`, `el-machetazo`.
4. Click **"Execute"**.

Respuesta esperada (`201`):
```json
{
  "message": "Scraping solicitado",
  "correlationId": "....",
  "target": "super99"
}
```

**Qué acaba de pasar (por detrás):**
```
POST /api/scraping/request
  → API Gateway publica el evento scraping.requested
  → Scraper Orchestrator lo recibe y despacha a el/los scraper(s)
  → cada Scraper extrae productos (intenta el sitio real; si falla usa datos de ejemplo)
  → publica scraping.completed
  → Catalog Service guarda los productos en PostgreSQL
```

### Paso 2 — Esperar unos segundos

El scraping es asíncrono. Espera **~5–10 segundos** a que los scrapers terminen y el
catálogo se actualice.

### Paso 3 — Consultar el catálogo

1. Abre **`GET /api/catalog`** → **"Try it out"**.
2. (Opcional) Ajusta los parámetros:
   - `page` (def. 1), `limit` (def. 20)
   - `category` (ej. `Lácteos`, `Granos`)
   - `includeRaw` = `true` para ver también los **productos crudos** que dejó cada scraper.
3. **"Execute"**.

Respuesta (`200`) — lista paginada:
```json
{
  "data": [ { "id": "...", "name": "leche entera", "brand": "Nevada", "category": "Lácteos", ... } ],
  "meta": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
}
```

Para ver lo que recolectaron los scrapers, usa `includeRaw=true`: cada producto normalizado
trae su arreglo `rawItems`, y además puedes consultar los productos crudos recién insertados.

---

## 4. Endpoints disponibles (resumen)

| Método | Ruta | Para qué |
|---|---|---|
| `POST` | `/api/scraping/request` | Dispara el scraping (todos o un supermercado) |
| `GET` | `/api/catalog` | Lista paginada de productos activos (`page`, `limit`, `category`, `includeRaw`) |
| `GET` | `/api/catalog/deactivated` | Lista de productos desactivados |
| `GET` | `/api/catalog/search?query=` | Búsqueda por nombre |
| `GET` | `/api/catalog/{id}` | Un producto por ID |
| `PATCH` | `/api/catalog/{id}/deactivate` | Desactivar un producto |
| `PATCH` | `/api/catalog/{id}/activate` | Activar un producto |
| `DELETE`| `/api/catalog/products/{id}` | Eliminar (solo si está desactivado) |

> Aún **no** están expuestos por Swagger los endpoints de precios/comparación/cotización
> (Sprint 4: LDP-052/053/054/112). Los datos de precios ya existen en la BD (`bd_prices`).

---

## 5. Ver lo que ocurre por dentro (opcional)

### Consola de RabbitMQ (cola de mensajes)
👉 http://localhost:15672 — usuario `admin`, contraseña `admin1234`

- Pestaña **Queues**: verás `catalog_queue`, `pricing_queue`, `audit_queue`, las
  `scraper.*.queue`, etc. Tras un scraping, sus contadores se mueven.
- Pestaña **Exchanges**: la topología `scraping.exchange`, `pricing.exchange`, etc.

### Logs de los servicios
```bash
docker compose logs -f scraper-orchestrator   # ve el despacho a los scrapers
docker compose logs -f scraper-super99        # ve la extracción (real → fixtures)
docker compose logs -f catalog-service        # "scraping.completed: N recibidos, N insertados"
```

### Base de datos
```bash
# Productos crudos recolectados por los scrapers
docker exec Service-DB psql -U admin -d bd_catalogs -c "SELECT supermarket, count(*) FROM catalog.catalog_raw_products GROUP BY supermarket;"

# Precios (dominio del pricing-service)
docker exec Service-DB psql -U admin -d bd_prices -c "SELECT supermarket_id, current_price FROM pricing.price_snapshots LIMIT 10;"
```

---

## 6. Apagar

```bash
docker compose down       # detiene todo (conserva los datos)
docker compose down -v    # además borra la base de datos y reinicia desde cero
```

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| Swagger no abre en `http://localhost/api/docs` | El gateway aún arranca o el puerto 80 está ocupado | `docker compose ps` / `docker compose logs api-gateway` |
| `POST /scraping/request` responde pero el catálogo no cambia | El scraping es asíncrono | Espera unos segundos y vuelve a consultar `/api/catalog` |
| Un scraper no inserta nada | El sitio real bloqueó/cambió | Es esperado: el scraper cae a **fixtures** (datos de ejemplo) y el flujo igual completa |
| `docker` no reconocido (Windows) | PATH | Reabrir terminal o usar la ruta completa al `docker.exe` |

---

*El detalle técnico de la arquitectura está en [README.md](../README.md) y [docs/EVENT_ARCHITECTURE.md](EVENT_ARCHITECTURE.md).*
