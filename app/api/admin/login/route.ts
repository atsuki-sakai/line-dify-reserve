import { NextResponse } from 'next/server'
import { firestore } from '@/services/firistore/firestore'
export async function GET() {
    return NextResponse.json({ message: 'admins api' })
}


export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    try {   
        const { id: lineId } = await context.params
        let body;
        try {
            const bodyText = await request.text();
            body = JSON.parse(bodyText.replace(/\s+/g, ' ').trim());
            
        } catch (e) {
            console.error('Invalid JSON in request body:', e)
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid JSON in request body' 
            }, { status: 400 })
        }
        
        const { name, destination, phone } = body
        await firestore.customer.set({
            lineId,
            name,
            destination,
            phone
        });
        return NextResponse.json({ name, destination, phone })
    } catch (error) {
        console.error('Firestore error:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to create customer' 
        }, { status: 500 })
    }
}