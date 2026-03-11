import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server-adapters-express";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { prisma } from "./db.js";

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

app.listen(config.port, () => {
  console.log(`[api] listening on port ${config.port} (env=${config.env})`);
});
