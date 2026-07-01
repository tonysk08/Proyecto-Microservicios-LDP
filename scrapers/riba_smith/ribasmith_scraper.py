"""Scraper de Riba Smith: intenta extracción real (best-effort) y cae a fixtures."""
from __future__ import annotations

import json
from pathlib import Path
from typing import List

from bs4 import BeautifulSoup

from shared.base_scraper import BaseScraper
from shared.http_utils import polite_get
from shared.models import RawProduct
from shared.normalization import parse_price

_FIXTURE = Path(__file__).parent / "fixtures" / "riba-smith.json"


class RibaSmithScraper(BaseScraper):
    def scrape(self) -> List[RawProduct]:
        if self.target_url:
            try:
                products = self._scrape_live(self.target_url)
                if products:
                    self.log.info("Extracción real: %s productos", len(products))
                    return products
                self.log.warning("Extracción real sin resultados; usando fixtures")
            except Exception as err:  # noqa: BLE001
                self.log.warning("Extracción real falló (%s); usando fixtures", err)
        return self._load_fixtures()

    def _scrape_live(self, url: str) -> List[RawProduct]:
        response = polite_get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        results: List[RawProduct] = []
        for card in soup.select("[data-product-id], .product-card, .product-item"):
            try:
                name_el = card.select_one(".product-name, .product-title, h3, [itemprop='name']")
                price_el = card.select_one(".price, .product-price, [itemprop='price']")
                if not name_el or not price_el:
                    continue
                price = parse_price(price_el.get_text())
                if price is None:
                    continue
                link = card.select_one("a")
                results.append(
                    RawProduct(
                        raw_name=name_el.get_text(strip=True),
                        price=price,
                        unit="un",
                        supermarket_id=self.scraper_id,
                        source_url=(link.get("href") if link else None) or url,
                    )
                )
            except Exception as err:  # noqa: BLE001
                self.log.warning("Item omitido: %s", err)
                continue
        return results

    def _load_fixtures(self) -> List[RawProduct]:
        with open(_FIXTURE, encoding="utf-8") as fh:
            rows = json.load(fh)
        return [
            RawProduct(
                raw_name=r["raw_name"],
                price=float(r["price"]),
                unit=r.get("unit", "un"),
                supermarket_id=self.scraper_id,
                raw_brand=r.get("raw_brand"),
                category=r.get("category"),
                source_url=self.target_url or "fixture://riba-smith",
            )
            for r in rows
        ]
