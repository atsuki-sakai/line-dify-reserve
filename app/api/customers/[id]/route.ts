import { NextResponse } from 'next/server'
import { firestore } from '@/services/firistore/firestore'
import type { Customer } from '@/services/firistore/types'
import { CollectionName } from '@/services/firistore/types'
import { LineService } from '@/services/line/lineService'

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        console.log("params; ", id)

        const lineService = new LineService()
        const lineProfile = await lineService.getProfile(id)
        console.log("lineProfile; ", lineProfile)
        
        const docRef = await firestore.collection(CollectionName.Customers).doc(id).get()
        if (!docRef.exists) {
            return NextResponse.json({ 
                id: "",
                name: "",
                destination: "",
                phone: ""
            })
        }
        return NextResponse.json({ 
                id: docRef.id,
                ...docRef.data()
        })

    } catch (e) {
        console.error('Firestore error:', e)
        return NextResponse.json({ 
            id: "",
            name: "",
            destination: "",
            phone: ""
        })
    }
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
        await firestore.collection(CollectionName.Customers).doc(lineId).set({ 
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
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const data: Partial<Customer> = await request.json()
        await firestore.collection(CollectionName.Customers).doc(id).update(data)
        
        return NextResponse.json({ 
            success: true,
            message: 'Customer updated successfully'
        })

    } catch (error) {
        console.error('Firestore error:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to update customer' 
        }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        await firestore.collection(CollectionName.Customers).doc(id).delete()
        
        return NextResponse.json({ 
            success: true,
            message: 'Customer deleted successfully'
        })

    } catch (error) {
        console.error('Firestore error:', error)
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to delete customer' 
        }, { status: 500 })
    }
} 