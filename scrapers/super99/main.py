"""Entry point del scraper de Super 99."""
from super99.super99_scraper import Super99Scraper


def main() -> None:
    Super99Scraper().start()


if __name__ == "__main__":
    main()
