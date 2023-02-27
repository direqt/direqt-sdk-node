/**
 * Simple Direqt echo bot.
 *
 * This sample demonstrates how to connect your chatbot to Direqt to send and
 * receive messages.
 */
import express from 'express';
//import { DireqtApi } from 'direqt';
import { DireqtApi } from '../../src';

const direqt = new DireqtApi({
    accessToken: '',
    signingSecret: '',
});

const app = express();

const rawBodyExtractor = (req, res, buf) => {
    req.rawBody = buf.toString();
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
