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

    /**
     * Send a text message to the given user
     *
     * @throws {Error} when the send is unsuccessful
     * @param userId id of the recipient user
     * @param text text to send to the user
     * @param suggestions tapable responses for the client to accompany the message
     */
    public async sendTextMessage(
        userId: string,
        text: string,
        suggestions?: Suggestion[]
    ): Promise<void> {
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

        await axios.post(this.messagesUrl, body, {
            headers,
        });
    }

    /**
     * Send a message with content (rich card, carousel, etc.) to the given user
     *
     * @throws {Error} when the send is unsuccessful
     * @param userId id of the recipient user
     * @param contentMessage message to accompany the content sent to the user
     */
    public async sendContentMessage(
        userId: string,
        contentMessage: AgentContentMessage
    ): Promise<void> {
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

        await axios.post(this.messagesUrl, body, {
            headers,
        });
    }

    /**
     * send messaging status (read, typing, etc.) to the given user
     *
     * @throws {Error} when the send is unsuccessful
     * @param userId id of the recipient user
     * @param statusMessage object describing the type of status to send
     */
    public async sendStatusMessage(
        userId: string,
        statusMessage: AgentStatusMessage
    ): Promise<void> {
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

        await axios.post(this.messagesUrl, body, {
            headers,
        });
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
