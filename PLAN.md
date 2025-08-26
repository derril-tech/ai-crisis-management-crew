# Project Plan — CRISIS MANAGEMENT CREW

> Scope: Multi-agent “war room” that turns “A customer data breach just leaked online.” into a **time-boxed plan**, **comms pack**, **legal/risk pack**, **operational plan**, and **monitoring artifacts** — exportable to PDF/MDX/CSV/JSON.

## Product Goal
Provide comms/legal/exec teams with a **simulation environment** for crisis response, producing **drafts, tasks, approvals, and exports** in < 3 hours for high/critical incidents, while maintaining legal safety and auditability.

## Safety, Legal & Scope
- **Not legal advice**. Outputs are **templates/simulations**; org policies + jurisdictional laws override.
- No automated regulator notifications; placeholders only.
- No direct CMS publishing or live social posting; MDX/HTML export only.
- Incident evidence (screenshots/docs) stored minimally, with retention policies.

## 80/20 Build Strategy
- **80% deterministic/code**: incident intake, severity scoring, timeline/tasks, approval routing, legal lint rules, exports.
- **20% generative/agents**: content drafting (holding statement, press release, social pack, FAQ), tone adaptation, rumor rebuttals — constrained by JSON tool contracts.

## Immediate Next 3 Tasks
1. **Monorepo & infra**: apps `{web,gateway,orchestrator,workers}`; docker-compose (Postgres+Redis+NATS+MinIO); CI with lint/typecheck/test.
2. **Contracts**: NestJS gateway with OpenAPI 3.1, RBAC roles, Problem+JSON errors, WS channels, signed S3 URLs.
3. **Intake core**: IncidentWizard + severity scoring → saves structured facts, unknowns, jurisdictions, categories.

## Phases
- **P0** Infra, CI, monorepo, contracts  
- **P1** DB schema + auth/RBAC  
- **P2** Intake wizard + severity scoring + playbook selector  
- **P3** Plan builder (timeline/tasks/stakeholders/channels)  
- **P4** Content drafts (holding, press, internal, FAQ, social) + legal lint  
- **P5** Approvals workflow (PR → Legal → Exec) + redlines UX  
- **P6** Publish pipeline (MDX/HTML export) + newsroom/status integrations  
- **P7** Monitor & rumor log + sentiment chart (optional feeds)  
- **P8** Exports (PDF packet, CSV tasks, MDX, ZIP) + observability

## Definition of Done (MVP)
- Intake wizard produces **structured facts** + severity → **plan builder** generates timeline (T0 → T+72h) with tasks.
- Comms pack produced: holding statement (≤15 min), press release, FAQ, internal memo, social pack.
- **Legal lint** flags risky terms, outputs redlines; user applies safe rewrites.
- **Approval chain** enforced: PR → Legal → Exec; incident status = “ready” only after all approvals.
- Publish console exports newsroom-ready MDX/HTML.
- Monitor panel logs rumors, shows sentiment trend, recommends cadence.
- ExportHub produces **Crisis Packet PDF**, **CSV tasks**, **MDX artifacts**.
- SLOs: holding draft < 2.5s, press release < 6s, legal lint < 2s, export < 10s.

## Non-Goals (MVP)
- No automated regulator notifications or live social posting.
- No third-party data crawling (feeds must be user-provided).
- No deep sentiment NLP; trend visualizations only.

## Key Risks & Mitigations
- **Legal liability** → disclaimer banners, safe rewrites, approval gates.
- **Content drift across channels** → facts table as single source of truth, auto-insert tokens in drafts.
- **Missed SLAs** → timeline board with SLA timers; alerts.
- **Approval bottlenecks** → Approval Gatekeeper agent; blocking status until chain complete.

## KPIs (first 90 days)
- Holding statement delivered ≤ 15 min (median).
- Time-to-ready (all approvals) ≤ 3h (high/critical).
- ≥ 80% artifacts pass legal after ≤ 1 redline cycle.
- ≥ 90% consistency of facts across channels.
- ≥ 99% export reliability.
