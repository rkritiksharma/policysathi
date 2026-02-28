import Link from 'next/link'
import { getCustomers, getAllCustomersForExport } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from '@/components/ExportButton'
import { Plus, Search, Upload, Phone, MessageCircle, MapPin, FileText, Users2 } from 'lucide-react'
import { ClickableRow } from '@/components/ClickableRow'
import { CustomerActions } from "@/components/CustomerActions"
import { EmptyState } from "@/components/EmptyState"
import { Pagination } from "@/components/Pagination"
import { getWhatsAppUrl } from '@/lib/utils'

function AvatarCircle({ name, index }: { name: string; index: number }) {
    const colors = [
        'from-blue-400 to-indigo-500',
        'from-emerald-400 to-green-500',
        'from-amber-400 to-orange-500',
        'from-pink-400 to-rose-500',
        'from-violet-400 to-purple-500',
        'from-cyan-400 to-sky-500',
    ]
    const gradient = colors[index % colors.length]
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

    return (
        <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}>
            {initials}
        </div>
    )
}

function PolicyCountBadge({ count }: { count: number }) {
    if (count === 0) return <span className="text-xs text-gray-400">No policies</span>
    if (count >= 3) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100"><FileText className="h-3 w-3" />{count} Policies</span>
    return <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"><FileText className="h-3 w-3" />{count} {count === 1 ? 'Policy' : 'Policies'}</span>
}

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

    const { data: customers, count } = await getCustomers(query, page, limit, { city, tag })
    const totalPages = Math.ceil(count / limit)

    return (
        <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Customers</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        {count} clients in your network
                    </p>
                </div>
                <div className="flex items-center gap-2">
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

            {/* Search Bar */}
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

            {/* Customer Cards List */}
            {customers?.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16">
                    <EmptyState icon={Users2} title="No customers found" description="Try adjusting your search or add a new customer." actionLabel="Add Customer" actionHref="/customers/new" />
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {customers?.map((customer, index) => (
                        <ClickableRow
                            key={customer.id}
                            href={`/customers/${customer.id}`}
                            className="group bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-primary/20 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <AvatarCircle name={customer.name} index={(page - 1) * limit + index} />

                                {/* Name + Code */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-gray-900 truncate">{customer.name}</span>
                                        {customer.customer_code && (
                                            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                #{customer.customer_code}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                        {customer.phone && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Phone className="h-3 w-3" />{customer.phone}
                                            </span>
                                        )}
                                        {customer.city && (
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <MapPin className="h-3 w-3" />{customer.city}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Policy Count */}
                                <div className="hidden sm:block flex-shrink-0">
                                    <PolicyCountBadge count={customer.total_policies || 0} />
                                </div>

                                {/* Actions — visible on hover */}
                                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    {customer.phone && (
                                        <a
                                            href={getWhatsAppUrl(customer.phone, `Namaste *${customer.name}*! 👋 I'm from PolicySathi. How can I help you today?`)}
                                            target="_blank" rel="noopener noreferrer"
                                            title="WhatsApp"
                                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                        >
                                            <MessageCircle className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    <CustomerActions id={customer.id} />
                                </div>
                            </div>
                        </ClickableRow>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">Showing {customers?.length} of {count} customers</span>
                {totalPages > 1 && <Pagination totalPages={totalPages} />}
            </div>
        </div>
    )
}
