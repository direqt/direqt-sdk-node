"use strict";
/**
 * Simple Direqt echo bot.
 *
 * This sample demonstrates how to connect your chatbot to Direqt to send and
 * receive messages.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //! we need to have this! 
const direqt_1 = require("direqt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//! Don't forget to add your access token and signing secret to your .env file
const accessToken = process.env.DIREQT_ACCESS_TOKEN;
const signingSecret = process.env.DIREQT_SIGNING_SECRET;
if (!accessToken || !signingSecret) {
    throw new Error('Missing DIREQT_ACCESS_TOKEN or DIREQT_SIGNING_SECRET');
}
const direqt = new direqt_1.DireqtApi({
    accessToken,
    signingSecret,
});
const app = (0, express_1.default)();
const rawBodyExtractor = (req, res, buf) => {
    req.rawBody = buf.toString();
};
app.use('/webhook', express_1.default.json({ verify: rawBodyExtractor }), direqt.messaging.verifyMiddleware(), (req, res) => {
    var _a;
    const { userId, userMessage } = req.body;
    const text = (_a = userMessage.content) === null || _a === void 0 ? void 0 : _a.text;
    if (text) {
        console.log(text);
        direqt.messaging.sendTextMessage(userId, text);
    }
    res.sendStatus(200);
});
app.listen(3000, () => {
    console.log('Listening on port 3000');
});
