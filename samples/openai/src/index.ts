/**
 * Simple Direqt bot demonstrating integration with OpenAI.
 */

import { DireqtApi } from "direqt";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";


dotenv.config();
const app = express();

const rawBodyExtractor = (req: Request, res: Response, buf: Buffer) => {
  (<any>req).rawBody = buf.toString();
};

const accessToken: string = process.env.DIREQT_ACCESS_TOKEN as string;
const signingSecret: string = process.env.DIREQT_SIGNING_SECRET as string;
if (!accessToken || !signingSecret) {
  throw new Error("Missing DIREQT_ACCESS_TOKEN or DIREQT_SIGNING_SECRET");
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
 * This reads Direqt access token, signing secret, and the OpenAI key from the .env file.
 * The Direqt values should be retrieved from your bot's "Webhook" settings
 * page on the Direqt console.
 * 
 * Your OpenAI key should be under your personal api keys on your OpenAI profile
 */




 const chatResponse = 'You are a helpful assistant. You say hello';

 /**
  * This can be customized to your liking. It is the first message that the bot will send to the user.
  */



/**
 * Direqt messaging webhook.
 *
 * This is the endpoint that Direqt will call when a message is sent to the bot.
 *
 * It has simple logic to demonstrating sending text messages.
 *
 * Note the use of the verifyMiddleware() function to verify that the message
 * received originated from Direqt.
 */

app.post(
  "/",
  express.json({ verify: rawBodyExtractor }),
  direqt.messaging.verifyMiddleware(),
  async (req, res) => {
    const { userId, userMessage } = req.body;
    const text = userMessage.content?.text;
    const sendToOpenAi = await getOpenAIResponse(text);
    if (text) {
      console.log(text);
      direqt.messaging.sendTextMessage(userId, sendToOpenAi);
    }
    res.sendStatus(200);
  }
);



/**
 * These are the functions that get the responses from OpenAI, and returns it to be used in the messaging webhook.
 */


const getOpenAIResponse = async (prompt: string): Promise<string> => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: chatResponse },
      { role: "user", content: prompt },
    ],
    max_tokens: 1000,
    temperature: 1,
  });

  return response.data.choices[0].message?.content || '';
};



app.post("/", async ({ body: { prompt } }: Request, res: Response) => {
  const chatResponse = await getOpenAIResponse(prompt);

  return res.json({
    success: true,
    data: chatResponse,
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
