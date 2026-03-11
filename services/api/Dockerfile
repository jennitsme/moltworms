# API service Dockerfile
FROM node:20-bookworm AS builder
WORKDIR /app

# Copy manifests
COPY package.json package-lock.json tsconfig.base.json ./
COPY services/api/package.json services/api/package.json
COPY packages/shared/package.json packages/shared/package.json

# Copy source
COPY services/api services/api
COPY packages/shared packages/shared

RUN npm ci
RUN npm run build -w @moltworms/api
RUN npm prune --omit=dev

FROM node:20-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY services/api/package.json services/api/package.json
COPY services/api/prisma services/api/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api/dist ./services/api/dist

EXPOSE 4000
CMD ["node", "services/api/dist/index.js"]
