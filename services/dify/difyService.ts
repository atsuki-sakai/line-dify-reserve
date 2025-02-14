export class DifyService {
    private readonly apiUrl: string
    private readonly apiKey: string

    constructor() {
        const apiUrl = process.env.DIFY_CHAT_MESSAGE_API_URL
        const apiKey = process.env.DIFY_CHAT_MESSAGE_API_KEY

        if (!apiUrl || !apiKey) {
            throw new Error('Required Dify environment variables are not set')
        }

        this.apiUrl = apiUrl
        this.apiKey = apiKey
    }
    async sendMessage({
        message,
        lineId,
        name,
        destination
    }: {
        message: string,
        lineId: string,
        name: string,
        destination: string
    }): Promise<string> {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    inputs: {
                        lineId,
                        name,
                        destination
                    },
                    query: message,
                    response_mode: "blocking",
                    user: lineId  // userIdをlineIdに変更
                })
            });

            if (!response.ok) {
                const errorBody = await response.text()
                console.error('Dify API error details:', errorBody)
                console.error('Request body:', {
                    inputs: { lineId, name, destination },
                    query: message,
                    user: lineId
                })
                throw new Error(`Dify API error: ${response.statusText}`)
            }

            const data = await response.json()
            console.log("Dify response:", data)
            return data.answer || 'No response from Dify'
        } catch (error) {
            console.error('Dify service error:', error)
            throw error
        }
    }
}