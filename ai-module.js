import { OpenAIApi, Configuration } from "openai";
import dotenv from 'dotenv';
import Logger from "js-logger";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const DELIMITER = '###';

export async function stackAdvice(appName, appDesc) {
    const systemPrompt = `You are a wise full stack application developer. You are aware of modern tech tools and expert in their use cases.\n
    Users will ask you to build a tech stack for their applications, they will mainly provide their application name and their application's description.\n
    Based on their input, you reply with a single JSON object.\n
    If the user input actually contains information about their application, then return of the following format:\n
    {"error": false, "app": "applicationName", "tools": [{"toolName": "someToolName", "toolDescription"}, /*More tools here*/], "fit": "explain here how all these tools fit together and how it satisfies the customers application needs.", "summary": "a summary of what the application does."}\n
    If the user input is irrelevant to an application or they are asking for a task that is not relevant to building a full stack application, then return of the following format:\n
    {"error": true, "reason": "description was not of an application or input asked for a different operation."}\n
    Remember to always return a single JSON object.`;

    const userPrompt = `Make a full stack plan based on the following info delimited by ${DELIMITER}.\n
    Here is the application information:\n
    ${DELIMITER}\n
    APP NAME: ${appName}\n
    APP DESCRIPTION: ${appDesc}\n
    ${DELIMITER}`;

    Logger.info("Sending completion...");
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": systemPrompt}, {"role": "user", "content": userPrompt}]
    });
    Logger.info("Received completion");

    return JSON.parse(completion.data.choices[0].message["content"]);
}
