"""add_color_and_group_to_tags

Revision ID: 2b1777f7fa6d
Revises: 8cd85fdf5e06
Create Date: 2026-03-17 19:17:58.015263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2b1777f7fa6d'
down_revision: Union[str, Sequence[str], None] = '8cd85fdf5e06'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('tags', sa.Column('color', sa.String(length=7), nullable=True))
    op.add_column('tags', sa.Column('group', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('tags', 'group')
    op.drop_column('tags', 'color')
