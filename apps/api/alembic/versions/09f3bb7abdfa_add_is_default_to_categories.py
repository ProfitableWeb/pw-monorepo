"""add is_default to categories + seed default category

Revision ID: 09f3bb7abdfa
Revises: 2b1777f7fa6d
Create Date: 2026-03-17 22:08:41.643454

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '09f3bb7abdfa'
down_revision: Union[str, Sequence[str], None] = '2b1777f7fa6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'categories',
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
    )

    # Максимум одна категория по умолчанию (partial unique index)
    op.create_index(
        'uq_categories_is_default',
        'categories',
        ['is_default'],
        unique=True,
        postgresql_where=sa.text('is_default = true'),
    )

    # Seed: «Без категории» — системная категория по умолчанию
    op.execute(sa.text("""
        INSERT INTO categories (id, name, slug, is_default, "order", created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'Без категории',
            'uncategorized',
            TRUE,
            999,
            NOW(),
            NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET is_default = TRUE
    """))


def downgrade() -> None:
    """Downgrade schema."""
    op.execute(sa.text("""
        DELETE FROM categories WHERE slug = 'uncategorized' AND is_default = TRUE
    """))
    op.drop_index('uq_categories_is_default', table_name='categories')
    op.drop_column('categories', 'is_default')
