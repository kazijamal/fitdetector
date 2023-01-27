import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const outfitRouter = createTRPCRouter({
  getRecent: publicProcedure.query(async ({ ctx }) => {
    const recentOutfits = await ctx.prisma.outfit.findMany({
      include: { celebrity: true },
      orderBy: [{ createdAt: 'desc' }],
    });

    return recentOutfits;
  }),
  create: protectedProcedure
    .input(
      z.object({
        celebrityName: z.string(),
        image: z.string(),
        description: z.string().nullish(),
        source: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { celebrityName, image, description, source } = input;
      const userId = ctx.session.user.id || '';

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
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      if (ctx.session?.user) {
        const userId = ctx.session.user.id;

        const outfit = await ctx.prisma.outfit.findUniqueOrThrow({
          where: { id },
          include: {
            celebrity: true,
            user: true,
            clothing: true,
            _count: { select: { ratings: true } },
          },
        });

        const rating = await ctx.prisma.outfitRating.findFirst({
          where: { outfitId: outfit.id, userId },
        });

        return {
          outfit,
          rating: rating?.value,
        };
      } else {
        const outfit = await ctx.prisma.outfit.findUniqueOrThrow({
          where: { id },
          include: {
            celebrity: true,
            user: true,
            clothing: true,
            _count: { select: { ratings: true } },
          },
        });

        return { outfit };
      }
    }),
  createRating: protectedProcedure
    .input(
      z.object({
        outfitId: z.string(),
        value: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { outfitId, value } = input;
      const userId = ctx.session.user.id || '';

      const rating = await ctx.prisma.outfitRating.create({
        data: {
          outfitId,
          userId,
          value,
        },
      });

      const averageOutfitRating = await ctx.prisma.outfitRating.aggregate({
        _avg: {
          value: true,
        },
        where: {
          outfitId,
        },
      });

      await ctx.prisma.outfit.update({
        where: {
          id: outfitId,
        },
        data: {
          rating: averageOutfitRating._avg.value,
        },
      });

      const outfit = await ctx.prisma.outfit.findUnique({
        where: { id: outfitId },
      });

      if (outfit) {
        const celebrityId = outfit.celebrityId;

        const averageCelebrityRating = await ctx.prisma.outfit.aggregate({
          _avg: {
            rating: true,
          },
          where: {
            celebrityId,
          },
        });

        await ctx.prisma.celebrity.update({
          where: { id: celebrityId },
          data: {
            rating: averageCelebrityRating._avg.rating,
          },
        });
      }

      return rating;
    }),
  mySubmissions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const outfits = await ctx.prisma.outfit.findMany({
      where: { userId },
      include: { celebrity: true },
      orderBy: [{ createdAt: 'desc' }],
    });

    return outfits;
  }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const userId = ctx.session.user.id || '';

      const deleteOutfit = await ctx.prisma.outfit.delete({
        where: { id },
      });

      const celebrity = await ctx.prisma.celebrity.findUniqueOrThrow({
        where: { id: deleteOutfit.celebrityId },
        include: {
          outfits: true,
        },
      });
      
      if (celebrity.outfits.length === 0) {
        await ctx.prisma.celebrity.delete({
          where: { id: deleteOutfit.celebrityId },
        });
      }

      return deleteOutfit;
    }),
});
