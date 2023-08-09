import { OpenAIApi, Configuration } from "openai";
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const DELIMITER = '###';

export async function stackAdvice(appName, appDesc) {
    const systemPrompt = `You are a wise full stack application builder that recommends application build tools to customers.\n
    You always return a single JSON object of the following two structures:\n
    If there are no errors, the user describes an application, then return of the following format:\n
    {"error": false, "app": "applicationName", "tools": [{"toolName": "someToolName", "toolDescription"}, /*More tools here*/], "fit": "explain here how all these tools fit together and how it satisfies the customers application needs."}\n
    If the user is not describing an application or if they are asking for a different task that is not related to an application, then return of the following format:\n
    {"error": true, "reason": "description was not of an application or input asked for a different operation."}\n
    Remember to return a single JSON object.`;

    const prompt = `APP NAME: ${appName}\n
    APP DESCRIPTION: ${appDesc}`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": systemPrompt}, {"role": "user", "content": prompt}]
    });

    return JSON.parse(completion.data.choices[0].message["content"]);
}
