"""add yandex oauth to system_settings

Revision ID: 80edaebaf964
Revises: 4f053e5a643f
Create Date: 2026-03-16 15:09:04.168670

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '80edaebaf964'
down_revision: Union[str, Sequence[str], None] = '4f053e5a643f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('system_settings', sa.Column('yandex_oauth_token', sa.Text(), nullable=True))
    op.add_column('system_settings', sa.Column('yandex_oauth_account', sa.String(length=200), nullable=True))
    op.add_column('system_settings', sa.Column('yandex_oauth_scopes', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('system_settings', sa.Column('yandex_oauth_connected_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('system_settings', sa.Column('yandex_oauth_user_id', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('system_settings', 'yandex_oauth_user_id')
    op.drop_column('system_settings', 'yandex_oauth_connected_at')
    op.drop_column('system_settings', 'yandex_oauth_scopes')
    op.drop_column('system_settings', 'yandex_oauth_account')
    op.drop_column('system_settings', 'yandex_oauth_token')
