# Proyecto-Microservicios-LDP
Arquitectura Backend basada en Microservicios con Scraping Automatizado para el Monitoreo de Precios en Supermercados Locales.


>MVP  
“ Este sistema permite solicitar un scraping desde Swagger, procesa la solicitud mediante RabbitMQ, obtiene productos/precios mediante un servicio Python, persiste los datos en PostgreSQL y permite consultar catálogo, comparar precios, cotizar una canasta y revisar historial. ”


## Puntos a seguir para la entrega
1. Primero cerrar infraestructura Docker.
2. Luego cerrar flujo RabbitMQ completo.
3. Luego persistencia mínima.
4. Luego endpoints funcionales.
5. Luego comparación y cotización.
6. Luego normalización básica.
7. Luego programación automática de scraping.
8. Luego logs y mejoras.


### 7) Siguientes pasos inmediatos desde tu estado actual
Dado lo que tienes hoy, tus próximos 5 pasos inmediatos deberían ser estos:

1. Documentar contratos de scrape_request y scrape_result
Porque sin eso vas a construir servicios desconectados.

2. Definir y crear las entidades faltantes
Prioridad:
price
histórico de precios
matching/equivalencia
ejecución de scraping
logs

3. Construir scraping-service en Python
Es la pieza más crítica para desbloquear el flujo real del negocio.

4. Construir price-service
Porque varios requerimientos dependen de él:

comparación
historial
cotización

5. Expandir api-gateway
Agregar:

POST /scraping
GET /catalog
GET /prices/compare
GET /prices/history/:id
POST /basket/quote