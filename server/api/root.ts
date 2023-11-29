import { userRouter } from "./routers/user";
import { listRouter } from "./routers/list";
import { eventRouter } from "./routers/event";
import { linearRouter } from "./routers/linear";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  user: userRouter,
  list: listRouter,
  linear: linearRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
