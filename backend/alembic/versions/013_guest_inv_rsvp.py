"""Guest invitations table + RSVP attendance and FK

Revision ID: 013_guest_inv_rsvp
Revises: 012_add_rsvp_song_request
Create Date: 2025-02-18 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "013_guest_inv_rsvp"
down_revision = "012_add_rsvp_song_request"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "guest_invitations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("display_label", sa.String(length=500), nullable=False),
        sa.Column("participants", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_guest_invitations_id"), "guest_invitations", ["id"], unique=False)
    op.create_index(op.f("ix_guest_invitations_display_label"), "guest_invitations", ["display_label"], unique=False)

    op.add_column("rsvps", sa.Column("guest_invitation_id", sa.Integer(), nullable=True))
    op.add_column("rsvps", sa.Column("attendance_json", sa.Text(), nullable=True))
    op.create_foreign_key(
        "fk_rsvps_guest_invitation_id",
        "rsvps",
        "guest_invitations",
        ["guest_invitation_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_rsvps_guest_invitation_id", "rsvps", type_="foreignkey")
    op.drop_column("rsvps", "attendance_json")
    op.drop_column("rsvps", "guest_invitation_id")
    op.drop_index(op.f("ix_guest_invitations_display_label"), table_name="guest_invitations")
    op.drop_index(op.f("ix_guest_invitations_id"), table_name="guest_invitations")
    op.drop_table("guest_invitations")
