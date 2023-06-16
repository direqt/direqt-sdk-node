"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DireqtMessagingApi = exports.DireqtApi = void 0;
const axios_1 = __importDefault(require("axios"));
const verify_1 = require("./verify");
class DireqtApi {
    constructor(config) {
        this.config = config;
        this._messaging = new DireqtMessagingApi(config);
    }
    get messaging() {
        return this._messaging;
    }
}
exports.DireqtApi = DireqtApi;
class DireqtMessagingApi {
    constructor(config) {
        this.config = config;
        this.apiRoot = `https://gateway.direqt.io/v3`;
        this.messagesPath = `/messages`;
        this.webhookPath = `/webhook`;
        if (config._messagingApiRoot) {
            this.apiRoot = config._messagingApiRoot;
        }
    }
    get messagesUrl() {
        return `${this.apiRoot}${this.messagesPath}`;
    }
    get webhookConfigUrl() {
        return `${this.apiRoot}${this.webhookPath}`;
    }
    sendTextMessage(userId, text, suggestions) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (suggestions) {
                body.agentMessage.content.suggestions = suggestions;
            }
            const headers = {
                Authorization: `bearer ${this.config.accessToken}`,
            };
            return yield axios_1.default.post(this.messagesUrl, body, { headers });
        });
    }
    sendContentMessage(userId, contentMessage) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield axios_1.default.post(this.messagesUrl, body, { headers });
        });
    }
    sendStatusMessage(userId, statusMessage) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield axios_1.default.post(this.messagesUrl, body, { headers });
        });
    }
    /**
     * Retrieve the webhook configuration for this bot.
     */
    getWebhookConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `bearer ${this.config.accessToken}`,
            };
            const { data: webhookConfig } = yield axios_1.default.get(this.webhookConfigUrl, {
                headers,
            });
            return webhookConfig;
        });
    }
    /**
     * Create or update the webhook configuration for this bot.
     *
     * @param webhookUrl The url at which you want to receive messages.
     * @param instanceId Optional identifier to include in every webhook message.
     */
    updateWebhookConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = Object.assign({}, config);
            const headers = {
                Authorization: `bearer ${this.config.accessToken}`,
            };
            const { data: webhookConfig } = yield axios_1.default.patch(this.webhookConfigUrl, body, {
                headers,
            });
            return webhookConfig;
        });
    }
    /**
     * Delete the webhook configuration for this bot.
     *
     * Upon successful deletion, Direqt will no longer send messages to the
     * webhook previously registered with this bot.
     */
    deleteWebhookConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `bearer ${this.config.accessToken}`,
            };
            const { data } = yield axios_1.default.delete(this.webhookConfigUrl, { headers });
            return data;
        });
    }
    verifyMiddleware() {
        return (0, verify_1.verifyMiddleware)({ signingSecret: this.config.signingSecret });
    }
}
exports.DireqtMessagingApi = DireqtMessagingApi;
