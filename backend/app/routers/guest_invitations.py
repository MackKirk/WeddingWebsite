import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.admin_user import AdminUser
from app.models.guest_invitation import GuestInvitation
from app.schemas.guest_invitation import (
    GuestInvitationOut,
    PreviewParseRequest,
    PreviewParseResponse,
    ParsedRow,
    ReplaceInvitationsRequest,
)
from app.services.guest_list_parse import parse_pasted_text

router = APIRouter(prefix="/api/guest-invitations", tags=["guest-invitations"])

SEARCH_LIMIT = 20


def _participants_list(inv: GuestInvitation) -> List[str]:
    try:
        data = json.loads(inv.participants)
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, TypeError):
        return []


@router.get("/search", response_model=List[GuestInvitationOut])
def search_guest_invitations(
    q: str = Query(..., min_length=1, max_length=200),
    db: Session = Depends(get_db),
):
    term = f"%{q.strip()}%"
    rows = (
        db.query(GuestInvitation)
        .filter(GuestInvitation.display_label.ilike(term))
        .order_by(GuestInvitation.display_label.asc())
        .limit(SEARCH_LIMIT)
        .all()
    )
    out = []
    for inv in rows:
        out.append(
            GuestInvitationOut(
                id=inv.id,
                display_label=inv.display_label,
                participants=_participants_list(inv),
            )
        )
    return out


@router.post("/admin/preview-parse", response_model=PreviewParseResponse)
def preview_parse(
    body: PreviewParseRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user),
):
    parsed = parse_pasted_text(body.text)
    rows = [
        ParsedRow(display_label=p["display_label"], participants=p["participants"])
        for p in parsed
        if p.get("display_label")
    ]
    return PreviewParseResponse(rows=rows)


@router.put("/admin/replace-all")
def replace_all_invitations(
    body: ReplaceInvitationsRequest,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user),
):
    for inv in body.invitations:
        if not inv.participants:
            raise HTTPException(status_code=400, detail=f"Empty participants for: {inv.display_label}")
    db.query(GuestInvitation).delete()
    for inv in body.invitations:
        row = GuestInvitation(
            display_label=inv.display_label[:500],
            participants=json.dumps(inv.participants),
        )
        db.add(row)
    db.commit()
    return {"ok": True, "count": len(body.invitations)}
