import * as trpc from '@trpc/server';
import { createRouter } from './context';
import { z } from 'zod';

export const celebrityRouter = createRouter()
  .query('getById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      if (ctx.session?.user) {
        const userId = ctx.session.user.id;

        const celebrity = await ctx.prisma.celebrity.findUniqueOrThrow({
          where: { id },
          include: { outfits: true, _count: { select: { followers: true } } },
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
          include: { outfits: true, _count: { select: { followers: true } } },
        });

        return { celebrity };
      }
    },
  })
  .mutation('follow', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { id } = input;
      const userId = ctx.session.user.id;

      const follow = await ctx.prisma.follow.create({
        data: {
          celebrityId: id,
          userId,
        },
      });

      return follow;
    },
  })
  .mutation('unfollow', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

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
    },
  })
  .query('following', {
    async resolve({ input, ctx }) {
      if (!ctx.session?.user?.id) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
      }

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
    },
  });
