import { EnvConfig, EnvSchema } from "@moltworms/shared";

export function loadConfig(): EnvConfig {
  const parsed = EnvSchema.parse({
    env: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    corsOrigins: process.env.CORS_ORIGINS,
    postgresUrl: process.env.POSTGRES_URL ?? "postgres://user:pass@localhost:5432/moltworms",
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  });
  return parsed;
}
