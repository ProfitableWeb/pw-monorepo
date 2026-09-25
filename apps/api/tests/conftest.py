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

TEST_DATABASE_URL = "sqlite:///./test.db"


# Тесты идут на SQLite, где нет JSONB — рендерим его как обычный JSON.
@compiles(JSONB, "sqlite")
def _compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"


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


@pytest.fixture(scope="session")
def _app_client():
    # MCP session manager в lifespan запускается только один раз на процесс,
    # поэтому lifespan поднимаем один раз на всю тестовую сессию.
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def client(db, _app_client):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    _app_client.cookies.clear()
    yield _app_client
    app.dependency_overrides.clear()
