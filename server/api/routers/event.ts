import { z } from "zod";

import { Temporal } from "@js-temporal/polyfill";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { devLog } from "@/lib/utils";

const eventCreateSchema = z.object({
  event: z.any(), //TODO: add validation
  comment: z.string().optional(),
  lists: z.array(z.record(z.string().trim())),
  visibility: z.enum(["public", "private"]).optional(),
});

const eventUpdateSchema = z.object({
  id: z.string(),
  event: z.any(),
  comment: z.string().optional(),
  lists: z.array(z.record(z.string().trim())),
  visibility: z.enum(["public", "private"]).optional(),
});

const eventIdSchema = z.object({
  id: z.string(),
});

export const eventRouter = createTRPCRouter({
  getForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          OR: [
            {
              User: {
                username: {
                  equals: input.userName,
                },
              },
            },
            {
              FollowEvent: {
                some: {
                  User: {
                    username: {
                      equals: input.userName,
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
    }),
  getCreatedForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          OR: [
            {
              User: {
                username: {
                  equals: input.userName,
                },
              },
            },
          ],
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
    }),
  getFollowingForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          OR: [
            {
              User: {
                followedByUsers: {
                  some: {
                    Follower: {
                      username: input.userName,
                    },
                  },
                },
              },
            },
            {
              eventList: {
                some: {
                  User: {
                    followedByUsers: {
                      some: {
                        Follower: {
                          username: input.userName,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
    }),
  getSavedForUser: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        where: {
          FollowEvent: {
            some: {
              User: {
                username: input.userName,
              },
            },
          },
        },
        orderBy: {
          startDateTime: "asc",
        },
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
      });
    }),
  getPossibleDuplicates: publicProcedure
    .input(z.object({ startDateTime: z.date() }))
    .query(({ ctx, input }) => {
      const { startDateTime } = input;
      // start date time should be within 1 hour of the start date time of the event
      const startDateTimeLowerBound = new Date(startDateTime);
      startDateTimeLowerBound.setHours(startDateTime.getHours() - 1);
      const startDateTimeUpperBound = new Date(startDateTime);
      startDateTimeUpperBound.setHours(startDateTime.getHours() + 1);

      const possibleDuplicateEvents = ctx.db.event.findMany({
        where: {
          startDateTime: {
            gte: startDateTimeLowerBound,
            lte: startDateTimeUpperBound,
          },
        },
        select: {
          startDateTime: true,
          endDateTime: true,
          id: true,
          event: true,
          createdAt: true,
          userId: true,
          User: true,
          FollowEvent: true,
          Comment: true,
          visibility: true,
        },
      });
      return possibleDuplicateEvents;
    }),
  get: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.event.findUnique({
        where: {
          id: input.eventId,
        },
        select: {
          startDateTime: true,
          endDateTime: true,
          id: true,
          event: true,
          createdAt: true,
          userId: true,
          eventList: true,
          User: {
            include: {
              lists: true,
            },
          },
          FollowEvent: true,
          Comment: true,
          visibility: true,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.event.findMany({
      orderBy: {
        startDateTime: "asc",
      },
      include: {
        User: true,
        FollowEvent: true,
        Comment: true,
      },
    });
  }),
  getNext: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        excludeCurrent: z.boolean().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.event.findMany({
        include: {
          User: true,
          FollowEvent: true,
          Comment: true,
        },
        orderBy: {
          startDateTime: "asc",
        },
        where: {
          startDateTime: {
            gte: input?.excludeCurrent ? undefined : new Date(),
          },
          endDateTime: {
            gte: input?.excludeCurrent ? new Date() : undefined,
          },
        },
        take: input?.limit,
      });
    }),
  delete: protectedProcedure.input(eventIdSchema).mutation(({ ctx, input }) => {
    return ctx.db.event.delete({
      where: {
        id: input.id,
      },
    });
  }),
  update: protectedProcedure
    .input(eventUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, sessionClaims } = ctx.auth;

      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }

      const roles = (sessionClaims?.roles || []) as string[];
      const isAdmin = roles?.includes("admin");

      const { id, event, comment, lists, visibility } = input;
      const hasComment = comment && comment.length > 0;
      const hasLists = lists && lists.length > 0;
      const hasVisibility = visibility && visibility.length > 0;
      devLog("hasComment: ", hasComment, comment);
      devLog("hasLists: ", hasLists, lists);
      devLog("hasVisibility: ", hasVisibility, visibility);

      const start = Temporal.ZonedDateTime.from(
        `${event.startDate}T${event.startTime}[${event.timeZone}]`
      );
      const end = Temporal.ZonedDateTime.from(
        `${event.endDate}T${event.endTime}[${event.timeZone}]`
      );
      const startUtc = start.toInstant().toString();
      const endUtc = end.toInstant().toString();

      // check if user is event owner
      const eventOwner = await ctx.db.event.findFirst({
        where: {
          id: id,
          userId: userId || "",
        },
      });

      if (!eventOwner && !isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unauthorized",
        });
      }

      if (eventOwner) {
        return ctx.db.event.update({
          where: {
            id: id,
          },
          data: {
            userId: userId,
            event: event,
            startDateTime: startUtc,
            endDateTime: endUtc,
            ...(hasVisibility && {
              visibility: visibility,
            }),
            ...(hasComment && {
              Comment: {
                create: [
                  {
                    content: comment,
                    userId: userId,
                  },
                ],
              },
            }),
            ...(!hasComment && {
              Comment: {
                deleteMany: {},
              },
            }),
            ...(hasLists && {
              eventList: {
                connect: lists.map((list) => ({
                  id: list.value,
                })),
              },
            }),
            ...(!hasLists && {
              eventList: {
                set: [],
              },
            }),
          },
        });
      } else {
        return ctx.db.event.update({
          where: {
            id: id,
          },
          data: {
            event: event,
            startDateTime: startUtc,
            endDateTime: endUtc,
            ...(hasVisibility && {
              visibility: visibility,
            }),
          },
        });
      }
    }),
  create: protectedProcedure
    .input(eventCreateSchema)
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }

      const { event, comment, lists, visibility } = input;

      const hasComment = comment && comment.length > 0;
      const hasLists = lists && lists.length > 0;
      const hasVisibility = visibility && visibility.length > 0;
      devLog("hasComment: ", hasComment, comment);
      devLog("hasLists: ", hasLists, lists);
      devLog("hasVisibility: ", hasVisibility, visibility);

      let startTime = event.startTime;
      let endTime = event.endTime;
      let timeZone = event.timeZone;

      // time zone is America/Los_Angeles if not specified
      if (!timeZone) {
        timeZone = "America/Los_Angeles";
      }

      // start time is 00:00 if not specified
      if (!startTime) {
        startTime = "00:00";
      }
      // end time is 23:59 if not specified
      if (!endTime) {
        endTime = "23:59";
      }

      const start = Temporal.ZonedDateTime.from(
        `${event.startDate}T${startTime}[${timeZone}]`
      );
      const end = Temporal.ZonedDateTime.from(
        `${event.endDate}T${endTime}[${timeZone}]`
      );
      devLog("calculated start and end: ", start, end);
      const startUtc = start.toInstant().toString();
      const endUtc = end.toInstant().toString();
      devLog("calculated start and end UTC: ", startUtc, endUtc);

      return ctx.db.event.create({
        data: {
          event: event,
          userId: userId,
          startDateTime: startUtc,
          endDateTime: endUtc,
          ...(hasVisibility && {
            visibility: visibility,
          }),
          ...(hasComment && {
            Comment: {
              create: [
                {
                  content: comment,
                  userId: userId,
                },
              ],
            },
          }),
          ...(hasLists && {
            eventList: {
              connect: lists.map((list) => ({
                id: list.value,
              })),
            },
          }),
        },
        select: {
          id: true,
        },
      });
    }),
  follow: protectedProcedure.input(eventIdSchema).mutation(({ ctx, input }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No user id found in session",
      });
    }
    return ctx.db.followEvent.create({
      data: {
        userId: userId,
        eventId: input.id,
      },
    });
  }),
  unfollow: protectedProcedure
    .input(eventIdSchema)
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.followEvent.delete({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: input.id,
          },
        },
      });
    }),
  addToList: protectedProcedure
    .input(z.object({ eventId: z.string(), listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          eventList: {
            connect: {
              id: input.listId,
            },
          },
        },
      });
    }),
  removeFromList: protectedProcedure
    .input(z.object({ eventId: z.string(), listId: z.string() }))
    .mutation(({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No user id found in session",
        });
      }
      return ctx.db.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          eventList: {
            disconnect: {
              id: input.listId,
            },
          },
        },
      });
    }),
});
