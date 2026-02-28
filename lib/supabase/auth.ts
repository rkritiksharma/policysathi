'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Returns authenticated Supabase client + user.
 * Throws if not authenticated — use in every server action.
 */
export async function getAuthenticatedUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    return { supabase, user }
}
