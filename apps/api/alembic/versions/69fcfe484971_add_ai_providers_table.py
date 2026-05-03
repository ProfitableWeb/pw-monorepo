"""add ai_providers table

Revision ID: 69fcfe484971
Revises: d16c5e1680ab
Create Date: 2026-03-25 14:07:27.740243

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '69fcfe484971'
down_revision: Union[str, Sequence[str], None] = 'd16c5e1680ab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """PW-064: таблица AI-провайдеров."""
    op.create_table('ai_providers',
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('api_type', sa.String(length=50), nullable=False),
    sa.Column('api_key_encrypted', sa.Text(), nullable=False),
    sa.Column('api_key_prefix', sa.String(length=20), nullable=False),
    sa.Column('base_url', sa.String(length=500), nullable=True),
    sa.Column('model_name', sa.String(length=200), nullable=False),
    sa.Column('is_default', sa.Boolean(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('max_context_tokens', sa.Integer(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Откат: удаление таблицы ai_providers."""
    op.drop_table('ai_providers')
