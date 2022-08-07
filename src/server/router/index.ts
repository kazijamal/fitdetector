// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { outfitRouter } from './outfit';
import { clothingRouter } from './clothing';
import { celebrityRouter } from './celebrity';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('outfit.', outfitRouter)
  .merge('clothing.', clothingRouter)
  .merge('celebrity.', celebrityRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
