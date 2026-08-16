# Linker World Travel — API

FastAPI on AWS Lambda (via Mangum), behind an API Gateway HTTP API, storing to
DynamoDB and notifying the office inbox through SES. The Next.js site stays on
Netlify and talks to this over server-side Route Handlers. See
[`../BACKEND_PLAN.md`](../BACKEND_PLAN.md) for the architecture and rationale.

## Run it locally

```bash
cd backend && python -m venv .venv && .venv/Scripts/activate && pip install -r requirements-dev.txt
```

Copy `.env.example` to `.env`, set `ADMIN_API_KEY`, then:

```bash
cd backend && .venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000
```

`STORAGE=memory` (the default) keeps everything in process — no AWS account, no
credentials, data resets on restart. Interactive docs are at
`http://localhost:8000/docs` outside production.

```bash
cd backend && .venv/Scripts/python.exe -m pytest -q
```

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | — | Liveness |
| GET | `/blog`, `/blog/{slug}` | — | Published posts only |
| POST | `/inquiries` | — | Contact form |
| POST | `/applications` | — | Multi-step funnel submissions |
| POST | `/newsletter` | — | Subscribe (idempotent) |
| GET | `/admin/stats` | Bearer | Dashboard counters and 14-day trend |
| GET/PATCH | `/admin/applications[/{id}]` | Bearer | Triage queue |
| GET/PATCH | `/admin/inquiries[/{id}]` | Bearer | Triage queue |
| GET | `/admin/subscribers`, `/admin/subscribers.csv` | Bearer | List / export |
| GET/POST/PATCH/DELETE | `/admin/blog[/{slug}]` | Bearer | CMS, drafts included |

Auth is `Authorization: Bearer <ADMIN_API_KEY>`. With no key configured every
`/admin` route returns 503 rather than accepting an empty token.

## Deploy

Needs the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
(not currently installed on this machine) and AWS credentials.

First, create the admin key secret — the template reads it by name and the
value never enters the repo:

```bash
aws secretsmanager create-secret --name lwt/admin-api-key --secret-string "{\"key\":\"$(python -c 'import secrets;print(secrets.token_urlsafe(32))')\"}"
```

Then:

```bash
cd backend && sam build && sam deploy --guided --parameter-overrides CorsOrigins=https://www.linkerworldtravel.com
```

`sam build` copies everything under `CodeUri: ./`, so delete or relocate
`.venv/` before building — otherwise the virtualenv is packaged into the
deployment bundle. CI builds from a clean checkout and is unaffected.

The stack's `ApiUrl` output is what goes into Netlify as `API_BASE_URL`.

## The staff dashboard

The Next.js side of this lives at `/admin`. Copy the repo root's `.env.example` to
`.env.local` and set `ADMIN_API_KEY` to the same value this backend uses, then
run both:

```bash
cd backend && ADMIN_API_KEY=dev-local-key .venv/Scripts/python.exe -m uvicorn app.main:app --port 8000
```

```bash
npm run dev
```

Staff sign in with **Supabase** (emailed one-time link). The `ADMIN_API_KEY` is
not a staff password — it is the server-to-server credential this API checks,
and it never reaches a browser.

With the Supabase variables unset and `NODE_ENV` not `production`, the login
screen falls back to a single shared password so the dashboard runs with no
cloud dependency. Both conditions must hold; production refuses it.

### Supabase setup (once)

1. Create a project at supabase.com. Copy the **Project URL** and the
   **publishable key** (`sb_publishable_…`) into `.env.local` and Netlify as
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. **Authentication → Sign In / Providers → Email**: enable email, and turn
   **off** public sign-ups. Sign-in never creates an account here
   (`shouldCreateUser: false`), so every account is one you made deliberately.
3. **Authentication → URL Configuration**: add
   `https://www.linkerworldtravel.com/admin/auth/callback` and
   `http://localhost:3000/admin/auth/callback` as redirect URLs. A link that
   redirects anywhere else is rejected.
4. **Authentication → Users → Add user**: one per member of staff.
5. Optionally set `ADMIN_EMAILS` to a comma-separated allowlist. Belt and
   braces to step 2 — with it set, only those addresses get in even if an
   account is created some other way.

## Notes

- Runtime is pinned to **python3.12**, not 3.13: Mangum 0.21 calls
  `asyncio.get_event_loop()` at import time, which already warns on 3.13.
- Uploaded documents are recorded as metadata only. `DocumentRef.storage_key`
  is the seam for S3 presigned uploads when those land; nothing else changes.
- Listing uses `scan` plus in-process sorting. At the volumes here that is
  cheaper than maintaining an index — see the note at the top of `app/db.py`
  for when to revisit.
