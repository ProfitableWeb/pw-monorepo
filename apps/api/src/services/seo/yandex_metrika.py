"""PW-048 | Proxy-сервис Яндекс.Метрики — реальные данные через API."""

from datetime import date, timedelta

import httpx

from src.schemas.seo import MetricWithChange, MetrikaStatsResponse
from src.services.seo._common import TokenExpiredError, check_response, oauth_headers

METRIKA_API = "https://api-metrika.yandex.net"

_VALID_PERIOD_RE = None  # ленивая инициализация


def _parse_period(period: str) -> tuple[date, date]:
    """Преобразует '1d' / '7d' / '30d' / '90d' в пару (date1, date2)."""
    if not period.endswith("d"):
        raise ValueError(f"Неверный формат периода: {period}. Ожидается '7d', '30d' и т.д.")
    try:
        days = int(period[:-1])
    except ValueError:
        raise ValueError(f"Неверный формат периода: {period}")
    if days <= 0:
        raise ValueError(f"Период должен быть > 0, получено {days}")
    end = date.today()
    start = end - timedelta(days=days - 1)
    return start, end


def _fetch_metrics(
    client: httpx.Client,
    token: str,
    counter_id: str,
    date1: date,
    date2: date,
) -> dict:
    """Запрашивает основные метрики за период."""
    resp = client.get(
        f"{METRIKA_API}/stat/v1/data",
        headers=oauth_headers(token),
        params={
            "id": counter_id,
            "metrics": (
                "ym:s:visits,"
                "ym:s:pageviews,"
                "ym:s:bounceRate,"
                "ym:s:avgVisitDurationSeconds,"
                "ym:s:pageDepth"
            ),
            "date1": date1.isoformat(),
            "date2": date2.isoformat(),
        },
    )
    check_response(resp)
    return resp.json()


def _fetch_daily_visits(
    client: httpx.Client,
    token: str,
    counter_id: str,
    date1: date,
    date2: date,
) -> list[int]:
    """Визиты по дням для графика."""
    resp = client.get(
        f"{METRIKA_API}/stat/v1/data/bytime",
        headers=oauth_headers(token),
        params={
            "id": counter_id,
            "metrics": "ym:s:visits",
            "date1": date1.isoformat(),
            "date2": date2.isoformat(),
            "group": "day",
        },
    )
    check_response(resp)
    data = resp.json()

    # Парсим ответ bytime: data → [{"metrics": [[v1, v2, ...]]}]
    try:
        metrics = data["data"][0]["metrics"][0]
        return [int(v) for v in metrics]
    except (KeyError, IndexError):
        return []


def _safe_val(totals: list, idx: int) -> float:
    """Безопасное извлечение метрики из totals."""
    try:
        return float(totals[idx])
    except (IndexError, TypeError, ValueError):
        return 0.0


def get_stats(token: str, counter_id: str, period: str = "7d") -> MetrikaStatsResponse:
    """Получает полную статистику за период с вычислением изменений."""
    date1, date2 = _parse_period(period)
    days = int(period[:-1])

    # Предыдущий аналогичный период для расчёта change
    prev_date2 = date1 - timedelta(days=1)
    prev_date1 = prev_date2 - timedelta(days=days - 1)

    # Один клиент — переиспользование TCP-соединения для всех запросов
    with httpx.Client(timeout=15) as client:
        current = _fetch_metrics(client, token, counter_id, date1, date2)
        previous = _fetch_metrics(client, token, counter_id, prev_date1, prev_date2)
        daily = _fetch_daily_visits(client, token, counter_id, date1, date2)

    cur_totals = current.get("totals", [0, 0, 0, 0, 0])
    prev_totals = previous.get("totals", [0, 0, 0, 0, 0])

    def _change(cur_idx: int) -> float:
        cur_v = _safe_val(cur_totals, cur_idx)
        prev_v = _safe_val(prev_totals, cur_idx)
        if prev_v == 0:
            return 0.0
        return round((cur_v - prev_v) / prev_v * 100, 1)

    return MetrikaStatsResponse(
        period=period,
        visitors=MetricWithChange(
            value=_safe_val(cur_totals, 0), change=_change(0)
        ),
        pageviews=MetricWithChange(
            value=_safe_val(cur_totals, 1), change=_change(1)
        ),
        bounce_rate=MetricWithChange(
            value=round(_safe_val(cur_totals, 2), 1), change=_change(2)
        ),
        avg_duration=MetricWithChange(
            value=round(_safe_val(cur_totals, 3), 0), change=_change(3)
        ),
        page_depth=MetricWithChange(
            value=round(_safe_val(cur_totals, 4), 1), change=_change(4)
        ),
        daily_visits=daily,
    )
