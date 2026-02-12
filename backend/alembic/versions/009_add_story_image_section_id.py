"""Add section_id to story_images for per-section galleries

Revision ID: 009_add_story_image_section_id
Revises: 008_add_info_section_order
Create Date: 2024-12-10 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '009_add_story_image_section_id'
down_revision = '008_add_info_section_order'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('story_images', sa.Column('section_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_story_images_section_id',
        'story_images',
        'story_sections',
        ['section_id'],
        ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    op.drop_constraint('fk_story_images_section_id', 'story_images', type_='foreignkey')
    op.drop_column('story_images', 'section_id')
