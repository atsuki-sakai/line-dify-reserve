import { NextResponse } from 'next/server'
import { firestore } from '@/services/firistore/firestore'

export async function GET() {
    try {
        const customers = await firestore.customer.getAll()

        console.log('Fetched customers:', customers)

        return NextResponse.json({ 
            success: true,
            data: customers 
        })

    } catch (error) {
        console.error('Firestore error:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch customers' 
        }, { status: 500 })
    }
}