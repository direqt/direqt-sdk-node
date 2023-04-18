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
    private readonly apiRoot: string = `https://gateway.direqt.io/v3`;
    private readonly path = `/messages`;

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

        const headers = {
            Authorization: `bearer ${this.config.accessToken}`,
        };

        return await axios.post(this.url, body, { headers });
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

        const headers = {
            Authorization: `bearer ${this.config.accessToken}`,
        };

        return await axios.post(this.url, body, { headers });
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

        const headers = {
            Authorization: `bearer ${this.config.accessToken}`,
        };

        return await axios.post(this.url, body, { headers });
    }

    public verifyMiddleware() {
        return verifyMiddleware({ signingSecret: this.config.signingSecret });
    }
}
