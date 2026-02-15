"""
PW-030 | Тесты аутентификации: register, login, refresh, logout, me,
protected endpoints, OAuth URLs.
"""

from fastapi.testclient import TestClient


def _register_user(client: TestClient, email: str, name: str = "Test User"):
    """Регистрирует пользователя и возвращает response."""
    return client.post(
        "/api/auth/register",
        json={"email": email, "password": "secret123", "name": name},
    )


def _get_auth_cookies(response) -> dict[str, str]:
    """Извлекает auth cookies из response."""
    cookies = {}
    for key in ("access_token", "refresh_token"):
        if key in response.cookies:
            cookies[key] = response.cookies[key]
    return cookies


def test_register(client: TestClient):
    r = _register_user(client, "reg@example.com")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Test User"
    assert data["email"] == "reg@example.com"
    assert data["role"] == "viewer"
    assert "access_token" in r.cookies
    assert "refresh_token" in r.cookies


def test_register_duplicate_email(client: TestClient):
    _register_user(client, "dup@example.com")
    r = _register_user(client, "dup@example.com", "Other")
    assert r.status_code == 409


def test_login(client: TestClient):
    _register_user(client, "login@example.com", "Login User")
    r = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "secret123"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "login@example.com"
    assert "access_token" in r.cookies


def test_login_wrong_password(client: TestClient):
    _register_user(client, "wrong@example.com")
    r = client.post(
        "/api/auth/login",
        json={"email": "wrong@example.com", "password": "incorrect"},
    )
    assert r.status_code == 401


def test_me_authenticated(client: TestClient):
    reg = _register_user(client, "me@example.com", "Me User")
    cookies = _get_auth_cookies(reg)
    # Устанавливаем cookies на клиент
    client.cookies.update(cookies)
    r = client.get("/api/auth/me")
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "me@example.com"
    client.cookies.clear()


def test_me_unauthenticated(client: TestClient):
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_refresh(client: TestClient):
    reg = _register_user(client, "refresh@example.com")
    cookies = _get_auth_cookies(reg)
    client.cookies.update(cookies)
    r = client.post("/api/auth/refresh")
    assert r.status_code == 200
    assert "access_token" in r.cookies
    client.cookies.clear()


def test_logout(client: TestClient):
    r = client.post("/api/auth/logout")
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_create_comment_authenticated(client: TestClient):
    reg = _register_user(client, "comm@example.com", "Commenter")
    cookies = _get_auth_cookies(reg)
    client.cookies.update(cookies)

    r = client.post(
        "/api/articles/one-column-article/comments",
        json={"content": "Auth test comment"},
    )
    assert r.status_code == 201
    data = r.json()
    assert data["success"] is True
    assert data["data"]["content"] == "Auth test comment"
    client.cookies.clear()


def test_create_comment_unauthenticated(client: TestClient):
    r = client.post(
        "/api/articles/one-column-article/comments",
        json={"content": "Should fail"},
    )
    assert r.status_code == 401


def test_oauth_url_yandex(client: TestClient):
    r = client.get("/api/auth/yandex/url")
    assert r.status_code == 200
    assert "oauth.yandex.ru" in r.json()["url"]


def test_oauth_url_google(client: TestClient):
    r = client.get("/api/auth/google/url")
    assert r.status_code == 200
    assert "accounts.google.com" in r.json()["url"]


def test_oauth_url_unknown_provider(client: TestClient):
    r = client.get("/api/auth/unknown/url")
    assert r.status_code == 400
