import { getRevenueStats } from "../actions"
import { DashboardCharts } from "@/components/DashboardCharts"
import { ChartFilter } from "@/components/ChartFilter"

export async function ChartsSection({ range }: { range: string }) {
    const revenueStats = await getRevenueStats(range)

    return (
        <div className="relative">
            <div className="absolute top-6 right-6 z-10 hidden sm:block">
                <ChartFilter />
            </div>
            <DashboardCharts
                revenueData={revenueStats.monthlyData || []}
                policyDistribution={revenueStats.policyDistribution || []}
            />
        </div>
    )
}
