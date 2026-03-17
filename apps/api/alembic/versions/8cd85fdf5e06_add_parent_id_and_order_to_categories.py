"""add parent_id and order to categories

Revision ID: 8cd85fdf5e06
Revises: 80edaebaf964
Create Date: 2026-03-17 18:06:23.265322

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8cd85fdf5e06'
down_revision: Union[str, Sequence[str], None] = '80edaebaf964'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """PW-051: parent_id (1 уровень вложенности) + order (сортировка)."""
    op.add_column('categories', sa.Column('parent_id', sa.Uuid(), nullable=True))
    op.add_column('categories', sa.Column('order', sa.Integer(), server_default='0', nullable=False))
    op.create_foreign_key('fk_categories_parent_id', 'categories', 'categories', ['parent_id'], ['id'], ondelete='SET NULL')


def downgrade() -> None:
    op.drop_constraint('fk_categories_parent_id', 'categories', type_='foreignkey')
    op.drop_column('categories', 'order')
    op.drop_column('categories', 'parent_id')
