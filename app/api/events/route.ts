import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { db } from "../../../lib/db";

const eventCreateSchema = z.object({
  event: z.any(), //TODO: add validation
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

    const post = await db.event.create({
      data: {
        event: body.event,
        userId: userId,
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
