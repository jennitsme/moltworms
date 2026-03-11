import { loadWorkerConfig } from "./config.js";
import { queues, createQueueWorker } from "./queues.js";
import { getTelegramBot } from "./connectors/telegram.js";
import { prisma } from "./db.js";

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
  const msg = await prisma.message.findFirst({
    where: { id: job.data.messageId.split("-")[1] },
    include: { thread: true },
  });
  if (!msg) {
    console.warn("[worker] message not found", job.data.messageId);
    return;
  }
  // TODO: call agent to propose actions; for now create placeholder action
  await prisma.action.create({
    data: {
      threadId: msg.threadId,
      type: "suggest_reply",
      payload: { suggestion: "Draft reply here" },
      status: "pending",
    },
  });
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
