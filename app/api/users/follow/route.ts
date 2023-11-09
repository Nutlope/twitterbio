import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const userFollowSchema = z.object({
  followingId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = userFollowSchema.parse(json);
    const followingId = body.followingId;

    const FollowList = await db.followUser.create({
      data: {
        followerId: userId,
        followingId: followingId,
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
    const body = userFollowSchema.parse(json);
    const followingId = body.followingId;

    const FollowList = await db.followUser.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
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
