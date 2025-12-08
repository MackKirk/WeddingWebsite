"""Add navbar_color to home_content

Revision ID: 005_add_navbar_color
Revises: 004_add_text_color
Create Date: 2024-12-08 22:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '005_add_navbar_color'
down_revision = '004_add_text_color'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('home_content', sa.Column('navbar_color', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('home_content', 'navbar_color')

