import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Upload } from 'lucide-react'
import { ExportButton } from '@/components/ExportButton'
import { getAllCustomersForExport } from './actions'
import { CustomersList } from "./_components/CustomersList"
import { ListSkeleton } from "@/components/SkeletonCards"

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; city?: string; tag?: string }>
}) {
    const params = await searchParams
    const query = params.q || ''
    const page = Number(params.page) || 1
    const city = params.city
    const tag = params.tag
    const limit = 15

    return (
        <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto">
            {/* Header - Static Shell */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Customers</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Manage your client network
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
                    <Button variant="outline" asChild className="border-gray-200 text-gray-600 shadow-none">
                        <Link href="/customers/import">
                            <Upload className="mr-2 h-4 w-4" /> Import
                        </Link>
                    </Button>
                    <ExportButton type="customers" getData={getAllCustomersForExport} />
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white shrink-0 shadow-sm">
                        <Link href="/customers/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Customer
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Search Bar - Static Shell */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-3 rounded-xl">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
                <form className="flex-1">
                    <Input
                        name="q"
                        type="text"
                        placeholder="Search by name, phone, email, or ID..."
                        defaultValue={query}
                        className="border-0 shadow-none focus-visible:ring-0 h-9 text-sm placeholder:text-gray-400 bg-transparent"
                    />
                </form>
                {query && (
                    <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-gray-600 text-xs h-7">
                        <Link href="/customers">Clear</Link>
                    </Button>
                )}
            </div>

            {/* Content List - Streamed */}
            <Suspense fallback={<ListSkeleton />}>
                <CustomersList query={query} page={page} limit={limit} city={city} tag={tag} />
            </Suspense>
        </div>
    )
}
