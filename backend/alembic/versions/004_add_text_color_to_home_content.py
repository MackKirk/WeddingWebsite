"""Add text_color to home_content

Revision ID: 004_add_text_color_to_home_content
Revises: 003_add_timeline_event_fields
Create Date: 2024-12-08 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004_add_text_color_to_home_content'
down_revision = '003_add_timeline_event_fields'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('home_content', sa.Column('text_color', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('home_content', 'text_color')

