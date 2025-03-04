import { NextResponse } from 'next/server'
import { LineService } from '@/services/line/LineService'
import { DifyService } from '@/services/dify/DifyService'
import { LineWebhookBody } from '@/services/line/types'

// OPTIONSメソッドを追加（CORSプリフライトリクエスト対応）: Vercelのデプロイ環境で必要
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Allow': 'POST, OPTIONS',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-line-signature',
        },
    })
}

// GETメソッドの定義
export async function GET() {
    return new NextResponse(null, {
        status: 405,
        headers: {
            'Allow': 'POST, OPTIONS'
        }
    })
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
        const destination = webhookData.destination
        console.log('webhookData', webhookData)
        
        await Promise.all(webhookData.events.map(async (event) => {
            if (event.type === 'message' && event.message.type === 'text') {
                try {

                    const lineProfile = await lineService.getProfile(event.source.userId)
                    const difyResponse = await difyService.sendMessage({
                        message: event.message.text ?? "",
                        lineId: event.source.userId,
                        name: lineProfile.displayName,
                        destination: destination
                    })
                    await lineService.replyMessage(event.replyToken, [{
                        type: 'text',
                        text: difyResponse
                    }]);

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