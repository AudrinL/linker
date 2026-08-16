BASE = {
    "name": "Jean Bosco",
    "email": "jean@example.com",
    "service": "study",
    "message": "I would like to study in Germany.",
}


def test_create_and_read_back(client, auth):
    r = client.post("/inquiries", json=BASE)
    assert r.status_code == 202
    assert r.json()["ok"] is True

    rows = client.get("/admin/inquiries", headers=auth).json()
    assert len(rows) == 1
    assert rows[0]["email"] == "jean@example.com"
    assert rows[0]["status"] == "new"


def test_honeypot_is_silently_dropped(client, auth):
    r = client.post("/inquiries", json={**BASE, "website": "http://spam.example"})
    # Same 202 a human gets — the bot learns nothing — but nothing is stored.
    assert r.status_code == 202
    assert client.get("/admin/inquiries", headers=auth).json() == []


def test_invalid_email_rejected(client):
    assert client.post("/inquiries", json={**BASE, "email": "not-an-email"}).status_code == 422


def test_status_and_note_update(client, auth):
    id = client.post("/inquiries", json=BASE).json()["id"]
    r = client.patch(
        f"/admin/inquiries/{id}",
        json={"status": "contacted", "note": "Called, sending brochure."},
        headers=auth,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "contacted"
    assert r.json()["note"] == "Called, sending brochure."


def test_patch_rejects_unknown_field(client, auth):
    id = client.post("/inquiries", json=BASE).json()["id"]
    r = client.patch(f"/admin/inquiries/{id}", json={"email": "hijack@example.com"}, headers=auth)
    assert r.status_code == 422


def test_filters(client, auth):
    client.post("/inquiries", json=BASE)
    client.post("/inquiries", json={**BASE, "name": "Chantal", "service": "travel"})

    assert len(client.get("/admin/inquiries?service=travel", headers=auth).json()) == 1
    assert len(client.get("/admin/inquiries?status=new", headers=auth).json()) == 2
    assert len(client.get("/admin/inquiries?q=chantal", headers=auth).json()) == 1


def test_newsletter_is_idempotent(client, auth):
    assert client.post("/newsletter", json={"email": "a@example.com"}).status_code == 201
    assert client.post("/newsletter", json={"email": "A@Example.com"}).status_code == 201
    assert len(client.get("/admin/subscribers", headers=auth).json()) == 1


def test_subscriber_csv_export(client, auth):
    client.post("/newsletter", json={"email": "a@example.com", "source": "footer"})
    r = client.get("/admin/subscribers.csv", headers=auth)
    assert r.status_code == 200
    assert "a@example.com" in r.text
