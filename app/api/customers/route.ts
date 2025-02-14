import { NextResponse } from 'next/server'
import { firestore } from '@/services/firistore/firestore'
import { CollectionName } from '@/services/firistore/types'

export async function GET() {
    try {
        const customersSnapshot = await firestore.collection(CollectionName.Customers).get()
        const customers = customersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

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