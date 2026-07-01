"""Entry point del scraper de El Machetazo."""
from el_machetazo.machetazo_scraper import MachetazoScraper


def main() -> None:
    MachetazoScraper().start()


if __name__ == "__main__":
    main()
