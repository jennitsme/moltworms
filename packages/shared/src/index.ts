import { z } from "zod";

export const HealthcheckResponse = z.object({ status: z.literal("ok") });
export type HealthcheckResponse = z.infer<typeof HealthcheckResponse>;

export const EnvSchema = z.object({
  env: z.enum(["development", "staging", "production"]),
  port: z.number().int().min(1).max(65535),
  corsOrigins: z.string().optional(),
  postgresUrl: z.string().url(),
  redisUrl: z.string().url(),
});
export type EnvConfig = z.infer<typeof EnvSchema>;
