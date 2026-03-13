"""Add song_request to rsvps

Revision ID: 012_add_rsvp_song_request
Revises: 011_add_logo_text_color
Create Date: 2025-02-17 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '012_add_rsvp_song_request'
down_revision = '011_add_logo_text_color'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('rsvps', sa.Column('song_request', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('rsvps', 'song_request')
