import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { db } from "@/lib/db";

const listCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const listUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

const listDeleteSchema = z.object({
  id: z.string(),
});

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 });
    }

    const posts = await db.list.findMany({
      select: {
        id: true,
        createdAt: true,
        name: true,
        description: true,
        events: true,
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
    const body = listCreateSchema.parse(json);

    const post = await db.list.create({
      data: {
        name: body.name,
        description: body.description,
        userId: userId,
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.log(error);
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
    const body = listUpdateSchema.parse(json);

    const post = await db.list.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    console.log(error);
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
    const body = listDeleteSchema.parse(json);

    const post = await db.list.delete({
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
