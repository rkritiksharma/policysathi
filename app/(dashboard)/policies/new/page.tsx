
import { getCompanies } from '../../companies/actions'
import { getCustomers } from '../../customers/actions'
import { getPolicyById } from '../actions'
import { Button } from "@/components/ui/button"
import { PolicyFormWrapper } from '@/components/PolicyFormWrapper'

export default async function NewPolicyPage(props: { searchParams: Promise<{ renew?: string }> }) {
    const searchParams = await props.searchParams;
    // Fetch data for dropdowns
    const { data: companies } = await getCompanies()
    const { data: customers } = await getCustomers('', 1, 100)

    let initialData = null
    if (searchParams.renew) {
        const { data } = await getPolicyById(searchParams.renew)
        if (data) {
            initialData = data
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {initialData ? `Renew Policy: ${initialData.policy_number}` : 'Add New Policy'}
                </h1>
                <Button variant="outline" type="button" asChild>
                    <a href="/policies">Cancel</a>
                </Button>
            </div>

            <PolicyFormWrapper
                customers={customers || []}
                companies={companies || []}
                initialData={initialData}
            />
        </div>
    )
}

