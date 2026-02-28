import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get additional agent details if needed, or just return user metadata
    const { data: agent } = await supabase
        .from('agents')
        .select('name, email, agency_name, role')
        .eq('id', user.id)
        .single()

    return NextResponse.json({
        id: user.id,
        email: user.email,
        name: agent?.name || user.user_metadata?.name || 'Agent',
        agency_name: agent?.agency_name,
        role: agent?.role
    })
}
