"""PW-084: регрессия MCP media tools — обращение к несуществующим полям MediaFile."""

import base64
import io
import json
from types import SimpleNamespace

import pytest
from PIL import Image
from sqlalchemy import select

import src.services.storage as storage_module
from src.mcp.tools import media as media_tools
from src.models.user import User
from src.services.storage import LocalStorage

from .conftest import TestSessionLocal


class _FakeMcpServer:
    """Собирает зарегистрированные tools в словарь, чтобы вызывать их напрямую."""

    def __init__(self) -> None:
        self.tools: dict = {}

    def tool(self):
        def decorator(fn):
            self.tools[fn.__name__] = fn
            return fn

        return decorator


@pytest.fixture()
def tools(monkeypatch, tmp_path):
    local = LocalStorage()
    local._root = tmp_path
    monkeypatch.setattr(storage_module, "storage", local)
    monkeypatch.setattr(media_tools, "get_db", TestSessionLocal)

    server = _FakeMcpServer()
    media_tools.register(server)
    return server.tools


@pytest.fixture()
def ctx():
    db = TestSessionLocal()
    user = db.scalars(select(User)).first()
    db.close()
    state = SimpleNamespace(mcp_user=user, mcp_key=None)
    return SimpleNamespace(
        request_context=SimpleNamespace(request=SimpleNamespace(state=state))
    )


def _png_base64() -> str:
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), "purple").save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def test_media_tools_roundtrip(tools, ctx):
    uploaded = json.loads(
        tools["upload_media"](
            filename="cover.png",
            content_base64=_png_base64(),
            alt_text="Обложка",
            ctx=ctx,
        )
    )
    assert "error" not in uploaded
    assert uploaded["url"].endswith(".webp")
    media_id = uploaded["id"]

    got = json.loads(tools["get_media"](media_id=media_id, ctx=ctx))
    assert got["filename"] == "cover.png"
    assert got["alt"] == "Обложка"
    assert got["size"] > 0
    assert got["url"] == uploaded["url"]

    updated = json.loads(
        tools["update_media_metadata"](
            media_id=media_id, alt_text="Новый alt", caption="Подпись", ctx=ctx
        )
    )
    assert "error" not in updated

    got = json.loads(tools["get_media"](media_id=media_id, ctx=ctx))
    assert got["alt"] == "Новый alt"
    assert got["caption"] == "Подпись"

    listed = json.loads(tools["list_media"](ctx=ctx))
    assert any(f["id"] == media_id and f["alt"] == "Новый alt" for f in listed["files"])
