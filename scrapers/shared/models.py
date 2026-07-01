"""Modelos de datos compartidos por los scrapers."""
from __future__ import annotations

from dataclasses import dataclass, asdict, field
from typing import Optional


@dataclass
class RawProduct:
    """Producto crudo extraído por un scraper.

    Coincide con RawProductDto de @app/shared-contracts.
    """

    raw_name: str
    price: float
    unit: str
    supermarket_id: str
    raw_brand: Optional[str] = None
    category: Optional[str] = None
    source_url: Optional[str] = None
    scraped_at: Optional[str] = None

    def to_dto(self) -> dict:
        """Serializa a las claves camelCase que esperan los consumidores NestJS."""
        return {
            "rawName": self.raw_name,
            "price": self.price,
            "unit": self.unit,
            "supermarketId": self.supermarket_id,
            "rawBrand": self.raw_brand,
            "category": self.category,
            "sourceUrl": self.source_url,
            "scrapedAt": self.scraped_at,
        }
