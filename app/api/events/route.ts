import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";

const eventCreateSchema = z.object({
  event: z.any(), //TODO: add validation
});

const eventDeleteSchema = z.object({
  id: z.number(),
});

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

    const start = Temporal.ZonedDateTime.from(
      `${event.startDate}T${event.startTime}[${event.timeZone}]`
    );
    const end = Temporal.ZonedDateTime.from(
      `${event.endDate}T${event.endTime}[${event.timeZone}]`
    );
    const startUtc = start.toInstant().toString();
    const endUtc = end.toInstant().toString();

    const post = await db.event.create({
      data: {
        event: event,
        userId: userId,
        startDateTime: startUtc,
        endDateTime: endUtc,
      },
      select: {
        id: true,
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
