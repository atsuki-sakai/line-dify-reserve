import { NextResponse } from 'next/server'
import { LineService } from '@/services/line/lineService'


export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const lineService = new LineService()
        const lineProfile = await lineService.getProfile(id)

        return NextResponse.json({
            lineId: lineProfile.userId,
            name: lineProfile.displayName,
            language: lineProfile.language
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to get line profile' }, { status: 500 })
    }
}
