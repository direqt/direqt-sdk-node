/**
 * Simple Direqt bot demonstrating integration with OpenAI.
 *
 * This sample demonstrates how to connect a simple OpenAI-based chatbot to
 * Direqt to send and receive messages.
 *
 * To connect this sample to a Direqt chatbot:
 *
 *  $ ngrok http 3000
 *
 * Copy the "Forwarding" address that ngrok provides. It will be something like
 * https://12345678.ngrok.io. Be sure to pick the "https" address.
 *
 * In the Direqt console:
 *
 * - create a new chatbot using Add Chatbot...
 * - navigate to the "Webhook" settings page for your bot, and set the
 *  "Webhook URL" to the ngrok address you copied above.
 * - copy the access token and signing secret from the bottom of the page.
 *
 * Back on your development machine:
 *
 * - rename the .env.sample file in this directory to .env, and populate it with:
 *
 *  DIREQT_ACCESS_TOKEN=<your bot's access token>
 *  DIREQT_SIGNING_SECRET=<your bot's signing secret>
 *  OPENAI_API_KEY=<your OpenAI API key>
 *
 * - install dependencies and start the server:
 *
 *  $ npm install
 *  $ npm start
 *
 * You can now use the embedded webchat in the Direqt Console to chat with your
 * bot.
 *
 * Documentation and resources:
 *
 *  Direqt Messaging API Documentation: https://docs.direqt.ai/messaging-api
 *  OpenAI API Documentation: https://platform.openai.com/docs/api-reference
 *  Ngrok Documentation: https://ngrok.com/docs
 */

import { DireqtApi } from 'direqt';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();

const rawBodyExtractor = (req: Request, res: Response, buf: Buffer) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>req).rawBody = buf.toString();
};

const accessToken: string = process.env.DIREQT_ACCESS_TOKEN as string;
const signingSecret: string = process.env.DIREQT_SIGNING_SECRET as string;
const openaiApiKey: string = process.env.OPENAI_API_KEY as string;
if (!accessToken || !signingSecret || !openaiApiKey) {
    throw new Error('Missing required environment variable(s).');
}

const direqt = new DireqtApi({
    accessToken,
    signingSecret,
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Direqt messaging webhook.
 *
 * This is endpoint called by Direqt when a message is sent to the bot by a user.
 * In this example, we pass the user's message to OpenAI and use the response
 * to reply to the user.
 *
 * Note the use of the verifyMiddleware() function to verify that the message
 * received originated from Direqt.
 */
app.post(
    '/',
    express.json({ verify: rawBodyExtractor }),
    direqt.messaging.verifyMiddleware(),
    async (req, res) => {
        const { userId, userMessage } = req.body;
        const text = userMessage.content?.text;
        if (text) {
            const reply = await getOpenAIResponse(text);
            await direqt.messaging.sendTextMessage(userId, reply);

            console.log(`user: ${text}`);
            console.log(`bot: ${reply}`);
        }
        res.sendStatus(200);
    }
);

async function getOpenAIResponse(prompt: string): Promise<string> {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful AI assistant.' },
            { role: 'user', content: prompt },
        ],
    });

    return response.data.choices[0].message?.content || '';
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
