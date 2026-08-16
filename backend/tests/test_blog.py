def test_empty_list(client):
    r = client.get("/blog")
    assert r.status_code == 200
    assert r.json() == {"items": [], "count": 0}


def test_missing_slug_is_404(client):
    assert client.get("/blog/nope").status_code == 404


def test_draft_is_hidden_from_public(client, auth, post_payload):
    assert client.post("/admin/blog", json=post_payload, headers=auth).status_code == 201

    assert client.get("/blog").json()["count"] == 0
    # A draft must 404, not 403 — its existence is not public information.
    assert client.get(f"/blog/{post_payload['slug']}").status_code == 404
    # Staff still see it.
    assert len(client.get("/admin/blog", headers=auth).json()) == 1


def test_publish_round_trip(client, auth, post_payload):
    client.post("/admin/blog", json=post_payload, headers=auth)
    r = client.patch(f"/admin/blog/{post_payload['slug']}", json={"published": True}, headers=auth)
    assert r.status_code == 200
    # Publishing without a date stamps one, so the public list can sort on it.
    assert r.json()["published_at"] is not None

    assert client.get("/blog").json()["count"] == 1
    assert client.get(f"/blog/{post_payload['slug']}").json()["title"] == "Hello Kigali"


def test_duplicate_slug_conflicts(client, auth, post_payload):
    client.post("/admin/blog", json=post_payload, headers=auth)
    r = client.post("/admin/blog", json=post_payload, headers=auth)
    assert r.status_code == 409


def test_invalid_slug_rejected(client, auth, post_payload):
    r = client.post("/admin/blog", json={**post_payload, "slug": "Not A Slug"}, headers=auth)
    assert r.status_code == 422


def test_delete(client, auth, post_payload):
    client.post("/admin/blog", json=post_payload, headers=auth)
    assert client.delete(f"/admin/blog/{post_payload['slug']}", headers=auth).status_code == 204
    assert client.delete(f"/admin/blog/{post_payload['slug']}", headers=auth).status_code == 404
