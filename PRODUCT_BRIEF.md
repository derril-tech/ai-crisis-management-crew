
CRISIS MANAGEMENT CREW — END‑TO‑END PRODUCT BLUEPRINT
(React 18 + Next.js 14 App Router; CrewAI multi‑agent orchestration; TypeScript‑first contracts.)
1) Product Description & Presentation
One‑liner
A multi‑agent “war room” that turns “A customer data breach just leaked online.” into a time‑boxed damage‑control plan, press release draft, internal messaging strategy, and channel‑specific statements with legal review gates, approval workflows, and live monitoring—exportable as PDFs/MDX plus CSV task trackers.
What it produces (artifacts)
•
Crisis Brief & Timeline (T0 … T+72h milestones).
•
Stakeholder Map (customers, employees, partners, regulators, media).
•
Comms Pack:
o
Holding statement, press release, FAQ/Q&A, CEO talking points, internal email/Slack script, social posts (X/LinkedIn), status‑page update (optional).
•
Risk/Legal Pack: legal risk flags, disclosure checklist, regulator notification placeholders, breach scope matrix.
•
Operational Plan: tasks, owners, deadlines, escalation tree, comms calendar.
•
Post‑publish Monitor: sentiment panel, rumor log, update cadence guidance.
•
Exports: PDF “Crisis Packet”, MDX statements, CSV task list, JSON incident bundle.
Safety & scope
•
Not legal advice. Outputs are templates and simulations to support professional decision‑making. Users must apply jurisdiction‑specific laws and internal policies.
2) Target User
•
Comms/PR teams (corporate, startup, agency).
•
Legal/Privacy teams coordinating disclosures.
•
Exec staff (CEO/COO/CISO) for rapid alignment.
•
Customer support & social teams needing consistent scripts.
•
Partners & enterprise clients requesting incident notices.
3) Features & Functionalities (Extensive)
Intake & Triage
•
Incident intake wizard: what leaked (data types), detection time, affected geos, systems, customer counts, confirmed vs unconfirmed facts, constraints (ongoing law‑enforcement contact?), company tone guardrails.
•
Severity scoring: impact × scope × regulatory sensitivity → suggested comms posture (silent monitor / limited holding statement / full disclosure).
•
Playbook selection: breach archetypes (credential stuffing, S3 misconfig, vendor breach, insider, ransomware with exfil).
•
Timeline generator: T0 (now), T+1h, +4h, +24h, +48h, +72h with deadlines & dependency graph.
Stakeholders & Channels
•
Stakeholder matrix: customers (consumer/enterprise), employees, partners, regulators, media, investors.
•
Channel plan: press release, newsroom page, email to customers, in‑app/banner, help center, social posts (X/LinkedIn), internal Slack/All‑hands script, status page.
•
Audience segmentation: enterprise accounts get bespoke brief; consumers get FAQ.
Content Generation & Review
•
Holding statement (acknowledge, ongoing investigation, how to get updates).
•
Press release (facts, steps taken, customer action items, quotes, contact).
•
Internal memo/Slack (what to say/not say, escalation links).
•
FAQ/Q&A bank for support, sales, recruiters.
•
CEO talking points + media training cues.
•
Social posts with reply macros & rumor rebuttal templates.
•
Legal review flags: liability admissions, speculative phrases, personal data categories, promises with risk, forward‑looking statements → blockers or edits required.
•
Compliance checklists: regulator notice placeholders, contract clauses (“material incident” test), data‑subject rights cues.
Workflow, Approvals & Audit
•
Tasks: owner, due time, dependency, SLA alerts.
•
Approval gates: PR → Legal → CEO Spokesperson; configurable.
•
Versioning & redlines: diffs, comments, suggested edits, accept/reject.
•
Immutable audit log: who changed what, when, and why.
Monitoring & Rumor Control
•
Sentiment (optional): user‑provided feeds (CSV/API) → trend lines.
•
Rumor log: claims, source, confidence, recommended response.
•
Update cadence suggestions based on sentiment slope & open questions.
Exports
•
Crisis Packet PDF (brief, timeline, approvals, statements).
•
MDX/HTML for press release & newsroom page.
•
CSV tasks & stakeholder lists; JSON incident bundle.
4) Backend Architecture (Extremely Detailed & Deployment‑Ready)
4.1 High‑Level Topology
•
Frontend/BFF: Next.js 14 (Vercel). Server Actions for light mutations, signed S3 URLs, SSR read views.
•
API Gateway: Node/NestJS
o
REST /v1; OpenAPI 3.1; Zod/AJV validation; RBAC; rate limits; Idempotency‑Key; Problem+JSON errors.
•
Auth: Auth.js (OAuth/passwordless) + short‑lived JWT (rotating refresh); SAML/OIDC for enterprise; SCIM for org provisioning.
•
Orchestration: CrewAI Orchestrator (Python FastAPI) coordinating:
o
PR Manager (holding statement, press release, newsroom pack, response calendar)
o
Legal Advisor (risk flags, regulator checklist, redlines)
o
Social Media Strategist (channel plan, post copy, reply macros, crisis calendar)
o
CEO Spokesperson (talking points, tone, quote crafting)
o
Support agents: Stakeholder Mapper, Rumor Analyst, Approval Gatekeeper
•
Workers (Python):
o
intake-normalizer (incident → structured facts)
o
plan-builder (timeline, tasks, dependencies)
o
content-writer (holding statement / press / FAQ / internal)
o
legal-linter (risky terms, claims, promises; redline annotations)
o
social-pack (post copy, reply macros, cadence)
o
monitor-ingest (optional feed parser for sentiment/mentions CSVs/APIs)
o
exporter (PDF/MDX/CSV/ZIP)
•
Event Bus: NATS (incident.*, plan.*, content.*, legal.*, social.*, monitor.*, export.*).
•
Task Queue: Celery (NATS/Redis backend) with lanes: interactive (drafts/reviews), monitor, exports.
•
DB: Postgres (Neon/Cloud SQL) + pgvector (templates, rumor embeddings).
•
Object Storage: S3/R2 (uploads: evidence, screenshots; exports).
•
Cache: Upstash Redis (hot incident state, draft artefacts, presence).
•
Realtime: WebSocket gateway (NestJS) + SSE fallback (drafts, approvals, monitor ticks).
•
Observability: OpenTelemetry traces; Prometheus/Grafana; Sentry; structured logs.
•
Secrets: Cloud Secrets Manager/Vault; KMS envelopes; never store plaintext tokens.
4.2 CrewAI Agents & Tool Surface
Agents
•
PR Manager — owns narrative, produces holding statement, press release, newsroom page, content calendar.
•
Legal Advisor — highlights risk; adds/regenerates compliant phrasing; outputs regulator checklist & disclosure matrix.
•
Social Media Strategist — crafts channel‑specific posts & reply macros; proposes cadence & escalation for high‑risk threads.
•
CEO Spokesperson — drafts CEO quotes, talking points, media prep cues.
•
Stakeholder Mapper — derives segments & tailored messages.
•
Rumor Analyst — parses feeds, identifies claims, confidence, rebuttal approach.
•
Approval Gatekeeper — enforces stage gates (who must approve, in order).
Tool Interfaces (strict)
•
Incident.parse(input) → {facts[], unknowns[], scope, severity, jurisdictions[], data_types[], constraints[]}
•
Plan.build(facts, severity, playbook) → {timeline[], tasks[], owners[], dependencies[]}
•
Content.holding(facts, tone, unknowns) → text + rationale
•
Content.press_release(facts, quotes, actions, contacts) → MDX + quote placeholders
•
Content.internal(facts, do_dont, escalation) → Slack/email script
•
Content.faq(facts, unknowns, actions) → Q&A list
•
Content.social(facts, tone, channels[]) → posts[], replies[], cadence
•
Legal.lint(text, jurisdiction?) → {flags[], redlines[], risk_score}
•
Legal.checklist(facts, jurisdictions[]) → {regulator_steps[], contract_checks[]}
•
Stakeholder.map(facts) → {segments[], message_pivots[]}
•
Rumor.analyze(feed) → {rumors[], confidence, rebuttals}
•
Approval.route(artifact, policy) → {required_order[], status}
•
Export.bundle(incidentId, targets[]) → signed URLs
4.3 Data Model (Postgres + pgvector)
-- Tenancy & Identity CREATE TABLE orgs ( id UUID PRIMARY KEY, name TEXT NOT NULL, plan TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE users ( id UUID PRIMARY KEY, org_id UUID REFERENCES orgs(id), email CITEXT UNIQUE, name TEXT, role TEXT, tz TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE memberships ( user_id UUID REFERENCES users(id), org_id UUID REFERENCES orgs(id), workspace_role TEXT CHECK (workspace_role IN ('owner','admin','pr','legal','social','exec','viewer')), PRIMARY KEY (user_id, org_id) ); -- Incidents CREATE TABLE incidents ( id UUID PRIMARY KEY, org_id UUID, title TEXT, type TEXT, -- 'breach','outage','product','exec','other' severity TEXT CHECK (severity IN ('low','medium','high','critical')) DEFAULT 'high', status TEXT CHECK (status IN ('created','triage','drafting','legal_review','approvals','ready','published','monitoring','resolved','exported','archived')) DEFAULT 'created', detected_at TIMESTAMPTZ, created_by UUID, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE incident_facts ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), label TEXT, value TEXT, confidence TEXT, source TEXT, is_unknown BOOLEAN DEFAULT FALSE, updated_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE jurisdictions (
id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), code TEXT, -- e.g., 'US-CA','EU','UK' notes TEXT ); CREATE TABLE data_categories ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), category TEXT, -- 'email','password_hash','payment','health','other' scope_estimate TEXT ); -- Stakeholders & Channels CREATE TABLE stakeholders ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), segment TEXT, -- 'consumers','enterprise','employees','partners','regulators','media','investors' size_estimate INT, priority INT, notes TEXT ); CREATE TABLE channels ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), type TEXT, -- 'press_release','newsroom','email','inapp','helpcenter','social_x','social_linkedin','slack','statuspage' enabled BOOLEAN DEFAULT TRUE, target_when TEXT -- 'T+1h','T+4h',... ); -- Content & Versions CREATE TABLE artifacts ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), kind TEXT, -- 'holding','press_release','internal','faq','talking_points','social_pack','status_update' version INT, author_id UUID, text TEXT, mdx TEXT, meta JSONB, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE redlines ( id UUID PRIMARY KEY, artifact_id UUID REFERENCES artifacts(id), agent TEXT, -- 'legal' start_pos INT, end_pos INT, suggestion TEXT, risk_tag TEXT, applied
BOOLEAN DEFAULT FALSE ); -- Tasks & Timeline CREATE TABLE tasks ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), title TEXT, owner_id UUID, due_at TIMESTAMPTZ, depends_on UUID, status TEXT CHECK (status IN ('todo','doing','blocked','done')) DEFAULT 'todo', priority INT, channel_hint TEXT ); CREATE TABLE milestones ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), label TEXT, at TIMESTAMPTZ, description TEXT ); -- Approvals & Audit CREATE TABLE approvals ( id UUID PRIMARY KEY, incident_id UUID REFERENCES incidents(id), artifact_kind TEXT, order_idx INT, role_required TEXT, user_id UUID, status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending', comment TEXT, acted_at TIMESTAMPTZ ); CREATE TABLE comments ( id UUID PRIMARY KEY, incident_id UUID, artifact_id UUID, author_id UUID, body TEXT, anchor JSONB, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE audit_log ( id BIGSERIAL PRIMARY KEY, org_id UUID, user_id UUID, incident_id UUID, action TEXT, target TEXT, meta JSONB, created_at TIMESTAMPTZ DEFAULT now() ); -- Monitoring (optional) CREATE TABLE feeds (
id UUID PRIMARY KEY, incident_id UUID, name TEXT, source TEXT, config JSONB ); CREATE TABLE mentions ( id UUID PRIMARY KEY, incident_id UUID, feed_id UUID REFERENCES feeds(id), ts TIMESTAMPTZ, source TEXT, author TEXT, content TEXT, url TEXT, sentiment NUMERIC ); CREATE TABLE rumors ( id UUID PRIMARY KEY, incident_id UUID, statement TEXT, confidence TEXT, status TEXT CHECK (status IN ('unverified','monitor','rebutted','confirmed')) DEFAULT 'unverified', recommended_reply TEXT, embedding VECTOR(1536) ); -- Exports CREATE TABLE exports ( id UUID PRIMARY KEY, incident_id UUID, kind TEXT, s3_key TEXT, meta JSONB, created_at TIMESTAMPTZ DEFAULT now() );
Indexes & Constraints (high‑value)
•
CREATE INDEX ON artifacts (incident_id, kind, version DESC);
•
CREATE INDEX ON tasks (incident_id, status, due_at);
•
Vector index on rumors.embedding.
•
Invariants: approval chain must have contiguous order_idx starting at 1; cannot set incident status='ready' unless all approvals for enabled channels are approved.
4.4 API Surface (REST /v1, OpenAPI)
Auth & Orgs
•
POST /v1/auth/login / POST /v1/auth/refresh
•
GET /v1/me
Incidents & Intake
•
POST /v1/incidents {title,type,severity,detected_at} → {incident_id}
•
POST /v1/incidents/:id/intake {facts[], jurisdictions[], data_categories[]}
•
GET /v1/incidents/:id → details + status
Planning & Stakeholders
•
POST /v1/incidents/:id/plan {playbook?, tone?} → timeline & tasks
•
POST /v1/incidents/:id/stakeholders {segments[]}
•
POST /v1/incidents/:id/channels {channels[]}
Content Generation
•
POST /v1/incidents/:id/content/holding {tone} → artifact v1
•
POST /v1/incidents/:id/content/press-release {quote_placeholders}
•
POST /v1/incidents/:id/content/internal {audience:'all'|'support'|'sales'}
•
POST /v1/incidents/:id/content/faq
•
POST /v1/incidents/:id/content/social {channels:['social_x','social_linkedin'], cadence:'high|medium|low'}
•
GET /v1/incidents/:id/artifacts?kind=press_release → list of versions
Legal & Approvals
•
POST /v1/artifacts/:artifactId/legal/lint → flags/redlines
•
POST /v1/incidents/:id/approvals {artifact_kind, chain:[{order_idx, role_required}]}
•
POST /v1/incidents/:id/approve {artifact_kind, order_idx, decision:'approved'|'rejected', comment}
•
POST /v1/incidents/:id/ready → checks gates; sets status='ready'
Monitoring & Rumors
•
POST /v1/incidents/:id/feeds {name, source, config}
•
POST /v1/incidents/:id/rumors {statement, source?}
•
POST /v1/rumors/:id/status {status, recommended_reply?}
Publish & Export
•
POST /v1/incidents/:id/publish {channels[]} → writes final MDX/HTML to S3; status→published
•
POST /v1/incidents/:id/export {targets:['pdf','mdx','csv','zip']}
•
GET /v1/exports/:id → signed URL
Conventions
•
Mutations require Idempotency‑Key.
•
Errors use Problem+JSON with remediation (e.g., “Legal gate pending at step 2/3”).
•
Strict RLS by org/incident; PR/Legal/Social/Exec roles control edits.
4.5 Orchestration Logic (CrewAI)
State machine (per incident)
created → triage → drafting → legal_review → approvals → ready → published → monitoring → resolved → exported → archived
Typical turn sequence
1.
Intake → intake-normalizer → structured facts & unknowns.
2.
Plan → PR Manager drafts plan; tasks & timeline saved.
3.
Artifacts:
a.
Holding statement (fast) → Legal lint → edits.
b.
Press release, Internal memo, FAQ, Social pack in parallel (with Legal lint & redlines).
4.
Approvals: define chain; Approval Gatekeeper tracks order; blocking on Legal & Exec sign‑off.
5.
Ready/Publish: lock artifacts → write finalized MDX/HTML to S3; update status.
6.
Monitoring: optional feeds → Rumor Analyst suggests rebuttals & cadence.
7.
Exports: Crisis Packet PDF + bundle.
4.6 Background Jobs
•
BuildPlan(incidentId)
•
GenerateArtifact(incidentId, kind)
•
RunLegalLint(artifactId)
•
BuildSocialPack(incidentId)
•
MonitorIngest(incidentId, feedId)
•
ExportBundle(incidentId, targets[])
•
Periodics: TaskSLAAlerts, CostRollup, RetentionSweep, AlertOnFailure.
4.7 Realtime
•
WS channels:
o
incident:{id}:plan (timeline/task updates)
o
incident:{id}:drafts (artifact text streaming)
o
incident:{id}:legal (redlines ready)
o
incident:{id}:approvals (gate status)
o
incident:{id}:monitor (feed/rumor ticks)
o
export:{id}:status
•
Presence indicators; soft locks on a given artifact during edit.
4.8 Caching & Performance
•
Redis caches: latest drafts, redlines, approval status, recent feed items.
•
SLOs:
o
First holding statement draft < 2.5 s P95.
o
Full press release v1 < 6 s P95.
o
Legal lint < 2 s P95 per artifact.
o
Export packet < 10 s P95.
o
WS event delivery < 250 ms P95.
4.9 Observability
•
OTel traces gateway → orchestrator → workers; span tags: incident_id, artifact_kind, token_cost.
•
Metrics: time‑to‑holding, time‑to‑ready, approvals cycle time, redline count per artifact, SLA breach rate.
•
Logs: structured JSON; redact PII; immutable audit_log for edits, approvals, publishes, exports.
5) Frontend Architecture (React 18 + Next.js 14)
5.1 Tech Choices
•
Next.js 14 App Router, TypeScript.
•
UI: shadcn/ui + Tailwind (calm “war room” aesthetic; high‑contrast).
•
State/data: TanStack Query (server cache) + Zustand (editor cursors, drafting state, timer bars).
•
Realtime: WebSocket client (auto‑reconnect/backoff) + SSE fallback.
•
Editors: TipTap (rich text/MDX aware) with track changes / suggestions UX.
•
Charts: Recharts (sentiment trend, SLA timers).
•
Tables: virtualized (tasks, approvals, rumors, mentions).
•
File handling: signed S3 URLs.
5.2 App Structure
/app /(marketing)/page.tsx /(app) dashboard/page.tsx incidents/ new/page.tsx [incidentId]/ page.tsx // Incident overview & status intake/page.tsx // Facts & scope plan/page.tsx // Timeline & tasks stakeholders/page.tsx // Matrix & channels content/ holding/page.tsx press-release/page.tsx internal/page.tsx faq/page.tsx social/page.tsx talking-points/page.tsx approvals/page.tsx publish/page.tsx monitor/page.tsx exports/page.tsx
admin/roles/page.tsx admin/audit/page.tsx /components IncidentWizard/* FactTable/* SeverityGauge/* TimelineBoard/* TaskList/* StakeholderMatrix/* ChannelPlanner/* EditorMDX/* // TipTap + MDX tokens + suggestions LegalFlags/* ApprovalsPanel/* PublishConsole/* SentimentChart/* RumorLog/* SocialComposer/* FAQBuilder/* ExportHub/* CommentThread/* /lib api-client.ts ws-client.ts zod-schemas.ts rbac.ts /store useIncidentStore.ts useDraftStore.ts useApprovalStore.ts useRealtimeStore.ts
5.3 Key Pages & UX Flows
Dashboard
•
Tiles: “Start incident”, “Awaiting legal”, “Ready to publish”, “Monitoring”.
•
SLA dials: time since T0, next milestone due, approvals outstanding.
Intake
•
IncidentWizard: data categories (PII/PHI/PCI), affected geos, known/unknown facts; SeverityGauge updates in real‑time.
•
Save → status triage.
Plan
•
TimelineBoard (columns T0 / T+1h / T+4h / …); drag tasks; due timers; dependency lines.
•
TaskList with owners, blockers, quick actions (assign, mark done, re‑time).
Stakeholders
•
StakeholderMatrix (priority vs impact); chip‑add segments; notes.
•
ChannelPlanner: toggle channels; pick release windows.
Content
•
EditorMDX with track changes; left panel: FactTable (drag facts into editor to insert tokens); right panel: LegalFlags streaming from lint (risk tags clickable to auto‑apply safe rewrite).
•
FAQBuilder: seed Qs → autogenerate A’s; add product‑/region‑specific branches.
•
SocialComposer: tabs for X/LinkedIn; character counter; tone presets; reply macros; cadence selector.
•
TalkingPoints: bullets for CEO; media prep cues (bridging, flagging).
Approvals
•
ApprovalsPanel: define chain for each artifact; tiles show step, role, user; approve/reject with comment; lock after final approval.
Publish
•
PublishConsole: shows ready channels; “Generate newsroom/press MDX & sign URLs”; “Copy to CMS” link or downloadable HTML.
Monitor
•
SentimentChart over time; RumorLog (status chips: unverified/monitor/rebutted/confirmed); quick generate rebuttal; scheduled update cadence prompts.
Exports
•
ExportHub: pick Crisis Packet PDF, MDX, CSV tasks, ZIP bundle; progress list; signed URLs; change log since last export.
5.4 Component Breakdown (Selected)
•
EditorMDX/Suggestion.tsx
Props: { range, suggestion, onAccept }; inline redline badge; keyboard shortcuts: ⌘/. to cycle suggestions, Enter to accept.
•
LegalFlags/FlagRow.tsx
Props: { riskTag, severity, message, applyPatch }; shows icon (admission/speculation/liability); clicking applies safe rewrite.
•
TimelineBoard/Card.tsx
Props: { task }; SLA bar (time remaining); dependency dots; keyboard‑draggable; double‑click for owner picker.
•
StakeholderMatrix/Cell.tsx
Props: { segment }; shows size estimate, priority; quick‑assign channel subset.
•
PublishConsole/ChannelRow.tsx
Props: { channel, ready, issues[] }; “Preview MDX”, “Generate HTML”, “Mark Published”.
5.5 Data Fetching & Caching
•
Server Components for incident snapshots, tasks lists, approval chains, artifact history.
•
TanStack Query for draft bodies, redlines, monitor feeds.
•
WS pushes update editors, flags, approvals, monitor charts; use queryClient.setQueryData to patch.
•
Prefetch neighbors: intake → plan → stakeholders → content → approvals → publish.
5.6 Validation & Error Handling
•
Zod schemas: facts, jurisdictions, stakeholder segments, channels, artifacts (MDX), approvals, tasks, feeds, rumors.
•
Problem+JSON with remediation: e.g., “Cannot publish: press release lacks legal approval step 2/3.”
•
Guardrails:
o
“Publish” disabled until all selected channels have approved artifacts.
o
Legal lint must be run on latest version (server checks artifact.version).
o
“High/critical” severity enforces holding statement within T+1h SLA (timer banner).
5.7 Accessibility & i18n
•
Keyboard shortcuts: approve (A), reject (R), next flag (J/K), insert fact (⌘I).
•
ARIA roles for boards/lists; focus‑visible rings; high‑contrast palette.
•
next-intl for dates/numbers/currencies; RTL support.
6) Integrations
•
Docs/Storage: Google Drive/SharePoint (optional) for source evidence & exports.
•
Comms: Slack/Email notifications (task due soon, legal redlines ready, approvals needed, publish done).
•
CMS: export MDX/HTML for newsroom/status page; no direct CMS coupling by default.
•
Identity/SSO: Auth.js; SAML/OIDC; SCIM.
•
Monitoring Feeds (optional): user‑provided APIs/CSV for social/news mentions; we do not crawl autonomously by default.
•
Payments (SaaS): Stripe (seats + metered generations).
7) DevOps & Deployment
•
FE: Vercel (Next.js 14).
•
APIs/Workers: Render/Fly.io (simple) or GKE (scale; node pools: CPU for drafting/linting; memory for exports).
•
DB: Managed Postgres + pgvector; PITR; gated migrations.
•
Cache: Upstash Redis.
•
Object Store: S3/R2 with lifecycle (retain exports; purge temp uploads).
•
Event Bus: NATS (managed/self‑hosted).
•
CI/CD: GitHub Actions — lint/typecheck/unit/integration; Docker build; SBOM + cosign; blue/green deploy; migration approvals.
•
IaC: Terraform modules (DB, Redis, NATS, buckets, secrets, DNS/CDN).
•
Testing
o
Unit: intake normalizer, plan builder, content writers, legal linter rules, approval engine, rumor classifier.
o
Contract: OpenAPI.
o
E2E (Playwright): intake→plan→content→legal→approvals→publish→monitor→export.
o
Load: k6 (simultaneous incidents editing & linting).
o
Chaos: lost approvals, conflicting edits, missed SLAs.
o
Security: ZAP; container/dependency scans; secret scanning.
•
SLOs (restate)
o
Holding draft <2.5s; press release v1 <6s; lint <2s; export <10s; WS latency <250ms P95; 5xx <0.5%/1k.
8) Success Criteria
Product KPIs
•
Time‑to‑holding statement ≤ 15 min from T0 (median).
•
Time‑to‑ready (all approvals) ≤ 3 hours for high/critical incidents (median).
•
Approval pass‑through: ≥ 80% artifacts pass after ≤1 redline cycle.
•
Consistency: ≥ 90% of channel assets share identical fact claims (no drift).
•
Export reliability: ≥ 99% success.
Engineering SLOs
•
WS reconnect < 2 s P95; editor local echo < 80 ms; lint turnaround < 2 s P95.
9) Security & Compliance
•
RBAC: Owner/Admin/PR/Legal/Social/Exec/Viewer; artifact edit locks by role; approvals require role matching.
•
Encryption: TLS 1.2+; AES‑256 at rest; KMS‑wrapped secrets; signed URLs (time‑bound) for uploads/exports.
•
Privacy: incident evidence may contain PII—store only minimal context; provide redaction tools; configurable retention & deletion.
•
Tenant isolation: Postgres RLS; S3 prefix isolation.
•
Auditability: immutable audit_log for every edit, redline, approval, publish, export.
•
Supply chain: SLSA provenance; image signing; pinned deps; dependency scanning.
•
Legal disclaimer banners on all artifacts; “simulation/templates only” flag until executive sign‑off.
10) Visual/Logical Flows
A) Intake → Triage
Enter facts/unknowns → severity computed → playbook chosen → status triage.
B) Plan
plan-builder creates timeline & tasks → owners assigned → status drafting.
C) Content Drafts
content-writer drafts holding statement (fast), press release, internal memo, FAQ, social posts → editors refine → legal-linter flags risky phrases → apply redlines.
D) Approvals
Define chain per artifact → PR approves → Legal approves → Exec approves → status approvals → when complete, ready.
E) Publish
Export.bundle generates MDX/HTML → publish to newsroom/status page (download or CMS paste) → status published.
F) Monitor & Update
(Optional) ingest mentions CSV/API → Rumor Analyst labels rumors & suggests rebuttals → Social Strategist pushes update cadence → new artifacts v2+ created if needed → approvals (light) → publish updates.
G) Resolve & Export
Mark resolved → build Crisis Packet (PDF/MDX/CSV/ZIP) → signed URLs → status exported / archived.