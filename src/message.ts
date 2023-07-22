export interface AgentContentMessage {
    contentType: 'text' | 'card' | 'carousel' | 'file';
    text?: string;
    card?: Card;
    carousel?: Carousel;
    file?: File;
    suggestions?: Suggestion[];
    menu?: { suggestions: Suggestion[] };
}

export interface Card {
    title: string;
    description?: string;
    mediaUrl?: string;
    suggestions?: Suggestion[];
}

export interface Carousel {
    cards: Card[];
}

export interface File {
    url: string;
}

export interface Suggestion {
    suggestionType: 'dial' | 'openUrl' | 'reply';
    text: string;
    context?: string;
    dial?: {
        phoneNumber: string;
    };
    openUrl?: {
        uri: string;
    };
    reply?: void;
    style?: {
        backgroundColor?: string; // hex color code e.g. #FFFFFF
        textColor?: string; // hex color code e.g. #000000
    };
}

export interface AgentStatusMessage {
    statusType: 'typing' | 'read';
    relatedMessageId?: string;
}

export interface WebhookConfig {
    webhookUrl: string;
    instanceId?: string;
}
