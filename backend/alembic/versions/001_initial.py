"""Initial migration

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create all tables
    op.create_table(
        'home_content',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('hero_text', sa.String(), nullable=True),
        sa.Column('hero_image_url', sa.String(), nullable=True),
        sa.Column('wedding_date', sa.Date(), nullable=True),
        sa.Column('subtitle', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'story_sections',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'story_images',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('caption', sa.String(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'wedding_info_sections',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('section_type', sa.String(), nullable=False),
        sa.Column('map_embed_url', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'timeline_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('time', sa.Time(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'gallery_images',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=False),
        sa.Column('caption', sa.String(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'gift_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('link', sa.String(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('item_type', sa.String(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'rsvps',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('guest_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('num_attendees', sa.Integer(), nullable=False),
        sa.Column('dietary_restrictions', sa.Text(), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table(
        'admin_users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
    )


def downgrade() -> None:
    op.drop_table('admin_users')
    op.drop_table('rsvps')
    op.drop_table('gift_items')
    op.drop_table('gallery_images')
    op.drop_table('timeline_events')
    op.drop_table('wedding_info_sections')
    op.drop_table('story_images')
    op.drop_table('story_sections')
    op.drop_table('home_content')

