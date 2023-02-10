## Direqt Node.js Library
------------

The Direqt Node.js library provides access to the messaging capabilities supported by the Direqt platform.

> :warning: **This library is meant for server-side usage only.** Do not use it in client-side (browser) code, as it would expose your secret access token.

### Installation

$ npm install direqt

### Usage

The library needs to be configured with your chatbot's secret access token and signing secret, which are available in the [Direqt Developer Console](https://console.direqt.io). Here's an example of initializing the library:

```typescript
import { DireqtApi } from '@direqt/direqt-sdk-node';
const direqt = new DireqtApi({
    accessToken: YOUR_ACCESS_TOKEN,
    signingSecret: YOUR_SIGNING_SECRET
})
```

### Receiving messages from users

Your chatbot is notified of messages from users via a webhook. The provide the URL of your webhook in the "Webhook" settings associated with your chatbot in the Direqt Developer console.

Webhooks are invoked with a simple POST request, giving you access to information about the sender and their message. Here's a simple webhook that captures the text sent by a user and writes it to the console:

```typescript
function myDireqtWebhook(req: Request, res: Response) {
    const { userId, userMessage } = req.body;
    const text = userMessage.content?.text;
    if (text) {
        console.log(`${userId}: ${text}`);
        /* process the message here */
    }
    res.sendStatus(200);
}
```

(Note that there are other types of messages that may be delivered to your webhook, but simple messaging apps seldom need to deal with them. We suggest you implement your webhook like the example above, and ignore any message without `userMessage.content.text` defined.)

Before you process messages directed at your webhook, you should verify the request signature associated with the request to be sure it originated from Direqt. You can do this with the `verifyMiddleware` provided by the DireqtApi object:

```typescript
const app = express();

// the raw request body is required for signature verification
const rawBodyExtractor = (req, res, buf) => {
    req.rawBody = buf.toString();
};
app.post('/webhook', 
    express.json({ verify: rawBodyExtractor }),
    direqt.messaging.verifyMiddleware(),
    myDireqtWebhook
    );
```

### Sending messages

To send a message to a user, provide the `userId` (the same value you obtained when the user sent a message to your webhook) and the text to send to the `sendTextMessage` method:

```typescript
const result = await direqt.messaging.sendTextMessage(
    userId, 'Hello from my chatbot!');
```

### Sample code

See the [./samples/echobot/](samples/echobot/) folder for a complete working example.



Copyright (c) 2023 Direqt Inc.
