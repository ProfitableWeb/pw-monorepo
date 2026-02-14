from fastapi.testclient import TestClient


def test_root(client: TestClient):
    r = client.get("/")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "operational"


def test_health(client: TestClient):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_list_categories(client: TestClient):
    r = client.get("/api/categories")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert len(data["data"]) == 6


def test_get_category_by_slug(client: TestClient):
    r = client.get("/api/categories/ai-automation")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["data"]["slug"] == "ai-automation"
    assert data["data"]["article_count"] > 0


def test_get_category_not_found(client: TestClient):
    r = client.get("/api/categories/nonexistent")
    assert r.status_code == 404


def test_list_articles(client: TestClient):
    r = client.get("/api/articles?limit=5")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert len(data["data"]) <= 5
    assert data["meta"]["total"] > 0
    assert data["meta"]["limit"] == 5


def test_list_articles_pagination(client: TestClient):
    r1 = client.get("/api/articles?page=1&limit=5")
    r2 = client.get("/api/articles?page=2&limit=5")
    d1 = r1.json()
    d2 = r2.json()
    # Different pages should have different articles
    slugs1 = {a["slug"] for a in d1["data"]}
    slugs2 = {a["slug"] for a in d2["data"]}
    assert len(slugs1 & slugs2) == 0


def test_get_article_by_slug(client: TestClient):
    r = client.get("/api/articles/telegram-bots-business")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["data"]["slug"] == "telegram-bots-business"
    assert data["data"]["category"] == "ai-automation"


def test_get_article_not_found(client: TestClient):
    r = client.get("/api/articles/nonexistent-slug")
    assert r.status_code == 404


def test_list_category_articles(client: TestClient):
    r = client.get("/api/categories/ui-ux-design/articles")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["meta"]["total"] > 0
    for article in data["data"]:
        assert article["category"] == "ui-ux-design"


def test_list_category_articles_not_found(client: TestClient):
    r = client.get("/api/categories/nonexistent/articles")
    assert r.status_code == 404


def test_article_comment_threads(client: TestClient):
    r = client.get("/api/articles/one-column-article/comments")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    threads = data["data"]
    assert len(threads) >= 2
    # Check thread structure
    for thread in threads:
        assert "root" in thread
        assert "replies" in thread
        assert thread["root"]["parent_id"] is None


def test_article_comments_empty(client: TestClient):
    # Article with no comments should return empty list
    r = client.get("/api/articles/telegram-bots-business/comments")
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["data"] == []


def test_articles_filter_by_category(client: TestClient):
    r = client.get("/api/articles?category=editorial-work")
    assert r.status_code == 200
    data = r.json()
    for article in data["data"]:
        assert article["category"] == "editorial-work"
