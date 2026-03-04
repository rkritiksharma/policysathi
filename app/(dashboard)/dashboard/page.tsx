import { Suspense } from 'react'
import { AutomationButton } from "@/components/AutomationButton"
import { DashboardFilter } from "@/components/DashboardFilter"
import { BirthdayReminders } from "@/components/BirthdayReminders"
import { StatsSection } from "./_components/StatsSection"
import { ChartsSection } from "./_components/ChartsSection"
import { InsightsSection } from "./_components/InsightsSection"
import { TablesSection } from "./_components/TablesSection"
import { AlertBanner } from "./_components/AlertBanner"
import { StatsSkeleton, ChartSkeleton, InsightsSkeleton, TableSkeleton } from "@/components/SkeletonCards"

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ days?: string; range?: string }> }) {
    const params = await searchParams
    const daysFilter = params.days ? parseInt(params.days) : 30
    const chartRange = params.range || '6M'

    return (
        <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[1600px] mx-auto px-4 md:px-0 pb-20 md:pb-6">

            <Suspense fallback={null}>
                <AlertBanner />
            </Suspense>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Sabhi insights aur metrics ek hi jagah par.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                    <AutomationButton />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs md:text-sm font-medium text-gray-600 truncate">Filter Renewals:</span>
                        <DashboardFilter />
                    </div>
                </div>
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <StatsSection />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Suspense fallback={<ChartSkeleton />}>
                        <ChartsSection range={chartRange} />
                    </Suspense>
                </div>

                <div className="space-y-6">
                    <Suspense fallback={<div className="h-64 bg-slate-100/50 animate-pulse rounded-[2rem]" />}>
                        <BirthdayReminders />
                    </Suspense>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Smart Insights</h2>
                    <p className="text-sm text-slate-500 font-medium">Data-driven analysis for your agency.</p>
                </div>
                <Suspense fallback={<InsightsSkeleton />}>
                    <InsightsSection />
                </Suspense>
            </div>

            <div className="pt-4">
                <Suspense fallback={<TableSkeleton />}>
                    <TablesSection daysFilter={daysFilter} />
                </Suspense>
            </div>
        </div>
    )
}
