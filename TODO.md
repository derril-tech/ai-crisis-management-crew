# TODO — CRISIS MANAGEMENT CREW
> Granular backlog; [Code] deterministic, [Crew] agent contracts.

## Phase 0 — Infra & Repo
- [x] [Code] Monorepo scaffold (`apps/{frontend,gateway,orchestrator,workers}`).
- [x] [Code] docker-compose.dev (Postgres, Redis, NATS, MinIO).
- [x] [Code] GitHub Actions: lint, typecheck, unit, integration; Docker build; SBOM/cosign.

## Phase 1 — DB, Auth, Contracts
- [x] [Code] SQL migrations (incidents, artifacts, tasks, approvals, monitoring, exports).
- [x] [Code] RBAC roles (pr, legal, social, exec, viewer) w/ Postgres RLS.
- [x] [Code] NestJS gateway: OpenAPI 3.1, Zod schemas, Problem+JSON, Idempotency middleware.

## Phase 2 — Intake & Triage
- [x] [Code] intake-normalizer worker; severity scoring logic.
- [x] [UI] **IncidentWizard**, **FactTable**, **SeverityGauge**.

## Phase 3 — Plan & Stakeholders
- [x] [Code] plan-builder worker (timeline/tasks).
- [x] [UI] **TimelineBoard**, **TaskList**, **StakeholderMatrix**, **ChannelPlanner**.

## Phase 4 — Content Drafts
- [x] [Crew] content-writer agent (holding, press, internal, FAQ).
- [x] [UI] **EditorMDX** w/ track changes; **FAQBuilder**, **SocialComposer**.
- [x] [Code] WS streaming of draft text.

## Phase 5 — Legal Lint & Approvals
- [x] [Crew] legal-linter agent → redlines.
- [x] [UI] **LegalFlags**, inline suggestion UX.
- [x] [Code] approval routes per artifact; Approval Gatekeeper agent.
- [x] [UI] **ApprovalsPanel**.

## Phase 6 — Publish
- [x] [Code] publish console: MDX → S3; HTML generation.
- [x] [UI] **PublishConsole** with channel rows.

## Phase 7 — Monitor & Rumors
- [Crew] monitor-ingest worker + Rumor Analyst agent.
- [UI] **SentimentChart**, **RumorLog**.

## Phase 8 — Exports
- [Code] exporter worker: PDF (Crisis Packet), CSV tasks, MDX, ZIP.
- [UI] **ExportHub** with progress + signed URLs.

## Testing
- **Unit**: intake normalizer, plan builder, content writer, legal lint, approval routing, rumor classifier.
- **Contract**: OpenAPI parity, Zod schemas.
- **E2E**: intake → plan → content → legal → approvals → publish → monitor → export.
- **Load**: k6 (parallel incidents, linting).
- **Chaos**: lost approvals, conflicting edits, SLA misses.
- **Security**: ZAP scans, dep scans, secret scanning.

## Seeds & Fixtures
- Demo incident (data breach, ~1k users).
- Example playbooks (breach archetypes).
- Legal lint dictionary (risky terms → safe rewrites).
- Rumor feed CSV (demo mentions).

## Runbooks
- SLA dashboards (holding time, approval cycle).
- On-call playbooks: WS outage, NATS backlog, Redis eviction.
- Cost controls: job concurrency caps, retention sweeps.

## Out of Scope (MVP)
- No regulator auto-notify.
- No live posting to X/LinkedIn.
- No autonomous monitoring; feeds must be user-provided.
