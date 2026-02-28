'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns authenticated Supabase client + user.
 * Throws if not authenticated — use in every server action.
 * Cached per request lifecycle so Promise.all won't spam Supabase with 5 identical auth requests.
 */
export const getAuthenticatedUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Fetch basic profile details to avoid multiple round-trips later
    const { data: agent } = await supabase
        .from('agents')
        .select('name, agency_name, role')
        .eq('id', user.id)
        .single()

    return {
        supabase,
        user: {
            ...user,
            name: agent?.name || user.user_metadata?.name || 'Agent',
            agency_name: agent?.agency_name,
            role: agent?.role
        }
    }
})
