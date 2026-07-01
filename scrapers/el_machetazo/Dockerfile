# Imagen liviana (sin navegador). Contexto de build: ./scrapers
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

COPY el_machetazo/requirements.txt ./el_machetazo/requirements.txt
RUN pip install --no-cache-dir -r el_machetazo/requirements.txt

COPY shared/ ./shared/
COPY el_machetazo/ ./el_machetazo/

RUN useradd -m -u 1001 scraper && chown -R scraper /app
USER scraper

CMD ["python", "-m", "el_machetazo.main"]
