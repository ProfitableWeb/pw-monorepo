"""add toc JSONB column to articles

Revision ID: b3c4d5e6f7a8
Revises: 91ce1fc8716f
Create Date: 2026-03-20 19:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = 'b3c4d5e6f7a8'
down_revision: Union[str, Sequence[str], None] = '91ce1fc8716f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('articles', sa.Column('toc', JSONB, nullable=True))


def downgrade() -> None:
    op.drop_column('articles', 'toc')
