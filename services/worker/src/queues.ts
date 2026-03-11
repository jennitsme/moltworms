import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { loadWorkerConfig } from "./config.js";

const config = loadWorkerConfig();
const connection = new IORedis(config.redisUrl);

export const queues = {
  fetchChannel: new Queue("fetch-channel", { connection }),
  processMessage: new Queue("process-message", { connection }),
  executeAction: new Queue("execute-action", { connection }),
};

export function createQueueWorker(
  queueName: keyof typeof queues,
  handler: Parameters<typeof Worker>[1],
  opts?: { concurrency?: number; jobOptions?: JobsOptions }
) {
  return new Worker(queueName, handler, {
    connection,
    concurrency: opts?.concurrency ?? 5,
    ...(opts?.jobOptions ? { defaultJobOptions: opts.jobOptions } : {}),
  });
}

export function createQueueEvents(queueName: keyof typeof queues) {
  return new QueueEvents(queueName, { connection });
}
