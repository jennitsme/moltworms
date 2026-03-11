# API Service

## Commands
- Dev: `npm run dev -w @moltworms/api`
- Build: `npm run build -w @moltworms/api`
- Prisma: `npm run prisma:generate -w @moltworms/api`, `npm run prisma:migrate -w @moltworms/api`, `npm run prisma:seed -w @moltworms/api`

## Env
Uses `.env` at repo root (POSTGRES_URL, REDIS_URL, PORT, CORS_ORIGINS).

## tRPC Routes (current)
- `healthcheck` (query)
- `echo` (query, input: { message })
- `users` (query)
- `threads` (query, optional input: { channelId })
- `messages` (query, input: { threadId })
- `actionCreate` (mutation, input: { threadId, type, payload, userId }) → creates action + pending approval
- `approvalUpdate` (mutation, input: { actionId, status, note? })
- `enqueueFetch` (mutation, input: { channelId }) → pushes to BullMQ `fetch-channel`

## Notes
- Prisma schema at `prisma/schema.prisma`.
- BullMQ uses `REDIS_URL`.
- Auth is not wired yet; `userId` passed explicitly in mutations.
