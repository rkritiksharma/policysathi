'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CustomerImportData = {
    name: string
    phone?: string
    email?: string
    address?: string
    city?: string
    dob?: string
    anniversary?: string
    tags?: string
}

export async function importCustomers(customers: CustomerImportData[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Format data for insertion
    const records = customers.map(customer => ({
        agent_id: user.id,
        name: customer.name,
        phone: customer.phone || null,
        email: customer.email || null,
        address: customer.address || null,
        city: customer.city || null,
        dob: customer.dob ? new Date(customer.dob).toISOString() : null,
        anniversary: customer.anniversary ? new Date(customer.anniversary).toISOString() : null,
        tags: customer.tags ? customer.tags.split(',').map(t => t.trim()) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
        .from('customers')
        .insert(records)

    if (error) {
        console.error('Import error:', error)
        return { error: 'Failed to import customers. Please check your data format.' }
    }

    revalidatePath('/customers')
    return { success: `Successfully imported ${records.length} customers` }
}
