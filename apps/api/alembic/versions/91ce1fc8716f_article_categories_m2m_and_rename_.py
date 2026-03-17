"""article_categories M2M and rename category_id to primary_category_id

Revision ID: 91ce1fc8716f
Revises: 09f3bb7abdfa
Create Date: 2026-03-17 23:03:18.519314

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91ce1fc8716f'
down_revision: Union[str, Sequence[str], None] = '09f3bb7abdfa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """M2M категории: junction table + rename category_id → primary_category_id."""
    # 1. Junction table
    op.create_table(
        'article_categories',
        sa.Column('article_id', sa.Uuid(), nullable=False),
        sa.Column('category_id', sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(['article_id'], ['articles.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('article_id', 'category_id'),
    )

    # 2. Rename column (сохраняет данные)
    op.alter_column('articles', 'category_id', new_column_name='primary_category_id')

    # 3. Пересоздаём FK: CASCADE → RESTRICT
    op.drop_constraint('articles_category_id_fkey', 'articles', type_='foreignkey')
    op.create_foreign_key(
        'fk_articles_primary_category_id',
        'articles', 'categories',
        ['primary_category_id'], ['id'],
        ondelete='RESTRICT',
    )

    # 4. Populate junction: primary category всегда включена в M2M
    op.execute(sa.text("""
        INSERT INTO article_categories (article_id, category_id)
        SELECT id, primary_category_id FROM articles
        WHERE primary_category_id IS NOT NULL
    """))


def downgrade() -> None:
    """Откат: убираем junction, переименовываем обратно."""
    op.drop_table('article_categories')

    op.drop_constraint('fk_articles_primary_category_id', 'articles', type_='foreignkey')
    op.alter_column('articles', 'primary_category_id', new_column_name='category_id')
    op.create_foreign_key(
        'articles_category_id_fkey',
        'articles', 'categories',
        ['category_id'], ['id'],
        ondelete='CASCADE',
    )
