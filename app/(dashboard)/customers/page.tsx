
import Link from 'next/link'
import { getCustomers, getAllCustomersForExport } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from '@/components/ExportButton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Search, ArrowUpRight, Upload } from 'lucide-react'
import { ClickableRow } from '@/components/ClickableRow'
import { CustomerActions } from "@/components/CustomerActions"
import { EmptyState } from "@/components/EmptyState"
import { CustomerBadge } from "@/components/CustomerBadge"
import { Pagination } from "@/components/Pagination"

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
    const limit = 10

    const { data: customers, count } = await getCustomers(query, page, limit, { city, tag })
    const totalPages = Math.ceil(count / limit)

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">All Customers</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage your client base and view their details</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/customers/import">
                                <Upload className="mr-2 h-4 w-4" /> Import
                            </Link>
                        </Button>
                        <ExportButton type="customers" getData={getAllCustomersForExport} />
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white shrink-0">
                            <Link href="/customers/new">
                                <Plus className="mr-2 h-4 w-4" /> Add Customer
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <Search className="h-5 w-5 text-gray-400" />
                <form className="flex-1">
                    <Input
                        name="q"
                        type="text"
                        placeholder="Search by name, phone, email, or customer ID (e.g. 0115)..."
                        defaultValue={query}
                        className="border-0 shadow-none focus-visible:ring-0 h-10 text-base placeholder:text-gray-400"
                    />
                </form>
                {query && (
                    <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-gray-600">
                        <Link href="/customers">Clear</Link>
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/80">
                            <TableRow>
                                <TableHead className="w-[50px] font-semibold text-gray-700">Avatar</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Name</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Contact</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">City</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 whitespace-nowrap">Policies</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700 whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="p-0 border-0">
                                        <div className="py-12">
                                            <EmptyState
                                                icon={Search}
                                                title="No customers found"
                                                description="Try adjusting your search or add a new customer."
                                                actionLabel="Add Customer"
                                                actionHref="/customers/new"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers?.map((customer) => (
                                    <ClickableRow key={customer.id} href={`/customers/${customer.id}`} className="hover:bg-gray-50/80 transition-colors border-b last:border-0 border-gray-100">
                                        <TableCell>
                                            <div className="h-9 w-9 border border-gray-200 rounded-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                                                {customer.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-900 whitespace-nowrap">{customer.name}</span>
                                                <CustomerBadge code={customer.customer_code} />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900 whitespace-nowrap">{customer.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 whitespace-nowrap">{customer.city || '-'}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                                                {customer.total_policies || 0} Policies
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomerActions id={customer.id} />
                                            </div>
                                        </TableCell>
                                    </ClickableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="border-t border-gray-100 bg-gray-50/30">
                        <Pagination totalPages={totalPages} />
                    </div>
                )}
            </div>

            <div className="text-xs text-gray-400 text-center">
                Showing {customers?.length} of {count} results
            </div>
        </div>
    )
}
