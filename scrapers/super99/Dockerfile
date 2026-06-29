# Imagen liviana (sin navegador): requests + BeautifulSoup + pika.
# Contexto de build: ./scrapers  (para incluir shared/ y super99/)
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

COPY super99/requirements.txt ./super99/requirements.txt
RUN pip install --no-cache-dir -r super99/requirements.txt

COPY shared/ ./shared/
COPY super99/ ./super99/

# Usuario no-root
RUN useradd -m -u 1001 scraper && chown -R scraper /app
USER scraper

CMD ["python", "-m", "super99.main"]
