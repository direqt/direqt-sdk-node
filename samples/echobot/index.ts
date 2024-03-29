/**
 * Simple Direqt echo bot
 *
 * This sample demonstrates how to connect your chatbot to Direqt to send and
 * receive messages.
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
 * - at the bottom of the page copy the access token
 * and signing secret.
 *
 * Back on your development machine:
 *
 *  - rename the .env.sample file in this directory to .env, and populate it with:
 *  DIREQT_ACCESS_TOKEN=<your bot's access token>
 *  DIREQT_SIGNING_SECRET=<your bot's signing secret>
 *
 * $ npm install # one time to install dependencies
 * $ npm start
 *
 * Documentation and resources:
 *
 *  Direqt Messaging API Documentation: https://docs.direqt.ai/messaging-api
 *  Ngrok Documentation: https://ngrok.com/docs
 */

import { DireqtApi } from 'direqt';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const accessToken: string = process.env.DIREQT_ACCESS_TOKEN as string;
const signingSecret: string = process.env.DIREQT_SIGNING_SECRET as string;
if (!accessToken || !signingSecret) {
    throw new Error('Missing DIREQT_ACCESS_TOKEN or DIREQT_SIGNING_SECRET');
}

const direqt = new DireqtApi({
    accessToken,
    signingSecret,
});

const app = express();

const rawBodyExtractor = (req: Request, res: Response, buf: Buffer) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>req).rawBody = buf.toString();
};

app.post(
    '/webhook',
    express.json({ verify: rawBodyExtractor }),
    direqt.messaging.verifyMiddleware(),
    (req, res) => {
        const { userId, userMessage } = req.body;
        const text = userMessage.content?.text;
        if (text) {
            console.log(text);
            direqt.messaging.sendTextMessage(userId, text);
        }
        res.sendStatus(200);
    }
);

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
