import * as trpc from '@trpc/server';
import { createProtectedRouter } from './protected-router';
import { z } from 'zod';

export const protectedOutfitRouter = createProtectedRouter().mutation(
  'create',
  {
    input: z.object({
      celebrityName: z.string(),
      image: z.string(),
      description: z.string().nullish(),
      source: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const { celebrityName, image, description, source } = input;
      const userId = ctx.session.user.id;
      if (userId == undefined) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }
      const foundCelebrity = await ctx.prisma.celebrity.findFirst({
        where: { name: celebrityName },
      });
      let celebrityId;
      if (foundCelebrity) {
        celebrityId = foundCelebrity.id;
      } else {
        const celebrity = await ctx.prisma.celebrity.create({
          data: { name: celebrityName },
        });
        celebrityId = celebrity.id;
      }
      const outfit = await ctx.prisma.outfit.create({
        data: {
          userId,
          celebrityId,
          image,
          description: description === '' ? null : description,
          source: source === '' ? null : source,
        },
      });
      return outfit;
    },
  }
);
