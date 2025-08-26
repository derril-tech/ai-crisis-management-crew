# DONE — CRISIS MANAGEMENT CREW

## Phase 0 — Infra & Repo

[2024-12-19] [Cursor] [Code] Monorepo scaffold (`apps/{frontend,gateway,orchestrator,workers}`).
[2024-12-19] [Cursor] [Code] docker-compose.dev (Postgres, Redis, NATS, MinIO).
[2024-12-19] [Cursor] [Code] GitHub Actions: lint, typecheck, unit, integration; Docker build; SBOM/cosign.

## Phase 1 — DB, Auth, Contracts

[2024-12-19] [Cursor] [Code] SQL migrations (incidents, artifacts, tasks, approvals, monitoring, exports).
[2024-12-19] [Cursor] [Code] RBAC roles (pr, legal, social, exec, viewer) w/ Postgres RLS.
[2024-12-19] [Cursor] [Code] NestJS gateway: OpenAPI 3.1, Zod schemas, Problem+JSON, Idempotency middleware.

## Phase 2 — Intake & Triage

[2024-12-19] [Cursor] [Code] intake-normalizer worker; severity scoring logic.
[2024-12-19] [Cursor] [UI] **IncidentWizard**, **FactTable**, **SeverityGauge**.

## Phase 3 — Plan & Stakeholders

[2024-12-19] [Cursor] [Code] plan-builder worker (timeline/tasks).
[2024-12-19] [Cursor] [UI] **TimelineBoard**, **TaskList**, **StakeholderMatrix**, **ChannelPlanner**.

## Phase 4 — Content Drafts

[2024-12-19] [Cursor] [Crew] content-writer agent (holding, press, internal, FAQ).
[2024-12-19] [Cursor] [UI] **EditorMDX** w/ track changes; **FAQBuilder**, **SocialComposer**.
[2024-12-19] [Cursor] [Code] WS streaming of draft text.

## Phase 5 — Legal Lint & Approvals

[2024-12-19] [Cursor] [Crew] legal-linter agent → redlines.
[2024-12-19] [Cursor] [UI] **LegalFlags**, inline suggestion UX.
[2024-12-19] [Cursor] [Code] approval routes per artifact; Approval Gatekeeper agent.
[2024-12-19] [Cursor] [UI] **ApprovalsPanel**.
