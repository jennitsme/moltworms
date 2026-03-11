import { loadWorkerConfig } from "./config.js";

const config = loadWorkerConfig();
console.log(`[worker] ready (env=${config.env})`);
console.log(`[worker] postgres=${config.postgresUrl} redis=${config.redisUrl}`);

// TODO: add queues, channel sync loops, OpenClaw agent orchestration
