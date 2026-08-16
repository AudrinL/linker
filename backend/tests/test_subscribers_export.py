"""
The subscriber CSV export.

Both columns are attacker-controlled — `source` is whatever the browser posted
to /newsletter — and the file is opened in Excel by staff. These tests pin the
two ways that combination used to go wrong.
"""

import csv
import io


def _rows(client, auth) -> list[list[str]]:
    r = client.get("/admin/subscribers.csv", headers=auth)
    assert r.status_code == 200
    return list(csv.reader(io.StringIO(r.text)))


def test_export_round_trips_through_a_csv_parser(client, auth):
    client.post("/newsletter", json={"email": "a@example.com", "source": "/contact"})

    rows = _rows(client, auth)
    assert rows[0] == ["email", "source", "created_at"]
    assert rows[1][0] == "a@example.com"
    assert rows[1][1] == "/contact"


def test_quotes_in_source_cannot_forge_columns(client, auth):
    # The old hand-rolled quoting closed the field here and let the rest of the
    # value be read as further columns.
    client.post(
        "/newsletter",
        json={"email": "b@example.com", "source": 'x","injected","2020-01-01'},
    )

    rows = _rows(client, auth)
    assert len(rows) == 2
    # Three columns, not five: the quotes stayed inside the value.
    assert len(rows[1]) == 3
    assert rows[1][1] == 'x","injected","2020-01-01'


def test_formula_prefixes_are_neutralised(client, auth):
    payloads = [
        ("c@example.com", '=HYPERLINK("http://evil","click")'),
        ("d@example.com", "+1+1"),
        ("e@example.com", "-1+1"),
        ("f@example.com", "@SUM(A1)"),
    ]
    for email, source in payloads:
        client.post("/newsletter", json={"email": email, "source": source})

    by_email = {r[0]: r[1] for r in _rows(client, auth)[1:]}
    for email, source in payloads:
        # Prefixed with an apostrophe, so Excel treats the cell as text. The
        # original value is still readable after it.
        assert by_email[email] == f"'{source}"


def test_ordinary_values_are_left_alone(client, auth):
    client.post("/newsletter", json={"email": "g@example.com", "source": "homepage"})

    by_email = {r[0]: r[1] for r in _rows(client, auth)[1:]}
    assert by_email["g@example.com"] == "homepage"
