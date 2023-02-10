import axios from 'axios';
import { verifyMiddleware } from './verify';

export interface DireqtApiConfiguration {
    signingSecret: string;
    accessToken: string;
}

export class DireqtApi {
    private _messaging: DireqtMessagingApi;
    constructor(private config: DireqtApiConfiguration) {
        this._messaging = new DireqtMessagingApi(config);
    }

    public get messaging() {
        return this._messaging;
    }
}

export class DireqtMessagingApi {
    constructor(private config: DireqtApiConfiguration) {}

    public async sendTextMessage(userId: string, text: string) {
        const url = `https://gateway.direqt.io/agent/direqt/receiver`;

        const body = {
            userId,
            agentMessage: {
                messageType: 'content',
                content: {
                    contentType: 'text',
                    text,
                },
            },
        };

        const params = {
            access_token: this.config.accessToken,
        };

        return await axios.post(url, body, { params });
    }

    public verifyMiddleware() {
        return verifyMiddleware({ signingSecret: this.config.signingSecret });
    }
}
