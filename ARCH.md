# Architecture — CRISIS MANAGEMENT CREW

## Topology
- **Frontend**: Next.js 14 App Router (TS). UI: shadcn/ui + Tailwind (“war room” calm, high contrast). State: TanStack Query + Zustand. Realtime: WS + SSE fallback. Editors: TipTap (MDX aware). Charts: Recharts (sentiment, SLA). Tables: virtualized (tasks, approvals, rumors).
- **API Gateway**: NestJS REST /v1 (OpenAPI 3.1, Zod/AJV validation, RBAC, Problem+JSON, Idempotency-Key).
- **Auth**: Auth.js (OAuth/passwordless) + JWT (short-lived); SAML/OIDC; SCIM.
- **Orchestrator**: CrewAI (FastAPI, Python) → PR Manager, Legal Advisor, Social Media Strategist, CEO Spokesperson, Stakeholder Mapper, Rumor Analyst, Approval Gatekeeper.
- **Workers**: intake-normalizer, plan-builder, content-writer, legal-linter, social-pack, monitor-ingest, exporter.
- **Infra**: Postgres + pgvector, Redis (Upstash), NATS, Celery, S3/R2, OTel/Prom/Grafana, Sentry, Vault/KMS.

## Data Model
- **Tenancy**: `orgs`, `users`, `memberships` (roles: owner, admin, pr, legal, social, exec, viewer).
- **Incidents**: `incidents`, `incident_facts`, `jurisdictions`, `data_categories`.
- **Stakeholders & Channels**: `stakeholders`, `channels`.
- **Artifacts**: `artifacts` (holding, press_release, internal, faq, talking_points, social_pack), `redlines`.
- **Tasks & Timeline**: `tasks`, `milestones`.
- **Approvals & Audit**: `approvals`, `comments`, `audit_log`.
- **Monitoring**: `feeds`, `mentions`, `rumors`.
- **Exports**: `exports`.

## API Surface (v1)
- **Auth**: `POST /auth/login`, `POST /auth/refresh`, `GET /me`
- **Incidents**: `POST /incidents`, `POST /incidents/:id/intake`, `GET /incidents/:id`
- **Planning**: `POST /incidents/:id/plan`, `POST /incidents/:id/stakeholders`, `POST /incidents/:id/channels`
- **Content**: `POST /incidents/:id/content/holding`, `/press-release`, `/internal`, `/faq`, `/social`
- **Legal**: `POST /artifacts/:artifactId/legal/lint`
- **Approvals**: `POST /incidents/:id/approvals`, `/approve`, `/ready`
- **Monitoring**: `POST /incidents/:id/feeds`, `/rumors`, `POST /rumors/:id/status`
- **Publish/Export**: `POST /incidents/:id/publish`, `/export`, `GET /exports/:id`
**Conventions**: Idempotency-Key, Problem+JSON, strict RLS.

## Agent Tool Contracts
- `Incident.parse(input)` → `{facts[], unknowns[], severity, jurisdictions[], categories[]}`
- `Plan.build(facts,severity,playbook)` → `{timeline[], tasks[], owners[], deps}`
- `Content.holding(facts,tone)` → `{text,rationale}`
- `Content.press_release(facts,quotes)` → `{mdx, placeholders}`
- `Content.internal(facts)` → `{script}`
- `Content.faq(facts)` → `{qa[]}`
- `Content.social(facts,tone,channels[])` → `{posts[],replies[],cadence}`
- `Legal.lint(text)` → `{flags[], redlines[], risk_score}`
- `Approval.route(artifact,policy)` → `{required_order[],status}`
- `Export.bundle(incidentId,targets[])` → `{links[]}`

## Realtime Channels
- `incident:{id}:plan` (tasks/timeline)
- `incident:{id}:drafts` (artifact streams)
- `incident:{id}:legal` (redlines ready)
- `incident:{id}:approvals` (status)
- `incident:{id}:monitor` (rumor/sentiment)
- `export:{id}:status`

## Security & Compliance
- RBAC & edit locks by role.  
- TLS 1.2+, AES-256 at rest, KMS secrets.  
- PII redaction tools; retention & deletion.  
- Postgres RLS; S3 prefix isolation.  
- Immutable audit_log.  
- Legal disclaimers on artifacts.  
- Supply-chain hardening (SBOM, pinned deps, image signing).  

## Deployment & SLOs
- FE: Vercel. APIs/Workers: Render/Fly → GKE at scale.  
- DB: Postgres + pgvector; PITR. Cache: Upstash Redis.  
- **SLOs**: holding draft < 2.5s; press release < 6s; lint < 2s; export < 10s; WS latency < 250ms; 5xx < 0.5%/1k.
