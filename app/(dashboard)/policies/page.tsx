import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from 'lucide-react'
import { ExportButton } from '@/components/ExportButton'
import { getAllPoliciesForExport } from './actions'
import { PoliciesList } from "./_components/PoliciesList"
import { PolicyFiltersWrapper } from "./_components/PolicyFiltersWrapper"
import { MiniStatsSkeleton, ListSkeleton } from "@/components/SkeletonCards"

export default async function PoliciesPage(props: {
    searchParams: Promise<{ q?: string; page?: string; status?: string; company?: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams.q || ''
    const page = Number(searchParams.page) || 1
    const status = searchParams.status || 'all'
    const company = searchParams.company || 'all'
    const limit = 15

    return (
        <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto">
            {/* Header - Static Shell */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Policies</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage all insurance policies</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <ExportButton type="policies" getData={getAllPoliciesForExport.bind(null, { query, status, company_id: company })} />
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white shrink-0 shadow-sm">
                        <Link href="/policies/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Policy
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters - Partially Static Shell */}
            <div className="flex flex-col md:flex-row gap-3 items-center bg-white border border-gray-100 shadow-sm p-3 rounded-xl">
                <form className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        name="q"
                        type="text"
                        placeholder="Search policy no., vehicle, customer..."
                        defaultValue={query}
                        className="pl-9 h-9 bg-gray-50 border-gray-200 text-sm"
                    />
                </form>
                <div className="flex gap-2 flex-wrap">
                    <Suspense fallback={<div className="h-9 w-32 bg-slate-50 animate-pulse rounded-lg" />}>
                        <PolicyFiltersWrapper initialStatus={status} initialCompanyId={company} />
                    </Suspense>
                </div>
            </div>

            {/* Content List - Streamed with Mini Stats */}
            <Suspense fallback={
                <div className="space-y-4">
                    <MiniStatsSkeleton />
                    <ListSkeleton />
                </div>
            }>
                <PoliciesList query={query} page={page} limit={limit} status={status} company={company} />
            </Suspense>
        </div>
    )
}
