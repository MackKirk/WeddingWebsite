"""Add card background colors to home_content (timeline, info, rsvp)

Revision ID: 010_add_card_bg_colors
Revises: 009_add_story_image_section_id
Create Date: 2025-02-17 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '010_add_card_bg_colors'
down_revision = '009_add_story_image_section_id'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('home_content', sa.Column('card_bg_timeline', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('card_bg_info', sa.String(), nullable=True))
    op.add_column('home_content', sa.Column('card_bg_rsvp', sa.String(), nullable=True))
    # Default for existing rows (champagne)
    op.execute("UPDATE home_content SET card_bg_timeline = '#F5E6D3' WHERE card_bg_timeline IS NULL")
    op.execute("UPDATE home_content SET card_bg_info = '#F5E6D3' WHERE card_bg_info IS NULL")
    op.execute("UPDATE home_content SET card_bg_rsvp = '#F5E6D3' WHERE card_bg_rsvp IS NULL")


def downgrade() -> None:
    op.drop_column('home_content', 'card_bg_rsvp')
    op.drop_column('home_content', 'card_bg_info')
    op.drop_column('home_content', 'card_bg_timeline')
