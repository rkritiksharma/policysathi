import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local from project root
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedData() {
    const targetEmail = 'gptsharehub@gmail.com'
    console.log(`🚀 Seeding dummy data for ${targetEmail}...`)

    // 1. Find the Agent
    const { data: agents, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .eq('email', targetEmail)

    if (agentError) {
        console.error('❌ Error fetching agent:', agentError.message)
        return
    }

    if (!agents || agents.length === 0) {
        console.error(`❌ Agent not found for email: ${targetEmail}. Please sign up first.`)
        return
    }

    const agentId = agents[0].id
    console.log(`✅ Found agent ID: ${agentId}`)

    // 2. Insert Dummy Companies (if they don't exist)
    const sampleCompanies = [
        { name: 'HDFC ERGO', type: 'General' },
        { name: 'ICICI Lombard', type: 'General' },
        { name: 'Star Health', type: 'Health' },
        { name: 'LIC of India', type: 'Life' },
        { name: 'Tata AIG', type: 'General' }
    ]

    console.log('📦 Ensuring sample companies exist...')
    const { data: companies, error: companyError } = await supabase
        .from('companies')
        .upsert(sampleCompanies, { onConflict: 'name' })
        .select()

    if (companyError) {
        console.error('❌ Error inserting companies:', companyError.message)
        return
    }
    console.log(`✅ Companies ready: ${companies.length}`)

    // 3. Insert Dummy Customers
    const sampleCustomers = [
        { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', city: 'Delhi', agent_id: agentId },
        { name: 'Priya Singh', email: 'priya@example.com', phone: '9988776655', city: 'Mumbai', agent_id: agentId },
        { name: 'Amit Sharma', email: 'amit@example.com', phone: '9123456789', city: 'Bangalore', agent_id: agentId },
        { name: 'Suman Devi', email: 'suman@example.com', phone: '8877665544', city: 'Jaipur', agent_id: agentId },
        { name: 'Vikram Patel', email: 'vikram@example.com', phone: '7766554433', city: 'Ahmedabad', agent_id: agentId }
    ]

    console.log('👥 Inserting sample customers...')
    const { data: customers, error: customerError } = await supabase
        .from('customers')
        .insert(sampleCustomers)
        .select()

    if (customerError) {
        console.error('❌ Error inserting customers:', customerError.message)
        return
    }
    console.log(`✅ Customers inserted: ${customers.length}`)

    // 4. Insert Dummy Policies
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())

    const samplePolicies = customers.map((customer, index) => {
        const company = companies[index % companies.length]
        const types = ['Car', 'Bike', 'Health', 'Life']
        const type = types[index % types.length]

        return {
            agent_id: agentId,
            customer_id: customer.id,
            company_id: company.id,
            policy_number: `POL-${1000 + index}`,
            policy_type: type,
            status: index === 4 ? 'Expired' : 'Active',
            premium_total: 5000 + (index * 1500),
            issue_date: lastMonth.toISOString().split('T')[0],
            start_date: lastMonth.toISOString().split('T')[0],
            expiry_date: index === 0 ? nextMonth.toISOString().split('T')[0] : nextYear.toISOString().split('T')[0]
        }
    })

    console.log('📄 Inserting sample policies...')
    const { error: policyError } = await supabase
        .from('policies')
        .insert(samplePolicies)

    if (policyError) {
        console.error('❌ Error inserting policies:', policyError.message)
        return
    }

    console.log('✅ All dummy data seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Customers: ${customers.length}`)
    console.log(`- Policies: ${samplePolicies.length}`)
    console.log(`- Companies Checked: ${companies.length}`)
}

seedData().catch(err => {
    console.error('💥 Fatal Error:', err)
    process.exit(1)
})
