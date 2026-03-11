export type WorkerConfig = {
  env: "development" | "staging" | "production";
  postgresUrl: string;
  redisUrl: string;
};

export function loadWorkerConfig(): WorkerConfig {
  return {
    env: (process.env.NODE_ENV as WorkerConfig["env"]) ?? "development",
    postgresUrl: process.env.POSTGRES_URL ?? "postgres://user:pass@localhost:5432/moltworms",
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  };
}
