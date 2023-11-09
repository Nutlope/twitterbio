import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const eventListAddSchema = z.object({
  eventId: z.string(),
  listId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = eventListAddSchema.parse(json);
    const eventId = body.eventId;
    const listId = body.listId;

    const event = await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        eventList: {
          disconnect: {
            id: listId,
          },
        },
      },
    });

    return new Response(JSON.stringify(event));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
