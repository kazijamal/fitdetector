import * as trpc from '@trpc/server';
import { createRouter } from './context';
import { z } from 'zod';

export const clothingRouter = createRouter().mutation('create', {
  input: z.object({
    outfitId: z.string(),
    type: z.string(),
    brand: z.string(),
    price: z.number().nullish(),
    link: z.string(),
  }),
  async resolve({ input, ctx }) {
    if (!ctx.session?.user?.id) {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { outfitId, type, brand, price, link } = input;
    const userId = ctx.session.user.id;

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
  },
});
