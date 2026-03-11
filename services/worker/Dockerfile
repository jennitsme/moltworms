# Worker service Dockerfile
FROM node:20-bookworm AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY services/worker/package.json services/worker/package.json
COPY packages/shared/package.json packages/shared/package.json

COPY services/worker services/worker
COPY packages/shared packages/shared

RUN npm ci
RUN npm run build -w @moltworms/worker
RUN npm prune --omit=dev

FROM node:20-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY services/worker/package.json services/worker/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/worker/dist ./services/worker/dist

CMD ["node", "services/worker/dist/index.js"]
