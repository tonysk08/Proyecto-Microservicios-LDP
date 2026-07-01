"""Utilidades de normalización de nombres y unidades."""
from __future__ import annotations

import re
import unicodedata

_UNIT_ALIASES = {
    "lt": "l",
    "lts": "l",
    "litro": "l",
    "litros": "l",
    "l": "l",
    "ml": "ml",
    "kg": "kg",
    "kgs": "kg",
    "g": "g",
    "gr": "g",
    "grs": "g",
    "un": "un",
    "und": "un",
    "unidad": "un",
}


def strip_accents(text: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn"
    )


def normalize_name(name: str) -> str:
    """'LECHE ENTERA 1 LT.' -> 'leche entera 1 l'."""
    text = strip_accents(name or "").lower()
    text = re.sub(r"[^a-z0-9\s.,]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def normalize_unit(unit: str) -> str:
    key = strip_accents(unit or "").lower().strip().rstrip(".")
    return _UNIT_ALIASES.get(key, key or "un")


def parse_price(text: str) -> float | None:
    """Extrae el primer número tipo precio de un texto ('B/. 1,75' -> 1.75)."""
    if text is None:
        return None
    match = re.search(r"\d+(?:[.,]\d{1,2})?", str(text).replace(",", "."))
    return float(match.group()) if match else None
