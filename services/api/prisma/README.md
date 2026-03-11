# Prisma usage

## Commands
- Generate client: `npx prisma generate --schema prisma/schema.prisma`
- Migrate (needs DB up): `npx prisma migrate dev --schema prisma/schema.prisma --name init`
- Seed: `npx prisma db seed --schema prisma/schema.prisma`

## Seed
Default seed creates demo user `demo@moltworms.local` and a demo email channel.

## Connection
Ensure `POSTGRES_URL` is set (e.g., `postgres://moltworms:moltworms@localhost:5432/moltworms`).
