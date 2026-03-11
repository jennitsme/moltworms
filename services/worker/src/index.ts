import { loadWorkerConfig } from "./config.js";
import { queues, createQueueWorker } from "./queues.js";

const config = loadWorkerConfig();
console.log(`[worker] ready (env=${config.env})`);
console.log(`[worker] postgres=${config.postgresUrl} redis=${config.redisUrl}`);

createQueueWorker("fetch-channel", async (job) => {
  console.log(`[worker] fetch-channel job`, job.data);
});

createQueueWorker("process-message", async (job) => {
  console.log(`[worker] process-message job`, job.data);
});

createQueueWorker("execute-action", async (job) => {
  console.log(`[worker] execute-action job`, job.data);
});

// Example enqueue helper (can be moved to services)
async function enqueueExamples() {
  await queues.fetchChannel.add("demo", { channelId: "demo-channel" });
}

enqueueExamples().catch((err) => {
  console.error("[worker] enqueue error", err);
});
