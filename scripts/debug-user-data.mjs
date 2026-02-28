// Debug script to check user authentication and data visibility
// Run this to see what user is logged in and what data they can see

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugUserData() {
    console.log('🔍 Debugging User Data Visibility\n')

    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
        console.error('❌ Session Error:', sessionError.message)
        return
    }

    if (!session) {
        console.log('⚠️  No active session - user not logged in')
        return
    }

    console.log('✅ User Session Found:')
    console.log('   Email:', session.user.email)
    console.log('   User ID:', session.user.id)
    console.log('   Created:', new Date(session.user.created_at).toLocaleString())
    console.log('')

    // Check customers data
    const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, name, email, created_at')
        .limit(5)

    if (customersError) {
        console.error('❌ Customers Error:', customersError.message)
        console.log('   This might be due to RLS policies')
    } else {
        console.log(`✅ Customers Found: ${customers?.length || 0}`)
        if (customers && customers.length > 0) {
            console.log('   Sample:', customers[0].name)
        }
    }
    console.log('')

    // Check policies data
    const { data: policies, error: policiesError } = await supabase
        .from('policies')
        .select('id, policy_number, created_at')
        .limit(5)

    if (policiesError) {
        console.error('❌ Policies Error:', policiesError.message)
        console.log('   This might be due to RLS policies')
    } else {
        console.log(`✅ Policies Found: ${policies?.length || 0}`)
        if (policies && policies.length > 0) {
            console.log('   Sample:', policies[0].policy_number)
        }
    }
    console.log('')

    // Check if RLS is enabled
    console.log('💡 Troubleshooting Tips:')
    console.log('   1. Check if Row Level Security (RLS) is enabled on tables')
    console.log('   2. Verify RLS policies allow access for authenticated users')
    console.log('   3. Ensure user_id columns match the authenticated user ID')
    console.log('   4. Check if data was created with a different user_id')
}

debugUserData().catch(console.error)
