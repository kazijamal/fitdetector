import { createRouter } from './context';

export const outfitRouter = createRouter().query('getRecent', {
  async resolve({ ctx }) {
    return await ctx.prisma.outfit.findMany({
      include: { celebrity: true },
      orderBy: [{ createdAt: 'desc' }],
    });
  },
});
