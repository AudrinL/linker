"""Phase 4 verification: no key → 401, wrong key → 401, right key → 2xx."""

import pytest

ADMIN_ROUTES = [
    ("get", "/admin/stats"),
    ("get", "/admin/applications"),
    ("get", "/admin/inquiries"),
    ("get", "/admin/subscribers"),
    ("get", "/admin/blog"),
]


@pytest.mark.parametrize("method,path", ADMIN_ROUTES)
def test_no_key_is_401(client, method, path):
    r = getattr(client, method)(path)
    assert r.status_code == 401
    assert r.headers.get("WWW-Authenticate") == "Bearer"


@pytest.mark.parametrize("method,path", ADMIN_ROUTES)
def test_wrong_key_is_401(client, method, path):
    r = getattr(client, method)(path, headers={"Authorization": "Bearer wrong-key"})
    assert r.status_code == 401


@pytest.mark.parametrize("method,path", ADMIN_ROUTES)
def test_correct_key_is_2xx(client, auth, method, path):
    assert getattr(client, method)(path, headers=auth).status_code == 200


def test_wrong_scheme_is_401(client):
    r = client.get("/admin/stats", headers={"Authorization": "Basic test-admin-key"})
    assert r.status_code == 401


def test_write_routes_are_protected(client, post_payload):
    assert client.post("/admin/blog", json=post_payload).status_code == 401
    assert client.delete("/admin/blog/anything").status_code == 401


def test_public_routes_need_no_key(client):
    assert client.get("/health").status_code == 200
    assert client.get("/blog").status_code == 200
