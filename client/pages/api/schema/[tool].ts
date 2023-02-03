import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";


const convertData = (data: Array<any>, toolName: any, displayName: any) => {
  const schema = {
      tool_name: toolName,
      display_name: displayName,
      fields: new Array<any>(),
      prompt: data[0].prompt,
  };

  let newField: any;

  data.forEach(field => {
      newField = {
          field_name: field.field_name,
          type: field.type,
          label: field.label,
          required: field.required,
          command: field.command,
          options: new Array<any>(),
          placeholder: '',
      };

      if (field.options) {
          newField.options = field.options.map((option: any) => {
              return {
                  value: option.value,
                  label: option.label
              };
          });
      }

      if (field.placeholder) {
          newField.placeholder = field.placeholder;
      }

      schema.fields.push(newField);
  });

  return [schema];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tool } = req.query;

  const result: Array<any> = await prisma.$queryRaw`SELECT tool.*, field.* FROM field JOIN tool ON field.tool_id=tool.tool_id where tool.tool_name = ${tool}`
  if (result.length === 0) {
    return res.status(400).send({ error: 'Error fetching tool information' });
  }

  if (!result[0]) {
    return res.status(400).send({ error: 'Error fetching tool information. No tool found' });
  }
  
  const toolData = convertData(result, tool, result[0].display_name); 

  if (!tool) {
    return res.status(400).send({ error: 'Invalid tool' });
  }

  return res.json(toolData);
}

export default handler;