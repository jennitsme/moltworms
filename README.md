# Moltworms

Unified inbox + actionable agent layer. All channels (email, chat, calendar) in one UI with AI agents proposing safe, approval-gated actions.

## Vision
- Aggregate inbox across email + chat + calendar.
- Agent parses intent/priority, drafts replies, schedules, creates tickets/CRM notes.
- Guardrails-first: approvals required before outbound, PII masking, domain allowlist, audit log.
- Action packs: pluggable actions for CRM/ticketing, deployable via OpenClaw agents.

## High-level Architecture
- **Frontend (Next.js)**: unified inbox UI, approvals, action buttons, live updates via WebSocket/SSE.
- **API (FastAPI or Node)**: auth, message retrieval, actions dispatch, search, metrics.
- **Data**: Postgres (threads/messages/actions/policies), Redis (queues, rate limits), optional pgvector for RAG.
- **Workers**: background sync per channel, execute actions, call OpenClaw sub-agents.
- **Agents (OpenClaw)**: channel-specific tools (email/chat/calendar), draft generation, summarization, routing.
- **Policy Gate**: middleware to enforce approvals, PII masking, allowlists; audit trail for every outbound call.

## Monorepo Layout
- `apps/web` — Next.js frontend.
- `services/api` — API gateway (FastAPI/Node) + WebSocket/SSE.
- `services/worker` — background workers and OpenClaw agent orchestrators.
- `packages/shared` — types, schema, clients, shared utils.

## MVP Scope (8–10 weeks)
1. Auth (OAuth Google/MS), channel connectors (email + 1 chat), calendar view.
2. Unified inbox: thread grouping, search, labels, priority/intent tagging.
3. Suggested actions: reply drafts, schedule meeting, follow-up, create ticket/CRM note.
4. Approval UI: no outbound tanpa approve; audit log.
5. Execution: send reply, create event, create ticket stub; retries + error handling.
6. RAG over mailbox for context-aware replies; policy gate v1 (PII mask, domain allowlist).
7. Observability: metrics, cost tracking, pending approvals notifications.

## Tech Stack (initial recommendation)
- Frontend: Next.js (App Router), Tailwind/Chakra; tRPC or REST client.
- API: FastAPI (Python) or Node (tRPC/Express); JSON Schema/ OpenAPI; WS/SSE.
- Data: Postgres + pgvector; Redis for queues/rate-limit.
- Agents: OpenClaw sub-agents per channel (email, chat, calendar) with tool plugins.
- Infra: Vercel for web, Fly/Render for API/worker; GitHub Actions CI.

## Next Steps
- Decide API stack (FastAPI vs Node) and first chat channel (Slack vs Telegram).
- Flesh out schemas and contracts in `packages/shared`.
- Scaffold apps/web and services/api with basic healthcheck and lint/test.
- Add CI (lint/test) and container builds.
