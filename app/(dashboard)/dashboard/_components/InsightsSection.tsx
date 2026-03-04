import { getCustomerInsights } from "../actions"
import { InsightsGrid } from "@/components/InsightsGrid"

export async function InsightsSection() {
    const insights = await getCustomerInsights()

    return (
        <InsightsGrid
            marketShare={insights.marketShare}
            topCustomers={insights.topCustomers}
            missedRenewals={insights.missedRenewals}
            growth={insights.growth}
        />
    )
}
