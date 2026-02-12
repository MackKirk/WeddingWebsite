"""Add theme area colors to home_content

Revision ID: 006_add_theme_area_colors
Revises: 005_add_navbar_color
Create Date: 2024-12-08 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '006_add_theme_area_colors'
down_revision = '005_add_navbar_color'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('home_content', sa.Column('navbar_text_color', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('accent_color', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('body_bg_color', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('body_heading_color', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('body_text_color', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('footer_bg_color', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('footer_text_color', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('home_content', 'footer_text_color')
    op.drop_column('home_content', 'footer_bg_color')
    op.drop_column('home_content', 'body_text_color')
    op.drop_column('home_content', 'body_heading_color')
    op.drop_column('home_content', 'body_bg_color')
    op.drop_column('home_content', 'accent_color')
    op.drop_column('home_content', 'navbar_text_color')
