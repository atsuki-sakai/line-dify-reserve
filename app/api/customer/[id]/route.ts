import { NextResponse } from 'next/server'
import { firestore } from '@/services/firistore/firestore'
import { LineService } from '@/services/line/lineService'

import type { ICustomer } from '@/services/firistore/types/cutomer'

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
        
        // const docRef = await firestore.collection(CollectionName.Customers).doc(id).get()

        const customer = await firestore.customer.get(id)
        if (!customer) {
            return NextResponse.json({ 
                id: "",
                name: "",
                destination: "",
                phone: ""
            })
        }
        return NextResponse.json(customer)

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
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const data: Partial<ICustomer> = await request.json()
        await firestore.customer.update(id, data)
        
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
        await firestore.customer.delete(id)
        
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