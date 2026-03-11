# API Service

## Commands
- Dev: `npm run dev -w @moltworms/api`
- Build: `npm run build -w @moltworms/api`
- Prisma migrate: `npx prisma migrate dev`
- Prisma generate: `npx prisma generate`

## Env
Uses `.env` at repo root (POSTGRES_URL, REDIS_URL, PORT, CORS_ORIGINS).

## tRPC Routes (current)
- `healthcheck` (query)
- `echo` (query, input: { message })
- `users` (query, returns up to 5 users)
- `enqueueFetch` (mutation, input: { channelId }) → pushes to BullMQ `fetch-channel`

## Notes
- Prisma schema at `prisma/schema.prisma`.
- BullMQ uses `REDIS_URL`.
