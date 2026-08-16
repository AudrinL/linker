def test_health_ok(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_oversized_body_rejected(client):
    r = client.post(
        "/inquiries",
        content=b"x" * (300 * 1024),
        headers={"Content-Type": "application/json"},
    )
    assert r.status_code == 413
