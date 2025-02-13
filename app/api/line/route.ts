import { NextResponse } from 'next/server'
import { LineService } from '@/services/lineService'
import { DifyService } from '@/services/difyService'
import { LineWebhookBody } from '@/types/line'

// GETメソッドも定義して405エラーを防ぐ
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    )
}

// POSTメソッドの処理
export async function POST(request: Request) {
    const lineService = new LineService()
    const difyService = new DifyService()

    try {
        const body = await request.text()
        
        const signature = request.headers.get('x-line-signature')
        if (!lineService.verifySignature(body, signature)) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        const webhookData = JSON.parse(body) as LineWebhookBody
        console.log('webhookData', webhookData)
        
        await Promise.all(webhookData.events.map(async (event) => {
            if (event.type === 'message' && event.message.type === 'text') {
                try {
                    console.log('Processing message:', {
                        type: event.message.type,
                        text: event.message.text,
                        userId: event.source.userId,
                        timestamp: new Date(event.timestamp).toISOString()
                    })

                    const difyResponse = await difyService.sendMessage(event.message.text || '')
                    
                    await lineService.replyMessage(event.replyToken, [{
                        type: 'text',
                        text: difyResponse
                    }])

                    console.log('Reply sent successfully')
                } catch (error) {
                    console.error('Error processing message:', error)
                    await lineService.replyMessage(event.replyToken, [{
                        type: 'text',
                        text: 'すみません、メッセージの処理中にエラーが発生しました。'
                    }])
                }
            }
        }))

        return NextResponse.json({ message: 'OK' }, { status: 200 })

    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}