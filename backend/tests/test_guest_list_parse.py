import pytest
from app.services.guest_list_parse import parse_line, parse_pasted_text


def test_single_guest():
    r = parse_line("Adelina Petta")
    assert r["participants"] == ["Adelina Petta"]


def test_couple_shared_surname():
    r = parse_line("Raphael & Amanda Coelho")
    assert r["participants"] == ["Raphael Coelho", "Amanda Coelho"]


def test_couple_two_full_names():
    r = parse_line("Amy Bachmann & Chris McCarten")
    assert r["participants"] == ["Amy Bachmann", "Chris McCarten"]


def test_couple_derksen():
    r = parse_line("Aaron & Kendall Derkson")
    assert r["participants"] == ["Aaron Derkson", "Kendall Derkson"]


def test_multiline_paste():
    text = "Adelina Petta\nRaphael & Amanda Coelho\nAmy Bachmann & Chris McCarten"
    rows = parse_pasted_text(text)
    assert len(rows) == 3
    assert rows[0]["participants"] == ["Adelina Petta"]


def test_empty_lines_skipped():
    rows = parse_pasted_text("A\n\nB")
    assert len(rows) == 2
