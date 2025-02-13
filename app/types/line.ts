export type LineMessageEvent = {
    type: string
    message: {
        type: string
        id: string
        text?: string
    }
    replyToken: string
    source: {
        type: string
        userId: string
        groupId?: string
        roomId?: string
    }
    timestamp: number
}

export type LineWebhookBody = {
    destination: string
    events: LineMessageEvent[]
}

export type LineMessage = {
    type: string
    text: string
} 