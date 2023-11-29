import { z } from "zod";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const listRouter = createTRPCRouter({
  getAllForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.list.findMany({
        where: {
          User: {
            username: input.userName,
          },
        },
        select: {
          userId: true,
          id: true,
          name: true,
          description: true,
          _count: {
            select: { events: true },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
    }),
  getFollowing: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.list.findMany({
        where: {
          FollowList: {
            some: {
              User: {
                username: input.userName,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: { events: true },
          },
          createdAt: true,
          updatedAt: true,
          User: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
    }),
  get: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.list.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          description: true,
          events: {
            orderBy: {
              startDateTime: "asc",
            },
            include: {
              User: true,
              FollowEvent: true,
              Comment: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          FollowList: true,
          User: true,
        },
      });
    }),
  follow: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.followList.create({
        data: {
          userId: userId,
          listId: input.listId,
        },
      });
    }),
  unfollow: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.followList.delete({
        where: {
          userId_listId: {
            userId: userId,
            listId: input.listId,
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.list.create({
        data: {
          userId: userId,
          name: input.name,
          description: input.description,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        listId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.list.update({
        where: {
          id: input.listId,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.list.delete({
        where: {
          id: input.listId,
        },
      });
    }),
});
