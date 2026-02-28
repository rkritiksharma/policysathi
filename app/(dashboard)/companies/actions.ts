
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCompanies() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        return { data: [], error: error.message }
    }

    return { data, error: null }
}

export async function createCompany(formData: FormData) {
    const supabase = await createClient()

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
