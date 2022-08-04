import { createRouter } from './context';
import { z } from 'zod';

export const outfitRouter = createRouter().mutation('create', {
  input: z.object({ name: z.string(), outfitPhoto: z.string() }),
  resolve({ input }) {
    return input;
  },
});
