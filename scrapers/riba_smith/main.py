"""Entry point del scraper de Riba Smith."""
from riba_smith.ribasmith_scraper import RibaSmithScraper


def main() -> None:
    RibaSmithScraper().start()


if __name__ == "__main__":
    main()
