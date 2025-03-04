import { NextResponse } from 'next/server'

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params
    return NextResponse.json({ message: `reservations api ${id}` })
}