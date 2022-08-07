import * as trpc from '@trpc/server';
import { createRouter } from './context';
import { z } from 'zod';

export const outfitRouter = createRouter()
  .query('getRecent', {
    async resolve({ ctx }) {
      const recentOutfits = await ctx.prisma.outfit.findMany({
        include: { celebrity: true },
        orderBy: [{ createdAt: 'desc' }],
      });

      return recentOutfits;
    },
  })
  .mutation('create', {
    input: z.object({
      celebrityName: z.string(),
      image: z.string(),
      description: z.string().nullish(),
      source: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { celebrityName, image, description, source } = input;
      const userId = ctx.session.user.id;

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
  })
  .query('getById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      if (ctx.session?.user) {
        const userId = ctx.session.user.id;

        const outfit = await ctx.prisma.outfit.findUniqueOrThrow({
          where: { id },
          include: { celebrity: true, user: true, clothing: true },
        });

        const following = await ctx.prisma.follow.findFirst({
          where: { userId, celebrityId: outfit.celebrity.id },
        });

        const rating = await ctx.prisma.outfitRating.findFirst({
          where: { outfitId: outfit.id, userId },
        });

        return {
          outfit,
          following: Boolean(following),
          rating: rating?.value,
        };
      } else {
        const outfit = await ctx.prisma.outfit.findUniqueOrThrow({
          where: { id },
          include: { celebrity: true, user: true, clothing: true },
        });

        return { outfit };
      }
    },
  })
  .mutation('createRating', {
    input: z.object({
      outfitId: z.string(),
      value: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { outfitId, value } = input;
      const userId = ctx.session.user.id;

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
    },
  })
  .query('mySubmissions', {
    async resolve({ ctx }) {
      if (!ctx.session?.user?.id) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

      const userId = ctx.session.user.id;

      const outfits = await ctx.prisma.outfit.findMany({
        where: { userId },
        include: { celebrity: true },
        orderBy: [{ createdAt: 'desc' }],
      });

      return outfits;
    },
  });
