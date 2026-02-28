'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { ActionResult } from '@/types'

export async function updateProfile(formData: FormData): Promise<ActionResult> {
    const { supabase, user } = await getAuthenticatedUser()

    const name = formData.get('name') as string
    const agency_name = formData.get('agency_name') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const irda_code = formData.get('irda_code') as string

    const { error } = await supabase
        .from('agents')
        .update({
            name,
            agency_name,
            phone,
            address,
            irda_code,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        console.error('Profile update error:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/profile')
    return { data: 'Profile updated successfully' }
}
