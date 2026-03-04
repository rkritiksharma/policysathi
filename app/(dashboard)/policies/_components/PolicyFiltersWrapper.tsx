import { getCompanies } from "../../companies/actions"
import { PolicyFilters } from "@/components/PolicyFilters"

export async function PolicyFiltersWrapper({ initialStatus, initialCompanyId }: { initialStatus: string, initialCompanyId: string }) {
    const { data: companies } = await getCompanies()

    return <PolicyFilters initialStatus={initialStatus} initialCompanyId={initialCompanyId} companies={companies || []} />
}
