import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const eventFollowSchema = z.object({
  eventId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = eventFollowSchema.parse(json);
    const eventId = body.eventId;

    const FollowEvent = await db.followEvent.create({
      data: {
        userId: userId,
        eventId: eventId,
      },
    });

    return new Response(JSON.stringify(FollowEvent));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.log(error);
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
    const body = eventFollowSchema.parse(json);
    const eventId = body.eventId;

    const FollowEvent = await db.followEvent.delete({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
    });

    return new Response(JSON.stringify(FollowEvent));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
