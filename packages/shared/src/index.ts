import { z } from "zod";

export const HealthcheckResponse = z.object({ status: z.literal("ok") });
export type HealthcheckResponse = z.infer<typeof HealthcheckResponse>;

export const AppConfigSchema = z.object({
  env: z.enum(["development", "staging", "production"]),
});
export type AppConfig = z.infer<typeof AppConfigSchema>;
