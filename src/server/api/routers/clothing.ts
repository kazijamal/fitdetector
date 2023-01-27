import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const clothingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        outfitId: z.string(),
        type: z.string(),
        brand: z.string(),
        price: z.number().nullish(),
        link: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { outfitId, type, brand, price, link } = input;
      const userId = ctx.session.user.id || '';

      const clothing = await ctx.prisma.clothing.create({
        data: {
          outfitId,
          userId,
          type,
          brand,
          price,
          link,
        },
      });

      return clothing;
    }),
});
