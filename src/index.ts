import axios from 'axios';
import { AgentContentMessage, AgentStatusMessage, Suggestion } from './message';
import { verifyMiddleware } from './verify';

export interface DireqtApiConfiguration {
    signingSecret: string;
    accessToken: string;
    _messagingApiRoot?: string;
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
    private readonly apiRoot: string = `https://gateway.direqt.io`;
    private readonly path = `/agent/direqt/receiver`;

    constructor(private config: DireqtApiConfiguration) {
        if (config._messagingApiRoot) {
            this.apiRoot = config._messagingApiRoot;
        }
    }

    private get url() {
        return `${this.apiRoot}${this.path}`;
    }

    public async sendTextMessage(
        userId: string,
        text: string,
        suggestions?: Suggestion[]
    ) {
        const body = {
            userId,
            agentMessage: {
                messageType: 'content',
                content: {
                    contentType: 'text',
                    text,
                } as AgentContentMessage,
            },
        };

        if (suggestions) {
            body.agentMessage.content.suggestions = suggestions;
        }

        const params = {
            access_token: this.config.accessToken,
        };

        return await axios.post(this.url, body, { params });
    }

    public async sendContentMessage(
        userId: string,
        contentMessage: AgentContentMessage
    ) {
        const body = {
            userId,
            agentMessage: {
                messageType: 'content',
                content: contentMessage,
            },
        };

        const params = {
            access_token: this.config.accessToken,
        };

        return await axios.post(this.url, body, { params });
    }

    public async sendStatusMessage(
        userId: string,
        statusMessage: AgentStatusMessage
    ) {
        const body = {
            userId,
            agentMessage: {
                messageType: 'status',
                status: statusMessage,
            },
        };

        const params = {
            access_token: this.config.accessToken,
        };

        return await axios.post(this.url, body, { params });
    }

    public verifyMiddleware() {
        return verifyMiddleware({ signingSecret: this.config.signingSecret });
    }
}
