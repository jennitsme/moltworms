import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server-adapters-express";
import { z } from "zod";

const t = initTRPC.create();
const appRouter = t.router({
  healthcheck: t.procedure.query(() => ({ status: "ok" as const })),
  echo: t.procedure.input(z.object({ message: z.string() })).query(({ input }) => ({
    message: input.message,
  })),
});
export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[api] listening on port ${port}`);
});
