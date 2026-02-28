
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { Customer } from '@/types'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { getFormString } from '@/lib/utils'

// Customer CRUD Operations
export async function getCustomers(
    query: string = '',
    page: number = 1,
    limit: number = 10,
    filters?: { city?: string; tag?: string }
) {
    const { supabase, user } = await getAuthenticatedUser()


    let queryBuilder = supabase
        .from('customers')
        .select('*, policies(count)', { count: 'exact' })
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

    if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%,customer_code.ilike.%${query}%`)
    }

    if (filters?.city) {
        queryBuilder = queryBuilder.ilike('city', `%${filters.city}%`)
    }

    if (filters?.tag) {
        queryBuilder = queryBuilder.contains('tags', [filters.tag])
    }

    const { data, count, error } = await queryBuilder

    // Transform data to match UI expected shape (map policies count to total_policies)
    const transformedData = data?.map(c => ({
        ...c,
        total_policies: c.policies?.[0]?.count || 0
    })) || []

    return { data: transformedData, count: count || 0, error }
}

export async function createCustomer(formData: FormData) {
    const { supabase, user } = await getAuthenticatedUser()

    const name = getFormString(formData, 'name')
    const phone = getFormString(formData, 'phone')
    const email = getFormString(formData, 'email')
    const city = getFormString(formData, 'city')
    const dob = getFormString(formData, 'date_of_birth') || getFormString(formData, 'dob')

    if (!name || !phone) {
        throw new Error('Name and Phone are required')
    }

    // Check for existing customer (robust check)
    const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('agent_id', user.id)
        .eq('phone', phone)
        .limit(1)

    if (existingCustomers && existingCustomers.length > 0) {
        throw new Error('Customer with this phone number already exists.')
    }

    const { error } = await supabase.from('customers').insert({
        name,
        phone: phone, // Correct column name
        email,
        city,
        date_of_birth: dob || null,
        agent_id: user.id
    })

    if (error) {
        console.error('Error creating customer:', error)
        throw new Error('Failed to create customer')
    }

    revalidatePath('/customers')
    redirect('/customers')
}

export async function deleteCustomer(id: string) {
    const { supabase, user } = await getAuthenticatedUser()


    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('agent_id', user.id)

    if (error) {
        console.error('Error deleting customer:', error)
        throw new Error('Failed to delete customer')
    }

    revalidatePath('/customers')
}

export async function updateCustomer(id: string, formData: FormData) {
    const { supabase, user } = await getAuthenticatedUser()

    const name = getFormString(formData, 'name')
    const phone = getFormString(formData, 'phone')
    const email = getFormString(formData, 'email')
    const city = getFormString(formData, 'city')
    const dob = getFormString(formData, 'date_of_birth') || getFormString(formData, 'dob')

    if (!name || !phone) throw new Error('Name and Phone are required')

    // Check duplicate phone (excluding current customer)
    const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('agent_id', user.id)
        .eq('phone', phone)
        .neq('id', id)
        .limit(1)

    if (existing && existing.length > 0) {
        throw new Error('Another customer with this phone number already exists.')
    }

    const { error } = await supabase
        .from('customers')
        .update({
            name,
            phone,
            email,
            city,
            date_of_birth: dob || null,
        })
        .eq('id', id)
        .eq('agent_id', user.id)

    if (error) {
        console.error('Error updating customer:', error)
        throw new Error('Failed to update customer')
    }

    revalidatePath('/customers')
    revalidatePath(`/customers/${id}`)
    redirect('/customers')
}

export const getCustomerById = cache(async (id: string) => {
    const { supabase, user } = await getAuthenticatedUser()


    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .eq('agent_id', user.id)
        .single()

    if (error) {
        console.error('getCustomerById Error:', error)
        return {
            data: null,
            error,
        }
    }

    return { data, error }
})

export async function getCustomerPolicies(customerId: string) {
    const { supabase, user } = await getAuthenticatedUser()

    const { data } = await supabase
        .from('policies')
        .select(`
            *,
            companies (name)
        `)
        .eq('customer_id', customerId)
        .eq('agent_id', user.id)
        .order('expiry_date', { ascending: true })

    return data?.map(p => ({
        id: p.id,
        policy_number: p.policy_number,
        company: p.companies?.name || 'Unknown',
        type: p.policy_type,
        vehicle_reg: p.vehicle_reg_no || 'N/A',
        expiry: p.expiry_date,
        premium: p.premium_total || 0,
        status: p.status,
        pdf_url: p.pdf_url
    })) || []
}



export async function getAllCustomersForExport() {
    const { supabase, user } = await getAuthenticatedUser()

    const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export async function createCustomerInline(formData: FormData) {
    try {
        const { supabase, user } = await getAuthenticatedUser()

        const name = getFormString(formData, 'name')
        const phone = getFormString(formData, 'phone')
        const email = getFormString(formData, 'email')
        const city = getFormString(formData, 'city')

        if (!name || !phone) {
            return { error: 'Name and Phone are required' }
        }

        // Check for existing customer
        const { data: existingCustomers } = await supabase
            .from('customers')
            .select('id')
            .eq('agent_id', user.id)
            .eq('phone', phone)
            .limit(1)

        if (existingCustomers && existingCustomers.length > 0) {
            return { error: 'Customer with this phone number already exists.' }
        }

        const { data, error } = await supabase.from('customers').insert({
            name,
            phone,
            email: email || null,
            city: city || null,
            agent_id: user.id
        }).select().single()

        if (error) {
            console.error('Error creating customer inline:', error)
            return { error: 'Failed to create customer' }
        }

        revalidatePath('/customers')
        revalidatePath('/policies/new')
        return { success: true, customer: data }
    } catch (err: any) {
        return { error: err.message || 'An error occurred' }
    }
}
