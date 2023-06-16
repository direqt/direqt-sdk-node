import axios from 'axios';
import {
    AgentContentMessage,
    AgentStatusMessage,
    Suggestion,
    WebhookConfig,
} from './message';
import { verifyMiddleware } from './verify';

export interface DireqtApiConfiguration {
    signingSecret: string;
    accessToken: string;
    _messagingApiRoot?: string;
}

export interface SendResponse {
    status: number;
    statusText: string;
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
    private readonly messagesPath = `/messages`;
    private readonly webhookPath = `/webhook`;

    constructor(private config: DireqtApiConfiguration) {
        if (config._messagingApiRoot) {
            this.apiRoot = config._messagingApiRoot;
        }
    }

    private get messagesUrl() {
        return `${this.apiRoot}${this.messagesPath}`;
    }

    private get webhookConfigUrl() {
        return `${this.apiRoot}${this.webhookPath}`;
    }

    private async send(body, headers): Promise<SendResponse> {
        try {
            const axiosResponse = await axios.post(this.messagesUrl, body, {
                headers,
            });

            return {
                status: axiosResponse.status,
                statusText: axiosResponse.statusText,
            };
        } catch (error) {
            throw new Error(
                JSON.stringify(
                    {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                    },
                    null,
                    5
                )
            );
        }
    }

    public async sendTextMessage(
        userId: string,
        text: string,
        suggestions?: Suggestion[]
    ): Promise<SendResponse> {
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

        return this.send(body, headers);
    }

    public async sendContentMessage(
        userId: string,
        contentMessage: AgentContentMessage
    ): Promise<SendResponse> {
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

        return this.send(body, headers);
    }

    public async sendStatusMessage(
        userId: string,
        statusMessage: AgentStatusMessage
    ): Promise<SendResponse> {
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

        return this.send(body, headers);
    }

    /**
     * Retrieve the webhook configuration for this bot.
     */
    public async getWebhookConfig(): Promise<WebhookConfig> {
        const headers = {
            Authorization: `bearer ${this.config.accessToken}`,
        };

        const { data: webhookConfig } = await axios.get(this.webhookConfigUrl, {
            headers,
        });

        return webhookConfig;
    }

    /**
     * Create or update the webhook configuration for this bot.
     *
     * @param webhookUrl The url at which you want to receive messages.
     * @param instanceId Optional identifier to include in every webhook message.
     */
    public async updateWebhookConfig(
        config: WebhookConfig
    ): Promise<WebhookConfig> {
        const body = {
            ...config,
        };

        const headers = {
            Authorization: `bearer ${this.config.accessToken}`,
        };

        const { data: webhookConfig } = await axios.patch(
            this.webhookConfigUrl,
            body,
            {
                headers,
            }
        );

        return webhookConfig;
    }

    /**
     * Delete the webhook configuration for this bot.
     *
     * Upon successful deletion, Direqt will no longer send messages to the
     * webhook previously registered with this bot.
     */
    public async deleteWebhookConfig(): Promise<void> {
        const headers = {
            Authorization: `bearer ${this.config.accessToken}`,
        };

        const { data } = await axios.delete(this.webhookConfigUrl, { headers });

        return data;
    }

    public verifyMiddleware() {
        return verifyMiddleware({ signingSecret: this.config.signingSecret });
    }
}
