import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { prisma } from "./db.js";
import { fetchChannelQueue } from "./queues.js";

const config = loadConfig();

const t = initTRPC.create();
const appRouter = t.router({
  healthcheck: t.procedure.query(() => ({ status: "ok" as const })),
  echo: t.procedure.input(z.object({ message: z.string() })).query(({ input }) => ({
    message: input.message,
  })),
  users: t.procedure.query(async () => {
    const users = await prisma.user.findMany({ take: 5 });
    return users;
  }),
  threads: t.procedure
    .input(z.object({ channelId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const threads = await prisma.thread.findMany({
        where: input?.channelId ? { channelId: input.channelId } : undefined,
        orderBy: { updatedAt: "desc" },
        include: { channel: true },
        take: 50,
      });
      return threads;
    }),
  messages: t.procedure
    .input(z.object({ threadId: z.string() }))
    .query(async ({ input }) => {
      return prisma.message.findMany({
        where: { threadId: input.threadId },
        orderBy: { occurredAt: "asc" },
      });
    }),
  actionCreate: t.procedure
    .input(
      z.object({
        threadId: z.string(),
        type: z.string(),
        payload: z.any(),
        userId: z.string(), // owner/approver for now
      })
    )
    .mutation(async ({ input }) => {
      const action = await prisma.action.create({
        data: {
          threadId: input.threadId,
          type: input.type,
          payload: input.payload,
          status: "pending",
        },
      });
      await prisma.approval.create({
        data: {
          actionId: action.id,
          userId: input.userId,
          status: "pending",
        },
      });
      return action;
    }),
  approvalUpdate: t.procedure
    .input(
      z.object({
        actionId: z.string(),
        status: z.enum(["approved", "rejected"]),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updated = await prisma.approval.update({
        where: { actionId: input.actionId },
        data: { status: input.status, note: input.note },
        include: { action: true },
      });
      // reflect status on action
      await prisma.action.update({
        where: { id: input.actionId },
        data: { status: input.status },
      });
      return updated;
    }),
  enqueueFetch: t.procedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ input }) => {
      await fetchChannelQueue.add("fetch", { channelId: input.channelId });
      return { enqueued: true } as const;
    }),
});
export type AppRouter = typeof appRouter;

const app = express();
const corsOrigins = config.corsOrigins?.split(",").map((x) => x.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins ?? true }));
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Simple REST helpers for web prototyping
app.get("/threads", async (_, res) => {
  const threads = await prisma.thread.findMany({
    orderBy: { updatedAt: "desc" },
    include: { channel: true },
    take: 50,
  });
  res.json(threads);
});

app.get("/threads/:id/messages", async (req, res) => {
  const { id } = req.params;
  const messages = await prisma.message.findMany({
    where: { threadId: id },
    orderBy: { occurredAt: "asc" },
  });
  res.json(messages);
});

app.listen(config.port, () => {
  console.log(`[api] listening on port ${config.port} (env=${config.env})`);
});
