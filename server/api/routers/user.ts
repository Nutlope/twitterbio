import { z } from "zod";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getByUsername: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          username: input.userName,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: {
        username: "asc",
      },
    });
  }),
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.followUser.findMany({
        where: {
          Follower: {
            username: input.userName,
          },
        },
        select: {
          Following: {
            select: {
              username: true,
            },
          },
        },
      });
    }),
  getIfFollowing: publicProcedure
    .input(z.object({ followerId: z.string(), followingId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.followUser.findUnique({
        where: {
          followerId_followingId: {
            followerId: input.followerId,
            followingId: input.followingId,
          },
        },
      });
    }),
  follow: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.followUser.create({
        data: {
          followerId: userId,
          followingId: input.followingId,
        },
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.followUser.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: input.followingId,
          },
        },
      });
    }),
  getTopUsersByUpcomingEvents: publicProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const excludeUsers = ["user_2X3xAXHdaKKG8RLZqm72wb119Yj"];
      const currentDate = new Date();

      const leaderboardUsers = await ctx.db.user.findMany({
        where: {
          id: {
            notIn: excludeUsers,
          },
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          imageUrl: true,
          _count: {
            select: {
              events: {
                where: {
                  startDateTime: {
                    gt: currentDate,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          events: {
            _count: "desc",
          },
        },
      });

      const sortedLeaderboardUsers = leaderboardUsers
        .sort((a, b) => b._count.events - a._count.events)
        .slice(0, input.limit)
        .filter((user) => user._count.events > 0);

      return sortedLeaderboardUsers;
    }),
});
