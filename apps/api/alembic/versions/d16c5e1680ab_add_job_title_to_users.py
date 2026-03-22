"""add job_title to users

Revision ID: d16c5e1680ab
Revises: 88869c480deb
Create Date: 2026-03-22 14:49:29.478595

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd16c5e1680ab'
down_revision: Union[str, Sequence[str], None] = '88869c480deb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('job_title', sa.String(length=200), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'job_title')
