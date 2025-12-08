"""Add image_url and additional_info to wedding_info_sections

Revision ID: 002_add_info_section_fields
Revises: 001_initial
Create Date: 2024-12-08 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_add_info_section_fields'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('wedding_info_sections', sa.Column('image_url', sa.String(), nullable=True))
    op.add_column('wedding_info_sections', sa.Column('additional_info', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('wedding_info_sections', 'additional_info')
    op.drop_column('wedding_info_sections', 'image_url')

