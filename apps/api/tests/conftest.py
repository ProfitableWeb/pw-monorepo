from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import sessionmaker

from src.core.database import get_db
from src.main import app
from src.models import Base
from src.seed import seed


# Модели используют JSONB (article.artifacts/toc, user.social_links,
# media_file.purposes, system_settings.*). На SQLite он не компилируется —
# подменяем на JSON, чтобы create_all() отрабатывал в тестах.
@compiles(JSONB, "sqlite")
def _compile_jsonb_sqlite(type_: Any, compiler: Any, **kw: Any) -> str:
    return "JSON"


TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestSessionLocal()
    seed(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


def _override_get_db():
    """Отдельная сессия на каждый запрос — как в проде (src.core.database)."""
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="session")
def _test_client():
    """
    TestClient создаётся один раз за сессию: lifespan приложения запускает
    MCP session manager, а он не переживает повторный run() на том же
    экземпляре (RuntimeError: StreamableHTTPSessionManager .run() once).
    """
    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def client(_test_client):
    return _test_client


@pytest.fixture(autouse=True)
def _clean_cookies(_test_client):
    """
    Клиент общий на всю сессию, поэтому cookie-jar чистится вокруг каждого
    теста — иначе авторизация «протекает» между тестами.
    """
    _test_client.cookies.clear()
    yield
    _test_client.cookies.clear()
