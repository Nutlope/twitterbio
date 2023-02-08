import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

/*export const config = {
  runtime: "edge",
};*/

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await prisma.tool.findMany({
    select: {
      tool_name: true,
    }
  });

  if (result.length === 0) {
    res.status(400).json({ error: 'Not found' });
  }

  if (!result[0]) {
    res.status(400).json({ error: 'No fields found for this tool' });
  }

  return res.json(result);
}

export default handler;