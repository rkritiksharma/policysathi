
'use server'

import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { revalidatePath } from 'next/cache'

export async function getCompanies() {
    const { supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        return { data: [], error: error.message }
    }

    return { data, error: null }
}

export async function getCompaniesWithPolicyCount() {
    const { supabase, user } = await getAuthenticatedUser()

    const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true })

    if (error) return { data: [], error: error.message }

    // Get policy count per company for this agent
    const { data: policyCounts } = await supabase
        .from('policies')
        .select('company_id')
        .eq('agent_id', user.id)

    const countMap: Record<string, number> = {}
    policyCounts?.forEach((p: any) => {
        countMap[p.company_id] = (countMap[p.company_id] || 0) + 1
    })

    const companiesWithCount = companies?.map((c: any) => ({
        ...c,
        policy_count: countMap[c.id] || 0
    })) || []

    return { data: companiesWithCount, error: null }
}

export async function createCompany(formData: FormData) {
    const { supabase } = await getAuthenticatedUser()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const portal_url = formData.get('portal_url') as string
    const support_phone = formData.get('support_phone') as string
    const support_email = formData.get('support_email') as string

    const { error } = await supabase.from('companies').insert({
        name,
        type,
        portal_url,
        support_phone,
        support_email,
        created_at: new Date().toISOString()
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/companies')
    return { error: null }
}

export async function updateCompany(id: string, formData: FormData) {
    const { supabase } = await getAuthenticatedUser()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const portal_url = formData.get('portal_url') as string
    const support_phone = formData.get('support_phone') as string

    const { error } = await supabase.from('companies').update({
        name,
        type,
        portal_url: portal_url || null,
        support_phone: support_phone || null,
    }).eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/companies')
    return { error: null }
}

export async function deleteCompany(id: string) {
    const { supabase } = await getAuthenticatedUser()

    // Check if company has policies
    const { count } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', id)

    if (count && count > 0) {
        return { error: `Cannot delete: ${count} policies are linked to this company.` }
    }

    const { error } = await supabase.from('companies').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/companies')
    return { error: null }
}

export async function createCompanyInline(formData: FormData) {
    const { supabase } = await getAuthenticatedUser()

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const portal_url = formData.get('portal_url') as string
    const support_phone = formData.get('support_phone') as string
    const support_email = formData.get('support_email') as string

    if (!name) return { error: 'Company Name is required' }

    const { data, error } = await supabase.from('companies').insert({
        name,
        type: type || 'General',
        portal_url: portal_url || null,
        support_phone: support_phone || null,
        support_email: support_email || null,
        created_at: new Date().toISOString()
    }).select().single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/companies')
    revalidatePath('/policies/new')
    return { success: true, company: data }
}
