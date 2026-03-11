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

export const FetchChannelJob = z.object({ channelId: z.string() });
export type FetchChannelJob = z.infer<typeof FetchChannelJob>;

export const ProcessMessageJob = z.object({ messageId: z.string() });
export type ProcessMessageJob = z.infer<typeof ProcessMessageJob>;

export const ExecuteActionJob = z.object({ actionId: z.string() });
export type ExecuteActionJob = z.infer<typeof ExecuteActionJob>;
