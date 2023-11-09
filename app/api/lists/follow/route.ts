import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const listFollowSchema = z.object({
  listId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = listFollowSchema.parse(json);
    const listId = body.listId;

    const FollowList = await db.followList.create({
      data: {
        userId: userId,
        listId: listId,
      },
    });

    return new Response(JSON.stringify(FollowList));
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
    const body = listFollowSchema.parse(json);
    const listId = body.listId;

    const FollowList = await db.followList.delete({
      where: {
        userId_listId: {
          userId: userId,
          listId: listId,
        },
      },
    });

    return new Response(JSON.stringify(FollowList));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
