"""004_pw038_article_seo_revisions_settings

PW-038: расширение Article (SEO, artifacts, content_format),
новые таблицы ArticleRevision и SystemSettings.

Revision ID: a1b2c3d4e5f6
Revises: 54973cba4d7d
Create Date: 2026-03-08

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "54973cba4d7d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- Article: новые SEO-поля, artifacts, content_format ---
    op.add_column("articles", sa.Column("content_format", sa.String(20), server_default="html", nullable=False))
    op.add_column("articles", sa.Column("meta_title", sa.String(500), nullable=True))
    op.add_column("articles", sa.Column("meta_description", sa.Text(), nullable=True))
    op.add_column("articles", sa.Column("canonical_url", sa.String(500), nullable=True))
    op.add_column("articles", sa.Column("og_title", sa.String(500), nullable=True))
    op.add_column("articles", sa.Column("og_description", sa.Text(), nullable=True))
    op.add_column("articles", sa.Column("og_image", sa.String(500), nullable=True))
    op.add_column("articles", sa.Column("focus_keyword", sa.String(200), nullable=True))
    op.add_column("articles", sa.Column("seo_keywords", postgresql.JSONB(), nullable=True))
    op.add_column("articles", sa.Column("schema_type", sa.String(50), server_default="BlogPosting", nullable=True))
    op.add_column("articles", sa.Column("robots_no_index", sa.Boolean(), server_default="false", nullable=False))
    op.add_column("articles", sa.Column("robots_no_follow", sa.Boolean(), server_default="false", nullable=False))
    op.add_column("articles", sa.Column("artifacts", postgresql.JSONB(), nullable=True))

    # --- ArticleRevision ---
    op.create_table(
        "article_revisions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("article_id", sa.Uuid(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("content_format", sa.String(20), server_default="html", nullable=False),
        sa.Column("summary", sa.String(500), nullable=True),
        sa.Column("author_id", sa.Uuid(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["article_id"], ["articles.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_article_revisions_article_created",
        "article_revisions",
        ["article_id", sa.text("created_at DESC")],
    )

    # --- SystemSettings ---
    op.create_table(
        "system_settings",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("timezone", sa.String(10), server_default="+03:00", nullable=False),
        sa.Column("updated_by", sa.Uuid(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    # Начальная строка с дефолтными настройками
    op.execute(
        "INSERT INTO system_settings (id, timezone) "
        "VALUES (gen_random_uuid(), '+03:00')"
    )


def downgrade() -> None:
    op.drop_table("system_settings")
    op.drop_index("ix_article_revisions_article_created", table_name="article_revisions")
    op.drop_table("article_revisions")
    op.drop_column("articles", "artifacts")
    op.drop_column("articles", "robots_no_follow")
    op.drop_column("articles", "robots_no_index")
    op.drop_column("articles", "schema_type")
    op.drop_column("articles", "seo_keywords")
    op.drop_column("articles", "focus_keyword")
    op.drop_column("articles", "og_image")
    op.drop_column("articles", "og_description")
    op.drop_column("articles", "og_title")
    op.drop_column("articles", "canonical_url")
    op.drop_column("articles", "meta_description")
    op.drop_column("articles", "meta_title")
    op.drop_column("articles", "content_format")
