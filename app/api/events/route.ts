import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";

export const dynamic = "force-dynamic";

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

const eventDeleteSchema = z.object({
  id: z.string(),
});

const devLog = (message: any, ...optionalParams: any[]) => {
  // if (process.env.NODE_ENV === "development") {
  console.log(message, ...optionalParams);
  // }
};

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const posts = await db.event.findMany({
      select: {
        id: true,
        event: true,
        createdAt: true,
      },
      where: {
        userId: userId,
      },
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = eventCreateSchema.parse(json);
    const event = body.event as AddToCalendarButtonProps;
    devLog("processed event: ", event);
    const comment = body.comment;
    const lists = body.lists;
    const visibility = body.visibility;
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

    const post = await db.event.create({
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

    return new Response(JSON.stringify(post));
  } catch (error) {
    devLog(error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = eventUpdateSchema.parse(json);
    const id = body.id;
    const event = body.event as AddToCalendarButtonProps;
    devLog("processed event: ", event);
    const comment = body.comment;
    const lists = body.lists;
    const visibility = body.visibility;
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

    const post = await db.event.update({
      where: {
        id: id,
      },
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

    return new Response(JSON.stringify(post));
  } catch (error) {
    devLog(error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = eventDeleteSchema.parse(json);

    const post = await db.event.delete({
      where: {
        id: body.id,
        userId: userId,
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
