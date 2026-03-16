"""add seo settings to system_settings

Revision ID: 4f053e5a643f
Revises: 97adeb3d59ce
Create Date: 2026-03-16 14:22:12.500276

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '4f053e5a643f'
down_revision: Union[str, Sequence[str], None] = '97adeb3d59ce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('system_settings', sa.Column('sitemap_config', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False))
    op.add_column('system_settings', sa.Column('robots_txt', sa.Text(), server_default='', nullable=False))
    op.add_column('system_settings', sa.Column('rss_config', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False))
    op.add_column('system_settings', sa.Column('default_meta_directives', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False))
    op.add_column('system_settings', sa.Column('metrika_config', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('system_settings', 'metrika_config')
    op.drop_column('system_settings', 'default_meta_directives')
    op.drop_column('system_settings', 'rss_config')
    op.drop_column('system_settings', 'robots_txt')
    op.drop_column('system_settings', 'sitemap_config')
