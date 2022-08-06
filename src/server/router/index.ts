// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { outfitRouter } from './outfit';
import { protectedOutfitRouter } from './protected-outfit';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('question.', protectedExampleRouter)
  .merge('outfit.', outfitRouter)
  .merge('protected-outfit.', protectedOutfitRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
