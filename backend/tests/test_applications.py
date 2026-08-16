def test_create_and_detail(client, auth, application_payload):
    r = client.post("/applications", json=application_payload)
    assert r.status_code == 202
    id = r.json()["id"]

    detail = client.get(f"/admin/applications/{id}", headers=auth).json()
    assert detail["reference"] == "LWT-AB12CD"
    assert detail["values"]["sector"] == "Healthcare & Care"
    assert detail["documents"][0]["filename"] == "cv.pdf"
    assert detail["status"] == "new"


def test_honeypot_dropped(client, auth, application_payload):
    client.post("/applications", json={**application_payload, "website": "x"})
    assert client.get("/admin/applications", headers=auth).json() == []


def test_search_by_reference(client, auth, application_payload):
    client.post("/applications", json=application_payload)
    client.post(
        "/applications",
        json={**application_payload, "reference": "LWT-ZZ99ZZ", "name": "Eric"},
    )
    rows = client.get("/admin/applications?q=ZZ99", headers=auth).json()
    assert len(rows) == 1
    assert rows[0]["name"] == "Eric"


def test_status_transition(client, auth, application_payload):
    id = client.post("/applications", json=application_payload).json()["id"]
    r = client.patch(f"/admin/applications/{id}", json={"status": "approved"}, headers=auth)
    assert r.json()["status"] == "approved"
    assert client.get("/admin/applications?status=new", headers=auth).json() == []


def test_unknown_status_rejected(client, auth, application_payload):
    id = client.post("/applications", json=application_payload).json()["id"]
    r = client.patch(f"/admin/applications/{id}", json={"status": "vibes"}, headers=auth)
    assert r.status_code == 422


def test_missing_application_is_404(client, auth):
    assert client.get("/admin/applications/nope", headers=auth).status_code == 404


def test_oversized_values_rejected(client, application_payload):
    payload = {**application_payload, "values": {f"f{i}": "x" for i in range(200)}}
    assert client.post("/applications", json=payload).status_code == 422


def test_stats(client, auth, application_payload):
    client.post("/applications", json=application_payload)
    client.post(
        "/inquiries",
        json={"name": "A", "email": "a@example.com", "service": "travel", "message": "hi"},
    )
    client.post("/newsletter", json={"email": "n@example.com"})

    s = client.get("/admin/stats", headers=auth).json()
    assert s["applications_total"] == 1
    assert s["applications_new"] == 1
    assert s["inquiries_total"] == 1
    assert s["subscribers_total"] == 1
    assert s["by_service"] == {"work": 1, "travel": 1}
    assert s["by_status"] == {"new": 2}
    # 14 buckets, today's holding both of today's submissions.
    assert len(s["recent_days"]) == 14
    assert max(s["recent_days"].values()) == 2
