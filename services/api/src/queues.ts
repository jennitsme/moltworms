import { Queue } from "bullmq";
import IORedis from "ioredis";
import { loadConfig } from "./config.js";
import { ExecuteActionJob, FetchChannelJob, ProcessMessageJob } from "@moltworms/shared";

const config = loadConfig();
const connection = new IORedis(config.redisUrl);

export const fetchChannelQueue = new Queue<FetchChannelJob>("fetch-channel", {
  connection,
});

export const processMessageQueue = new Queue<ProcessMessageJob>("process-message", {
  connection,
});

export const executeActionQueue = new Queue<ExecuteActionJob>("execute-action", {
  connection,
});
