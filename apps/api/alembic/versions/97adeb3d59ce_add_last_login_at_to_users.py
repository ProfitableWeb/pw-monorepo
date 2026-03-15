"""add last_login_at to users

Revision ID: 97adeb3d59ce
Revises: 47bc10d4eaf5
Create Date: 2026-03-15 16:26:36.981039

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '97adeb3d59ce'
down_revision: Union[str, Sequence[str], None] = '47bc10d4eaf5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('last_login_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'last_login_at')
