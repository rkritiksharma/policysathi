import Link from 'next/link'
import { getCustomers } from "../actions"
import { Phone, MessageCircle, MapPin, FileText, Users2, Search } from 'lucide-react'
import { ClickableDiv } from '@/components/ClickableDiv'
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

export async function CustomersList({ query, page, limit, city, tag }: { query: string, page: number, limit: number, city?: string, tag?: string }) {
    const { data: customers, count } = await getCustomers(query, page, limit, { city, tag })
    const totalPages = Math.ceil(count / limit)

    if (!customers || customers.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16">
                <EmptyState icon={Users2} title="No customers found" description="Try adjusting your search or add a new customer." actionLabel="Add Customer" actionHref="/customers/new" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                {customers.map((customer, index) => (
                    <ClickableDiv
                        key={customer.id}
                        href={`/customers/${customer.id}`}
                        className="group bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-primary/20 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <AvatarCircle name={customer.name} index={(page - 1) * limit + index} />
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
                            <div className="hidden sm:block flex-shrink-0">
                                <PolicyCountBadge count={customer.total_policies || 0} />
                            </div>
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
                    </ClickableDiv>
                ))}
            </div>

            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">Showing {customers.length} of {count} customers</span>
                {totalPages > 1 && <Pagination totalPages={totalPages} />}
            </div>
        </div>
    )
}
