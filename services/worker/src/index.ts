import { loadWorkerConfig } from "./config.js";
import { queues, createQueueWorker } from "./queues.js";
import { getTelegramBot } from "./connectors/telegram.js";

const config = loadWorkerConfig();
console.log(`[worker] ready (env=${config.env})`);
console.log(`[worker] postgres=${config.postgresUrl} redis=${config.redisUrl}`);

// Initialize Telegram polling (if token provided)
getTelegramBot();

createQueueWorker("fetch-channel", async (job) => {
  console.log(`[worker] fetch-channel job`, job.data);
  // TODO: per-channel fetch (email polling, etc.)
});

createQueueWorker("process-message", async (job) => {
  console.log(`[worker] process-message job`, job.data);
  // TODO: invoke OpenClaw agent / action suggestions
});

createQueueWorker("execute-action", async (job) => {
  console.log(`[worker] execute-action job`, job.data);
  // TODO: execute outbound actions (send reply, schedule event)
});

// Example enqueue helper (can be moved to services)
async function enqueueExamples() {
  await queues.fetchChannel.add("demo", { channelId: "demo-channel" });
}

enqueueExamples().catch((err) => {
  console.error("[worker] enqueue error", err);
});
