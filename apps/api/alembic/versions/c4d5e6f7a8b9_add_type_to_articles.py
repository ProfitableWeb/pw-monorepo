"""add type column to articles (article/page)

Revision ID: c4d5e6f7a8b9
Revises: b3c4d5e6f7a8
Create Date: 2026-03-21 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4d5e6f7a8b9'
down_revision: Union[str, Sequence[str], None] = 'b3c4d5e6f7a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'articles',
        sa.Column('type', sa.String(20), nullable=False, server_default='article'),
    )
    op.create_index('ix_articles_type', 'articles', ['type'])


def downgrade() -> None:
    op.drop_index('ix_articles_type', table_name='articles')
    op.drop_column('articles', 'type')
