// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Configuration\n')
console.log('URL:', supabaseUrl)
console.log('Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...')
console.log('')

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    try {
        // Test 1: Check if we can connect
        console.log('Test 1: Testing connection...')
        const { data, error } = await supabase.from('agents').select('count').limit(1)

        if (error) {
            console.error('❌ Connection failed:', error.message)
        } else {
            console.log('✅ Connection successful!')
        }

        // Test 2: Try to sign up a test user
        console.log('\nTest 2: Testing signup...')
        const testEmail = `test-${Date.now()}@example.com`
        const testPassword = 'test123456'

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
        })

        if (signupError) {
            console.error('❌ Signup failed:', signupError.message)
        } else {
            console.log('✅ Signup successful!')
            console.log('   User ID:', signupData.user?.id)
            console.log('   Email:', signupData.user?.email)
        }

        // Test 3: Check auth settings
        console.log('\nTest 3: Checking auth settings...')
        console.log('⚠️  Go to Supabase Dashboard → Authentication → Providers')
        console.log('   Make sure "Email" provider is enabled')
        console.log('   Check "Confirm email" setting')

    } catch (err) {
        console.error('❌ Error:', err)
    }
}

testConnection()
