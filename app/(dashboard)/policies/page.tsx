import Link from 'next/link'
import { getPolicies, getAllPoliciesForExport } from './actions'
import { getWhatsAppUrl } from '@/lib/utils'
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
import { Plus, Search, Filter, MessageCircle, Eye, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { PolicyActions } from '@/components/PolicyActions'
import { EmptyState } from '@/components/EmptyState'
import { ClickableRow } from '@/components/ClickableRow'

import { PolicyFilters } from '@/components/PolicyFilters'
import { getCompanies } from '../companies/actions'
import { Pagination } from '@/components/Pagination'

export default async function PoliciesPage(props: {
    searchParams: Promise<{ q?: string; page?: string; status?: string; company?: string }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams.q || ''
    const page = Number(searchParams.page) || 1
    const status = searchParams.status || 'all'
    const company = searchParams.company || 'all'
    const limit = 10

    const [{ data: policies, count }, { data: companies }] = await Promise.all([
        getPolicies({ query, page, limit, status, company_id: company }),
        getCompanies()
    ])

    const totalPages = Math.ceil(count / limit)

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Policies</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage all insurance policies</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton type="policies" getData={getAllPoliciesForExport.bind(null, { query, status, company_id: company })} />
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white shrink-0">
                        <Link href="/policies/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Policy
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-lg border">
                <form className="flex-1 w-full md:w-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        name="q"
                        type="text"
                        placeholder="Search policy, vehicle, customer..."
                        defaultValue={query}
                        className="pl-9 h-9 bg-white"
                    />
                </form>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <PolicyFilters
                        initialStatus={status}
                        initialCompanyId={company}
                        companies={companies || []}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/80">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Policy Number</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Customer</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Company</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Vehicle</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Expiry</TableHead>
                                <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Status</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700 whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {policies?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="p-0 border-0">
                                        <div className="py-12">
                                            <EmptyState
                                                icon={Search}
                                                title="No policies found"
                                                description="Try adjusting your filters or add a new policy."
                                                actionLabel="Add Policy"
                                                actionHref="/policies/new"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                policies?.map((policy) => {
                                    const customer = Array.isArray(policy.customers) ? policy.customers[0] : policy.customers
                                    // Handle premium (database uses premium_total)
                                    const premium = policy.premium_total || policy.premium || 0

                                    return (
                                        <ClickableRow key={policy.id} href={`/policies/${policy.id}`} className="hover:bg-gray-50/80 transition-colors border-b last:border-0 border-gray-100">
                                            <TableCell className="font-medium text-gray-900 font-mono text-xs whitespace-nowrap">
                                                {policy.policy_number}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700 whitespace-nowrap">
                                                {customer?.id ? (
                                                    <Link href={`/customers/${customer.id}`} className="hover:underline hover:text-primary">
                                                        {customer.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400">{customer?.name || 'Unknown'}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-600 whitespace-nowrap">{policy.companies?.name}</TableCell>
                                            <TableCell className="text-gray-600 font-mono text-xs uppercase whitespace-nowrap">{policy.vehicle_reg_no || '-'}</TableCell>
                                            <TableCell className="text-gray-700 font-medium whitespace-nowrap">
                                                {format(new Date(policy.expiry_date), 'dd MMM yyyy')}
                                            </TableCell>
                                            <TableCell className="text-gray-900 font-medium whitespace-nowrap">₹{premium.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={policy.status === 'Active' ? 'default' : 'destructive'} className={policy.status === 'Active' ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none" : "bg-red-100 text-red-700 shadow-none"}>
                                                    {policy.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-1 items-center">
                                                    <a
                                                        href={getWhatsAppUrl(customer?.phone, `Namaste *${customer?.name || 'Customer'}*, your policy *${policy.policy_number}* is expiring on *${format(new Date(policy.expiry_date), 'dd MMM yyyy')}*. Please pay *₹${premium.toLocaleString()}* to renew instantly. - PolicySathi`)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Send WhatsApp Reminder"
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-green-200 bg-transparent hover:bg-green-50 text-green-600 h-8 w-8 p-0"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                    </a>
                                                    <PolicyActions
                                                        id={policy.id}
                                                        pdf_url={policy.pdf_url}
                                                        customerPhone={customer?.phone}
                                                        policyNumber={policy.policy_number}
                                                    />
                                                </div>
                                            </TableCell>
                                        </ClickableRow>
                                    )
                                })
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
                Showing {policies?.length} of {count} results
            </div>
        </div>
    )
}
