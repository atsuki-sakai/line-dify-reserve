export class DifyService {
    private readonly apiUrl: string
    private readonly apiKey: string

    constructor() {
        const apiUrl = process.env.DIFY_API_URL
        const apiKey = process.env.DIFY_API_KEY

        if (!apiUrl || !apiKey) {
            throw new Error('Required Dify environment variables are not set')
        }

        this.apiUrl = apiUrl
        this.apiKey = apiKey
    }

    async sendMessage(message: string): Promise<string> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                "inputs": {
                    "message": message
                },
                "response_mode": "blocking",
                "user": "abc-123"
            })
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Dify API error details:', errorBody)
            throw new Error(`Dify API error: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data?.outputs?.output || 'No response from Dify'
    }
} 