"""
Parse pasted guest list lines into display_label + participants for RSVP.
Heuristics are imperfect; admin review corrects edge cases.
"""
import re
from typing import List, Dict, Any


def _split_ampersand_segments(line: str) -> List[str]:
    return [p.strip() for p in re.split(r"\s*&\s*", line) if p.strip()]


def _split_comma_names(segment: str) -> List[str]:
    """Split 'Amy, Eric, Bob' into separate first-pass names (trim)."""
    parts = [p.strip() for p in segment.split(",") if p.strip()]
    return parts if len(parts) > 1 else [segment.strip()]


def _couple_two_parts(left: str, right: str) -> List[str]:
    lw = left.split()
    rw = right.split()
    if len(lw) >= 2 and len(rw) >= 2:
        return [left, right]
    if len(lw) == 1 and len(rw) >= 2:
        surname = rw[-1]
        return [f"{lw[0]} {surname}", right]
    if len(lw) >= 2 and len(rw) == 1:
        surname = lw[-1]
        return [left, f"{rw[0]} {surname}"]
    return [left, right]


def parse_line(line: str) -> Dict[str, Any]:
    """
    Return { "display_label": str, "participants": List[str] }.
    """
    raw = line.strip()
    if not raw:
        return {"display_label": "", "participants": []}

    display_label = raw

    if "&" not in raw:
        comma_parts = _split_comma_names(raw)
        if len(comma_parts) > 1:
            return {"display_label": display_label, "participants": comma_parts}
        return {"display_label": display_label, "participants": [raw]}

    segments = _split_ampersand_segments(raw)
    if len(segments) == 1:
        return {"display_label": display_label, "participants": [segments[0]]}
    if len(segments) == 2:
        return {"display_label": display_label, "participants": _couple_two_parts(segments[0], segments[1])}
    return {"display_label": display_label, "participants": segments}


def parse_pasted_text(text: str) -> List[Dict[str, Any]]:
    lines = [ln for ln in text.splitlines() if ln.strip()]
    return [parse_line(ln) for ln in lines]
