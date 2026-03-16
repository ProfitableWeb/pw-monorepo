"""PW-048 | Proxy-сервис Яндекс Вебмастера — индексация, SQI, запросы."""

from datetime import date, timedelta

import httpx

from src.schemas.seo import (
    IndexingCounts,
    WebmasterIndexingResponse,
    WebmasterQueriesResponse,
    WebmasterQueryItem,
    WebmasterSummaryResponse,
)
from src.services.seo._common import check_response, oauth_headers

WEBMASTER_API = "https://api.webmaster.yandex.net/v4"


def get_user_id(token: str) -> str:
    """Получает Yandex user_id для Webmaster API."""
    with httpx.Client(timeout=10) as client:
        resp = client.get(f"{WEBMASTER_API}/user/", headers=oauth_headers(token))
        check_response(resp)
        return str(resp.json()["user_id"])


def get_host_id(token: str, user_id: str, host_url: str = "https://profitableweb.ru") -> str | None:
    """Находит host_id по URL сайта в списке хостов пользователя."""
    with httpx.Client(timeout=10) as client:
        resp = client.get(
            f"{WEBMASTER_API}/user/{user_id}/hosts/",
            headers=oauth_headers(token),
        )
        check_response(resp)
        hosts = resp.json().get("hosts", [])

    # host_url в API возвращается как "https:profitableweb.ru:443"
    normalized = host_url.rstrip("/")
    for host in hosts:
        ascii_host = host.get("ascii_host_url", "")
        unicode_host = host.get("unicode_host_url", "")
        host_id = host.get("host_id", "")

        if normalized in (ascii_host, unicode_host):
            return host_id
        # Формат Яндекса: "https:profitableweb.ru:443"
        if normalized.replace("://", ":").rstrip("/") + ":443" == host_id:
            return host_id

    return None


def get_summary(token: str, user_id: str, host_id: str) -> WebmasterSummaryResponse:
    """Обзор сайта: SQI, количество страниц, проблемы."""
    with httpx.Client(timeout=10) as client:
        resp = client.get(
            f"{WEBMASTER_API}/user/{user_id}/hosts/{host_id}/summary/",
            headers=oauth_headers(token),
        )
        check_response(resp)
        summary = resp.json()

    sqi = summary.get("sqi", 0)
    searchable = summary.get("searchable_pages_count", 0)
    excluded = summary.get("excluded_pages_count", 0)
    problems = summary.get("site_problems", {}).get("problems_count", 0)

    # SQI-история — пока возвращаем текущее значение (нет простого endpoint для истории)
    return WebmasterSummaryResponse(
        sqi=sqi,
        searchable_pages=searchable,
        excluded_pages=excluded,
        site_problems=problems,
        sqi_history=[sqi],
    )


def get_indexing(token: str, user_id: str, host_id: str) -> WebmasterIndexingResponse:
    """Статус индексации: проиндексировано / в очереди / исключено."""
    with httpx.Client(timeout=10) as client:
        end = date.today()
        start = end - timedelta(days=29)
        resp = client.get(
            f"{WEBMASTER_API}/user/{user_id}/hosts/{host_id}/indexing/history/",
            headers=oauth_headers(token),
            params={
                "date_from": start.isoformat(),
                "date_to": end.isoformat(),
            },
        )
        check_response(resp)
        data = resp.json()

    indicators = data.get("indicators", {})

    # Извлекаем последние значения из истории
    searchable = indicators.get("SEARCHABLE", [])
    excluded_items = indicators.get("SITE_ERROR", [])

    searchable_count = searchable[-1].get("value", 0) if searchable else 0
    excluded_count = excluded_items[-1].get("value", 0) if excluded_items else 0
    total = searchable_count + excluded_count
    pending_count = 0  # Вебмастер API не выдаёт "pending" напрямую

    def _pct(count: int) -> int:
        return round(count / total * 100) if total > 0 else 0

    history = [item.get("value", 0) for item in searchable]

    return WebmasterIndexingResponse(
        indexed=IndexingCounts(count=searchable_count, percent=_pct(searchable_count)),
        pending=IndexingCounts(count=pending_count, percent=_pct(pending_count)),
        excluded=IndexingCounts(count=excluded_count, percent=_pct(excluded_count)),
        history=history,
        last_updated=end.isoformat(),
    )


def get_top_queries(
    token: str,
    user_id: str,
    host_id: str,
    limit: int = 5,
) -> WebmasterQueriesResponse:
    """Популярные поисковые запросы."""
    with httpx.Client(timeout=15) as client:
        end = date.today()
        start = end - timedelta(days=29)
        resp = client.post(
            f"{WEBMASTER_API}/user/{user_id}/hosts/{host_id}/search-queries/all/",
            headers=oauth_headers(token),
            json={
                "date_from": start.isoformat(),
                "date_to": end.isoformat(),
                "query_indicator": "TOTAL_SHOWS",
                "order_by": "TOTAL_SHOWS",
                "limit": limit,
            },
        )
        check_response(resp)
        data = resp.json()

    queries = []
    for item in data.get("queries", []):
        query_text = item.get("query_text", "")
        indicators = item.get("indicators", {})
        shows = indicators.get("TOTAL_SHOWS", 0)
        position = indicators.get("AVG_SHOW_POSITION", 0.0)
        queries.append(
            WebmasterQueryItem(
                query=query_text,
                position=round(position, 1),
                impressions=int(shows),
            )
        )

    return WebmasterQueriesResponse(queries=queries)
