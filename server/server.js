require('dotenv').config()
// console.log(process.env)
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
// const schema = require('./schema.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function splitList(inputString) {
    console.log(inputString.split(/\d+\./))
    let results = inputString.split(/\d+\./).map(result => {

        trimmed = result.trim()
        return trimmed.replace(/\\n/g, "\n")
    }
    );

    console.log()
    return results;
}

const convertData = (data, toolName, displayName) => {
    const schema = {
        tool_name: toolName,
        display_name: displayName,
        fields: [],
        prompt: data[0].prompt,
    };

    data.forEach(field => {
        const newField = {
            field_name: field.field_name,
            type: field.type,
            label: field.label,
            required: field.required,
            command: field.command
        };

        if (field.options) {
            newField.options = field.options.map(option => {
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

app.get('/allTools', async (req, res) => {
//     return res.send([
//         {
//         "name": "blog-idea-generator"
//         }
//  ])
    try {
        const client = await pool.connect()
        const queryResult = await client.query({
            text: 'SELECT tool_name from tool'
        });
        client.release();
        if (queryResult.rowCount === 0) {
            return res.status(400).send({ error: 'No tools found' });
        }

        if (!queryResult) {
            return res.status(400).send({ error: 'No fields found for this tool' });
        }

        if (!queryResult.rows[0]) {
            return res.status(400).send({ error: 'Error fetching tool information. No tool found' });
        }

        return res.send(queryResult.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

app.post("/completions", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send("No prompt in the request");
    }

    const payload = {
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: true,
        n: 1,
    };

    try {
        const res = await fetch("https://api.openai.com/v1/completions", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        const data = res.body;

        return new Response(data, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/schema/:toolName', async (req, res) => {
    const toolName = req.params.toolName;
    console.log(toolName)
    try {
        const client = await pool.connect()
        const queryResult = await client.query({
            text: 'SELECT tool.*, field.* FROM field JOIN tool ON field.tool_id=tool.tool_id where tool.tool_name = $1',
            values: [toolName]
        });

        console.log(queryResult.rows)
        // const queryResult = await client.query(`WITH fields_data AS (
        //     SELECT 
        //         fields.name AS name,
        //         fields.type AS type,
        //         fields.label AS label,
        //         fields.placeholder AS placeholder,
        //         jsonb_array_elements(fields.options) AS options,
        //         fields.required AS required
        //     FROM fields
        //     WHERE fields.schema_id = (SELECT id FROM schemas WHERE name = $1)
        // )

        // SELECT 
        //     schemas.name AS name,
        //     schemas.display_name AS display_name,
        //     fields_data.name AS field_name,
        //     fields_data.type AS field_type,
        //     fields_data.label AS field_label,
        //     fields_data.placeholder AS field_placeholder,
        //     fields_data.options->>'value' AS option_value,
        //     fields_data.options->>'label' AS option_label,
        //     fields_data.required AS field_required,
        //     schemas.prompt AS prompt
        // FROM schemas
        // LEFT JOIN fields ON schemas.id = fields.schema_id
        // LEFT JOIN fields_data ON fields_data.name = fields.name
        // WHERE schemas.name = $1`, [toolName]);

        client.release();
        if (queryResult.rowCount === 0) {
            return res.status(400).send({ error: 'Error fetching tool information' });
        }

        if (!queryResult) {
            return res.status(400).send({ error: 'No fields found for this tool' });
        }

        if (!queryResult.rows[0]) {
            return res.status(400).send({ error: 'Error fetching tool information. No tool found' });
        }

        // res.send(queryResult.rows)
        //TODO ERROR, change 2nd tooldname
        console.log("queryResult", queryResult)
        const tool = convertData(queryResult.rows, toolName, queryResult.rows[0].display_name)
        // const tool = queryResult.rows.reduce((acc, curr) => {
        //     let schema = acc.find(s => s.name === curr.name);
        //     if (!schema) {
        //         schema = {
        //             name: curr.name,
        //             display_name: curr.display_name,
        //             fields: [],
        //             prompt: curr.prompt
        //         };
        //         acc.push(schema);
        //     }
        //     let field = schema.fields.find(f => f.name === curr.field_name);
        //     if (!field) {
        //         field = {
        //             name: curr.field_name,
        //             type: curr.field_type,
        //             label: curr.field_label,
        //             placeholder: curr.field_placeholder,
        //             options: [],
        //             required: curr.field_required
        //         };
        //         schema.fields.push(field);
        //     }
        //     if (curr.option_value && curr.option_label) {
        //         field.options.push({
        //             value: curr.option_value,
        //             label: curr.option_label
        //         });
        //     }
        //     return acc;
        // }, []);

        if (!tool) {
            return res.status(400).send({ error: 'Invalid tool' });
        }
        res.send(tool);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

function replaceVariables(prompt, variables) {
    let newPrompt = prompt;
    for (const key in variables) {
        if (variables.hasOwnProperty(key)) {
            const value = variables[key];
            newPrompt = newPrompt.replace(`{{${key}}}`, value);
        }
    }
    return newPrompt;
}

function validatePrompt(prompt) {
    const regex = /{{([^}]+)}}/g;
    const match = prompt.match(regex);
    return !match;
}

//TODO SHOULD BE GET??

app.post('/generate', async (req, res) => {
    const { toolName, formValues } = req.body;
    try {
        try {
            const client = await pool.connect()
            const modelResponse = await client.query({
                text: 'SELECT * FROM tool WHERE tool_name = $1',
                values: [toolName]
            });
            client.release();
            if (modelResponse.rowCount === 0) {
                res.status(400).send({ error: 'Error fetching prompt' });
            }

            console.log("prrsp", modelResponse.rows[0])

            model = modelResponse.rows[0]
            const promptWithVariables = model.prompt;
            // const prompt = tool.fields.reduce((prompt, field) => {
            //     return prompt.replace(`{${field.name}}`, formValues[field.name]);
            // }, tool.rows[0].prompt);
            const newPrompt = replaceVariables(promptWithVariables, formValues);
            const isValid = validatePrompt(newPrompt);
            console.log("prompt is", newPrompt)

            if (!isValid) {
                res.status(400).send({ error: 'Error parsing prompt' });
            }
            console.log("stop", model.stop)
            try {
                axios.post('https://api.openai.com/v1/completions', {
                    model: "text-davinci-003",
                    prompt: newPrompt,
                    temperature: model.temperature,
                    max_tokens: model.max_tokens,
                    top_p: model.top_p,
                    frequency_penalty: model.frequency_penalty,
                    presence_penalty: model.presence_penalty,
                    n: model.n_responses,
                    stop: JSON.parse(model.stop)
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    }
                }).then(response => {
                    console.log("response", response.data.choices[0].text)
                    // const splitResponse = splitList(response.data.choices[0].text)
                    // console.log("splitList", splitResponse);
                    // res.send(splitResponse);

                    //deletes newline at the end (I think)
                    const allOutputs = response.data.choices.map(choice => choice.text.trim().replace(/\\n/g, "\n"))
                    res.send(allOutputs);
                });

            } catch (error) {
                console.error(error);
                res.status(500).send(error);
            }

        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});



app.post('/toolModel', async (req, res) => {
    const { toolName, formData } = req.body;
    try {
        const client = await pool.connect()
        const modelResponse = await client.query({
            text: 'SELECT * FROM tool WHERE tool_name = $1',
            values: [toolName]
        });
        client.release();
        if (modelResponse.rowCount === 0) {
            return res.status(400).send({ error: 'Error fetching prompt' });
        }

        console.log("prrsp", modelResponse.rows[0])

        model = modelResponse.rows[0]
        const promptWithVariables = model.prompt;
        // const prompt = tool.fields.reduce((prompt, field) => {
        //     return prompt.replace(`{${field.name}}`, formValues[field.name]);
        // }, tool.rows[0].prompt);
        const newPrompt = replaceVariables(promptWithVariables, formData);
        const isValid = validatePrompt(newPrompt);
        console.log("prompt is", newPrompt)

        if (!isValid) {
            res.status(400).send({ error: 'Error parsing prompt' });
        }
//           const payload = {
//     model: "text-davinci-003",
//     prompt: newPrompt,
//     temperature: 0.7,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     max_tokens: 200,
//     stream: true,
//     n: 1,
//   };

        const payload = {
            model: "text-davinci-003",
            prompt: newPrompt,
            temperature: model.temperature,
            max_tokens: model.max_tokens,
            top_p: model.top_p,
            frequency_penalty: model.frequency_penalty,
            presence_penalty: model.presence_penalty,
            n: 2,
            stream: true,
            stop: JSON.parse(model.stop)
        };

        return res.send(JSON.stringify(payload))
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.listen(5001, () => {
    console.log('Server listening on port 5001');
});

