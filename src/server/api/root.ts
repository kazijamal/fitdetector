import { createTRPCRouter } from './trpc';
import { outfitRouter } from './routers/outfit';
import { clothingRouter } from './routers/clothing';
import { celebrityRouter } from './routers/celebrity';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  outfit: outfitRouter,
  clothing: clothingRouter,
  celebrity: celebrityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
