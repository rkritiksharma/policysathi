
import { createClient } from '@/lib/supabase/server'

export default async function WhoAmIPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="p-10 font-mono">
            <h1 className="text-2xl font-bold mb-4">Who Am I?</h1>
            {user ? (
                <div className="bg-green-100 p-4 rounded border border-green-300 text-green-800">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            ) : (
                <div className="bg-red-100 p-4 rounded border border-red-300 text-red-800">
                    Not Authenticated
                </div>
            )}
        </div>
    )
}
