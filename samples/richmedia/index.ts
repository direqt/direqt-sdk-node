/**
 * Simple Direqt bot demonstrating rich media.
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
 * - save your changes
 * - Navigate back to the "Webhook" settings page, and copy the access token
 * and signing secret from the bottom of the page.
 *
 * Back on your development machine:
 *
 * - create a .env file in this directory with the following contents:
 *  DIREQT_ACCESS_TOKEN=<your bot's access token>
 *  DIREQT_SIGNING_SECRET=<your bot's signing secret>
 *
 *  $ npm install && npm start
 */
import { DireqtApi } from 'direqt';
import { AgentContentMessage, Suggestion } from 'direqt/lib/message';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';

/**
 * Read access token and signing secret from the .env file.
 *
 * These values should be retrieved from your bot's "Webhook" settings
 * page on the Direqt console.
 */
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

/**
 * Image-related middleware.
 *
 * Because this test app is intended to be run on localhost, using ngrok to
 * expose it to the internet, we need to dynamically determine the image root
 * URL.
 *
 * This wouldn't be necessary in a production bot.
 */
let imageRoot: string;
const captureImageRootMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const hostname = req.headers.host;
    const protocol = req.protocol;
    imageRoot = `${protocol}://${hostname}`;
    next();
};

app.use(express.static('public'));
app.use(captureImageRootMiddleware);

/**
 * Direqt messaging webhook.
 *
 * This is the endpoint that Direqt will call when a message is sent to the bot.
 *
 * It has simple logic to demonstrating sending text messages (with quick-reply
 * suggestions), cards, and carousels.
 *
 * Note the use of the verifyMiddleware() function to verify that the message
 * received originated from Direqt.
 */
app.post(
    '/',
    express.json({
        verify: (req: Request, res: Response, buf: Buffer) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((<any>req)['rawBody'] = buf.toString()),
    }),
    direqt.messaging.verifyMiddleware(),
    async (req, res) => {
        const { userId, userMessage } = req.body;
        const text = userMessage.content?.text;
        if (text) {
            console.log(`${userId}: ${text}`);

            switch (text) {
                case 'card':
                    {
                        const message: AgentContentMessage = {
                            contentType: 'card',
                            card: {
                                title: 'Card title',
                                description:
                                    'Card description goes here. It can be quite long.',
                                mediaUrl: `${imageRoot}/1.png`,
                            },
                        };

                        await direqt.messaging.sendContentMessage(
                            userId,
                            message
                        );
                    }
                    break;
                case 'carousel':
                    {
                        const message: AgentContentMessage = {
                            contentType: 'carousel',
                            carousel: {
                                cards: [
                                    {
                                        title: 'First card',
                                        description: 'I am a description',
                                        mediaUrl: `${imageRoot}/1.png`,
                                    },
                                    {
                                        title: 'Second card',
                                        description: 'I am another description',
                                        mediaUrl: `${imageRoot}/2.png`,
                                    },
                                    {
                                        title: 'Third card',
                                        description: 'I am another description',
                                        mediaUrl: `${imageRoot}/3.png`,
                                    },
                                ],
                            },
                        };
                        await direqt.messaging.sendContentMessage(
                            userId,
                            message
                        );
                    }
                    break;
                default: {
                    const message = `You said: ${text}`;
                    const suggestions: Suggestion[] = [
                        {
                            suggestionType: 'reply',
                            text: 'card',
                        },
                        {
                            suggestionType: 'reply',
                            text: 'carousel',
                        },
                    ];
                    await direqt.messaging.sendTextMessage(
                        userId,
                        message,
                        suggestions
                    );
                    break;
                }
            }
        }

        res.send('OK');
    }
);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
