import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const celebrityRouter = createTRPCRouter({
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

        const celebrity = await ctx.prisma.celebrity.findUniqueOrThrow({
          where: { id },
          include: {
            outfits: {
              include: { celebrity: true },
              orderBy: [{ createdAt: 'desc' }],
            },
            _count: { select: { followers: true } },
          },
        });

        const following = await ctx.prisma.follow.findFirst({
          where: { userId, celebrityId: id },
        });

        return {
          celebrity,
          following: Boolean(following),
        };
      } else {
        const celebrity = await ctx.prisma.celebrity.findUniqueOrThrow({
          where: { id },
          include: {
            outfits: {
              include: { celebrity: true },
              orderBy: [{ createdAt: 'desc' }],
            },
            _count: { select: { followers: true } },
          },
        });

        return { celebrity };
      }
    }),
  follow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const userId = ctx.session.user.id || '';

      const follow = await ctx.prisma.follow.create({
        data: {
          celebrityId: id,
          userId,
        },
      });

      return follow;
    }),
  unfollow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const userId = ctx.session.user.id;

      const follow = await ctx.prisma.follow.findFirstOrThrow({
        where: {
          celebrityId: id,
          userId,
        },
      });

      const deletedFollow = await ctx.prisma.follow.delete({
        where: {
          id: follow.id,
        },
      });

      return deletedFollow;
    }),
  following: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        follows: {
          include: { celebrity: true },
        },
      },
    });

    const celebrities = user.follows.map((follow) => follow.celebrity);

    const celebrityIds = celebrities.map((celebrity) => celebrity.id);

    const recentOutfits = await ctx.prisma.outfit.findMany({
      where: { celebrityId: { in: celebrityIds } },
      include: { celebrity: true },
      orderBy: [{ createdAt: 'desc' }],
    });

    return { celebrities, recentOutfits };
  }),
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { query } = input;
      const celebrities = await ctx.prisma.celebrity.findMany({
        where: {
          name: { contains: query },
        },
        include: {
          _count: { select: { outfits: true, followers: true } },
        },
      });
      return celebrities;
    }),
});
