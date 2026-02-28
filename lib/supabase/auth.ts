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
    // Reverting to getUser to satisfy Next.js/Supabase security warnings.
    // Exploring connection pooling/caching to optimize this instead.
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    return { supabase, user }
})
