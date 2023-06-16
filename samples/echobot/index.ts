/**
 * Simple Direqt echo bot.
 *
 * This sample demonstrates how to connect your chatbot to Direqt to send and
 * receive messages.
 */


import express , { Request, Response } from 'express' //! we need to have this! 
import { DireqtApi } from 'direqt';
import dotenv from 'dotenv';
dotenv.config();


//! Don't forget to add your access token and signing secret to your .env file


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
    (<any> req).rawBody = buf.toString();
};
app.use(
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
