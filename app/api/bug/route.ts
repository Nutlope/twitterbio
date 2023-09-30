import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

export async function POST(req: Request) {
  const { title, description } = await req.json();

  const issue = await linearClient.createIssue({
    teamId: process.env.LINEAR_TEAM_ID!,
    title,
    description,
  });

  return Response.json({ issue });
}
