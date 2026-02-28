
import { getCustomerById } from '../actions'
import { createClient } from '@/lib/supabase/server'

export default async function DebugCustomerPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let customerResult = null
    let allCustomers = null

    if (searchParams.id) {
        customerResult = await getCustomerById(searchParams.id)
    }

    const { data: customers } = await supabase.from('customers').select('id, name, agent_id').limit(50)
    allCustomers = customers

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Customer Debug Page</h1>

            <div className="mb-8 p-4 bg-gray-100 rounded">
                <h2 className="font-bold">Current User</h2>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>

            {searchParams.id && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h2 className="font-bold">getCustomerById Result (ID: {searchParams.id})</h2>
                    <pre>{JSON.stringify(customerResult, null, 2)}</pre>
                </div>
            )}

            <div className="p-4 bg-gray-50 border rounded">
                <h2 className="font-bold">All Customers (First 50)</h2>
                <pre>{JSON.stringify(allCustomers, null, 2)}</pre>
            </div>
        </div>
    )
}
