# Imagen liviana (sin navegador). Contexto de build: ./scrapers
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

COPY riba_smith/requirements.txt ./riba_smith/requirements.txt
RUN pip install --no-cache-dir -r riba_smith/requirements.txt

COPY shared/ ./shared/
COPY riba_smith/ ./riba_smith/

RUN useradd -m -u 1001 scraper && chown -R scraper /app
USER scraper

CMD ["python", "-m", "riba_smith.main"]
