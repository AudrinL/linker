# Backend Implementation Plan — FastAPI on AWS (frontend stays on Netlify)

> **Status:** Plan / implementation prompt. Follow phases in order. Each phase ends with a
> verification step — do not move on until it passes.

## Architecture

```
Browser
  │  (HTTPS)
  ▼
Netlify (Next.js frontend — UNCHANGED hosting)
  │  server-side Route Handlers proxy to the backend (keep secrets out of the browser)
  │  public blog reads may hit the API directly
  ▼
AWS  (us-east-1 or your preferred region)
  ├── API Gateway HTTP API        (public HTTPS entry point, throttling)
  │        └── Lambda (Python 3.13) → FastAPI + Mangum
  │                ├── DynamoDB   (tables: blog_posts, inquiries, subscribers)
  │                └── SES        (form → email to office inbox)
  └── Secrets Manager / SSM       (admin API key)
```

Rationale:
- Netlify cannot run FastAPI natively. Keep the Next.js site on Netlify and proxy API calls
  from Next.js **server-side Route Handlers** to the FastAPI backend.
- Lambda + Mangum is the only way to run FastAPI on AWS for free, and it scales to zero.
- API key lives only on the server (Lambda env / Secrets Manager), never in the browser.

## Repo layout (new `backend/` folder, frontend untouched except a few files)

```
backend/
  app/
    __init__.py
    main.py            # FastAPI app factory + Mangum handler
    config.py          # settings from env vars (pydantic-settings)
    db.py              # DynamoDB client, table names, helpers (with KeyError-safe typing)
    schemas.py         # Pydantic request/response models
    security.py        # Bearer-token dependency for /admin/* routes
    email.py           # SES send (html email with inquiry details)
    routes/
      health.py        # GET /health
      blog.py          # GET /blog, GET /blog/{slug} (public); admin CRUD (authed)
      inquiries.py     # POST /inquiries (contact + work/study/travel forms)
      newsletter.py    # POST /newsletter
  tests/
    test_health.py
    test_blog.py
    test_inquiries.py
  requirements.txt
  template.yaml        # AWS SAM template (infra-as-code)
  .env.example         # local dev only — never commit real values
  .gitignore
```

Frontend additions:
```
src/app/api/inquiries/route.ts   # server proxy: Netlify form → POST /inquiries
src/app/api/blog/route.ts        # (optional) server proxy for blog reads
src/lib/api.ts                   # shared fetch wrapper reading process.env.API_BASE_URL
```

## Stack & free-tier budget (all within AWS free tier)

| Service | Free allowance | Used for |
|---|---|---|
| Lambda | 1M req/mo, 400K GB-s | FastAPI app |
| API Gateway HTTP API | 1M req/mo | Public endpoint |
| DynamoDB | 25 GB | blog_posts, inquiries, subscribers |
| SES | 3,000 msgs/mo | Form notifications |
| CloudWatch | 5 GB logs/mo | Logs, metrics |

## Phases

### Phase 0 — Scaffold & local run
1. Create `backend/` with a venv; `pip install fastapi mangum uvicorn[standard] pydantic-settings boto3 email-validator python-multipart`.
2. `app/main.py`: FastAPI app with title/version, Mangum handler:
   ```python
   from mangum import Mangum
   app = FastAPI(...)
   handler = Mangum(app, lifespan="off")
   ```
3. `GET /health` returns `{"status":"ok"}`.
4. CORS middleware — **exact origins only**, no wildcard:
   ```python
   allow_origins = os.getenv("CORS_ORIGINS", "").split(",")  # prod: Netlify domain only
   app.add_middleware(CORSMiddleware, allow_origins=allow_origins, allow_methods=["GET","POST","PUT","DELETE"], allow_headers=["*"])
   ```
5. **Verify:** `uvicorn app.main:app --reload` → `curl http://localhost:8000/health` returns ok.

### Phase 1 — Blog read API + schemas
1. `schemas.py`: `BlogPost` (slug, title, excerpt, body_md, hero_image, tags, published, published_at, updated_at).
2. `GET /blog` and `GET /blog/{slug}` read from DynamoDB (Phase 2 wiring) but keep the handler
   data-source agnostic so it works against an in-memory stub in tests.
3. **Verify:** unit tests pass (`pytest`); curl returns 200 + 404 for missing slug.

### Phase 2 — DynamoDB storage
1. Tables (single-table not needed — keep it simple):
   - `blog_posts` — PK `pk=POST#{slug}`; GSI on `published_at` for list ordering.
   - `inquiries` — PK uuid; TTL attr `ttl` (30 days) for auto-cleanup.
   - `subscribers` — PK email; TTL 180 days.
2. `db.py` uses `boto3` with table names from env (`BLOG_TABLE`, etc.) — no hardcoded names.
3. **Verify:** run locally against real DynamoDB table with your AWS creds (dev table), then
   `curl -X POST` a seed + `GET /blog` returns it.

### Phase 3 — Inquiry + newsletter forms
1. `POST /inquiries` with Pydantic validation: name, email, phone (optional), service
   (enum: work/study/travel/safari/vehicle/other), message, honeypot field `website`.
   - If `website` non-empty → silently drop (spam bot).
   - Store row in `inquiries` with TTL.
   - Send email via SES to `site.email` (from verified sender) with inquiry details.
   - Return `202 {"ok": true}`.
2. `POST /newsletter`: validate email → upsert `subscribers` → return 201.
3. Keep the existing WhatsApp `wa.me` hand-off in the frontend untouched; the API adds
   durable storage + email. (Programmatic WhatsApp send requires Meta Business API
   verification — out of scope for v1, documented as a future step.)
