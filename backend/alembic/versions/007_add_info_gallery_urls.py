"""Add gallery_urls to wedding_info_sections for multiple images

Revision ID: 007_add_info_gallery_urls
Revises: 006_add_theme_area_colors
Create Date: 2024-12-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '007_add_info_gallery_urls'
down_revision = '006_add_theme_area_colors'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('wedding_info_sections', sa.Column('gallery_urls', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('wedding_info_sections', 'gallery_urls')
