"""Add logo text color to home_content (navbar logo)

Revision ID: 011_add_logo_text_color
Revises: 010_add_card_bg_colors
Create Date: 2025-02-17 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '011_add_logo_text_color'
down_revision = '010_add_card_bg_colors'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('home_content', sa.Column('logo_text_color', sa.String(), nullable=True))
    op.execute("UPDATE home_content SET logo_text_color = '#D4B483' WHERE logo_text_color IS NULL")


def downgrade() -> None:
    op.drop_column('home_content', 'logo_text_color')
