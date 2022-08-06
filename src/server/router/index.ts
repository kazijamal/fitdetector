// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { outfitRouter } from './outfit';
import { clothingRouter } from './clothing';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('outfit.', outfitRouter)
  .merge('clothing.', clothingRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
