"""Add image_url and additional_info to timeline_events

Revision ID: 003_add_timeline_event_fields
Revises: 002_add_info_section_fields
Create Date: 2024-12-08 21:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_add_timeline_event_fields'
down_revision = '002_add_info_section_fields'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('timeline_events', sa.Column('image_url', sa.String(), nullable=True))
    op.add_column('timeline_events', sa.Column('additional_info', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('timeline_events', 'additional_info')
    op.drop_column('timeline_events', 'image_url')