4. **Verify:** submit form locally → row in DynamoDB + email lands in inbox (dev SES mailbox).
   Send a duplicate newsletter email → idempotent (200).

### Phase 4 — Admin auth for blog CMS
1. `security.py`: dependency that checks `Authorization: Bearer <API_KEY>` against the value
   from env (`ADMIN_API_KEY`) or Secrets Manager.
2. Admin routes under `/admin/blog`: POST/PUT/DELETE (create, update, delete posts).
   Public `/blog` routes are read-only.
3. **Verify:** no key → 401; wrong key → 401; correct key → 2xx. Tests cover all three.

### Phase 5 — Deploy to AWS (SAM)
1. Write `template.yaml`:
   - `AWS::Serverless::Function` (Python 3.13, `Mangum` handler), policies restricted to
     `dynamodb:Get/Query/Scan/Put/Update/Delete` on the two tables and `ses:SendEmail`.
   - `AWS::Serverless::HttpApi` with default stage + throttling (e.g. 10 req/s, burst 20).
   - Two DynamoDB tables (with TTL).
   - `AWS::Serverless::LayerVersion` or dependency build so `fastapi`/`mangum` ship with the
     function (use `--build-image lambci` or SAM's python build).
   - Env vars: table names, `CORS_ORIGINS` = your Netlify domain, `ADMIN_API_KEY` from a
     parameter/secret — **not** hardcoded in the template.
2. `sam build && sam deploy --guided` (first deploy sets stack name, region, confirm).
3. HTTPS is automatic on the HTTP API endpoint (`https://<id>.execute-api.<region>.amazonaws.com`).
4. **Verify:** hit the deployed `/health` from your browser/curl; then hit `/blog`. Confirm
   CORS preflight (`OPTIONS`) works from the Netlify origin only.
5. (Optional) Custom domain: Route 53 + ACM cert + base-path mapping → `api.linkerworldtravel.com`.

### Phase 6 — Wire the Netlify frontend
1. Add Netlify env var `API_BASE_URL` = the API Gateway URL (set in Netlify UI, not in repo).
2. `src/app/api/inquiries/route.ts`: server-side POST to `API_BASE_URL/inquiries` (keeps no
   secret client-side; if you later add an admin key it stays on the server).
3. Point the existing inquiry/contact forms at the new route; keep the wa.me fallback.
4. Blog page: fetch from `API_BASE_URL/blog` (public, client-side is fine) or via the server proxy.
5. **Verify:** full loop from the live Netlify site — submit a form, see it in DynamoDB + email.

### Phase 7 — Hardening & cost guardrails
1. Enable CloudWatch logs for the HTTP API + Lambda (access logging, errors).
2. Create a **AWS Budget** alert (e.g. $1/mo) so any drift off free tier emails you.
3. SES: verify domain/identity; move out of sandbox if needed for prod volume.
4. Security checklist (see below) — run it line by line before launch.
5. Set up CI/CD (GitHub Actions): on push to `main`, `sam build && sam deploy` with AWS creds
   from GitHub secrets (or OIDC). Keep manual `sam deploy` for the first deploy.

## Safety checklist (run before shipping)

- [ ] No secrets in `git` history — verify with `git log -S ADMIN_API_KEY` / secret scanner.
- [ ] `CORS_ORIGINS` = exact Netlify production domain (+ Netlify preview + localhost for dev).
      No `*`. Never pair `*` with credentials.
- [ ] Lambda IAM role is least-privilege: only the 3 DynamoDB tables + `ses:SendEmail`.
- [ ] Admin API key in Secrets Manager (or Lambda env), never committed, never in the browser.
- [ ] Pydantic validation on every request; honeypot on public forms; reject oversized payloads.
- [ ] Throttling set on the HTTP API (protect against abuse/scanning).
- [ ] Sensitive fields (phone/email) never written to logs; no request-body logging in prod.
- [ ] All traffic HTTPS (API Gateway default); redirect any HTTP.
- [ ] TTL on `inquiries` (30d) and `subscribers` (180d) so data doesn't pile up.
- [ ] `requirements.txt` pinned; dependency scan (pip-audit) in CI.
- [ ] Budget alert at $1/mo; monitor CloudWatch.

## Explicit non-goals (v1)

- No WhatsApp programmatic sending (needs Meta Business verification) — keep wa.me links.
- No user accounts/auth beyond the single admin key.
- No image upload service — blog hero images can come from the existing `/public` or an
  S3 bucket later.
- No SSR rendering of blog on AWS — Next.js on Netlify stays the renderer.

## Future growth path

- Blog editor UI (Netlify dashboard or a small admin page protected by the key).
- Migrate images to S3 + CloudFront.
- Move from admin-key auth to Cognito for multi-admin.
- If traffic ever exceeds free tier, add Provisioned Concurrency / SnapStart, or move the
  whole app to AWS with the `launch-with-aws` skill.

## Notes for the implementer

- **Next.js 16 in this repo has breaking changes** vs. standard docs. Before writing any
  Route Handler (`src/app/api/*`), read the relevant guide under
  `node_modules/next/dist/docs/` and heed deprecation notices (see AGENTS.md).
- For any secrets/credentials task, load the `aws-secrets-manager` skill first and resolve
  secrets at runtime — never print or log them.
- Prefer IaC (SAM template here) over one-off console clicks, per project conventions.
- Keep frontend build clean: after frontend changes run `npm run lint` and `npm run build`.
