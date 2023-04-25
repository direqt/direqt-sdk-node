/**
 * Demonstrate webhook configuration APIs
 */
import dotenv from 'dotenv';
import { DireqtApi } from '../../src';

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

async function main() {
    const original = await direqt.messaging.getWebhookConfig();
    console.log('original config: ', original);

    const deleted = await direqt.messaging.deleteWebhookConfig();
    console.log('deleted config: ', deleted);

    const updated = await direqt.messaging.updateWebhookConfig({
        webhookUrl: 'https://www.example.com/webhook',
    });
    console.log('updated config: ', updated);

    if (original.webhookUrl) {
        const restored = await direqt.messaging.updateWebhookConfig(original);
        console.log('restored config: ', restored);
    }
}

main()
    .then(() => {
        console.log('Done');
    })
    .catch(err => {
        console.error(err.response?.body || err);
    });
