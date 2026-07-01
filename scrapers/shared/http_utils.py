"""Robustez anti-bloqueo: delays aleatorios, rotación de User-Agent, robots.txt (LDP-084)."""
from __future__ import annotations

import logging
import random
import time
from urllib import robotparser
from urllib.parse import urlparse

import requests

logger = logging.getLogger("http_utils")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
]


def random_user_agent() -> str:
    return random.choice(USER_AGENTS)


def random_delay(min_s: float = 0.5, max_s: float = 2.0) -> None:
    time.sleep(random.uniform(min_s, max_s))


def is_allowed_by_robots(url: str, user_agent: str = "*") -> bool:
    """Respeta robots.txt. Si no se puede leer, asume permitido (best-effort)."""
    try:
        parsed = urlparse(url)
        robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
        rp = robotparser.RobotFileParser()
        rp.set_url(robots_url)
        rp.read()
        return rp.can_fetch(user_agent, url)
    except Exception as err:  # noqa: BLE001
        logger.warning("No se pudo leer robots.txt (%s); se asume permitido", err)
        return True


def polite_get(url: str, timeout: int = 15) -> requests.Response:
    """GET con User-Agent rotativo, delay aleatorio y verificación de robots.txt."""
    ua = random_user_agent()
    if not is_allowed_by_robots(url, ua):
        raise PermissionError(f"robots.txt no permite scrapear {url}")
    random_delay()
    response = requests.get(url, headers={"User-Agent": ua}, timeout=timeout)
    response.raise_for_status()
    return response
