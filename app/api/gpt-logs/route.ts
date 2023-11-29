import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// todo: convert to trpc
export async function POST(req: Request) {
  const { data } = await req.json();
  // Create a new requestResponse in the database, but don't await it
  const requestResponse = await db.requestResponse.create({
    data: data,
  });
  console.log("gpt-logs saved to database", requestResponse);
  return new Response(JSON.stringify(requestResponse));
}
