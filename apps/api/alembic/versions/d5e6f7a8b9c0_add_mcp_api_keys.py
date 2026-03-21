"""PW-061-B: add mcp_api_keys table

Revision ID: d5e6f7a8b9c0
Revises: c4d5e6f7a8b9
Create Date: 2026-03-21 22:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

revision: str = "d5e6f7a8b9c0"
down_revision = "c4d5e6f7a8b9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mcp_api_keys",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("key_hash", sa.String(64), nullable=False),
        sa.Column("key_prefix", sa.String(12), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("scope", sa.String(10), nullable=False, server_default="read"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("last_used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], ondelete="CASCADE"
        ),
    )
    op.create_index("ix_mcp_api_keys_key_hash", "mcp_api_keys", ["key_hash"], unique=True)
    op.create_index("ix_mcp_api_keys_user_id", "mcp_api_keys", ["user_id"])
    op.create_index("ix_mcp_api_keys_is_active", "mcp_api_keys", ["is_active"])


def downgrade() -> None:
    op.drop_index("ix_mcp_api_keys_is_active", table_name="mcp_api_keys")
    op.drop_index("ix_mcp_api_keys_user_id", table_name="mcp_api_keys")
    op.drop_index("ix_mcp_api_keys_key_hash", table_name="mcp_api_keys")
    op.drop_table("mcp_api_keys")
