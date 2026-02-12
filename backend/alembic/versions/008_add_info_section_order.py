"""Add order to wedding_info_sections

Revision ID: 008_add_info_section_order
Revises: 007_add_info_gallery_urls
Create Date: 2024-12-09 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '008_add_info_section_order'
down_revision = '007_add_info_gallery_urls'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('wedding_info_sections', sa.Column('sort_order', sa.Integer(), nullable=True, server_default='0'))
    op.execute("UPDATE wedding_info_sections SET sort_order = id WHERE sort_order IS NULL OR sort_order = 0")
    op.alter_column('wedding_info_sections', 'sort_order', nullable=False)


def downgrade() -> None:
    op.drop_column('wedding_info_sections', 'sort_order')
