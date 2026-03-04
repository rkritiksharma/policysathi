import Link from 'next/link'
import { getPolicies } from "../actions"
import { cn, getWhatsAppUrl } from '@/lib/utils'
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Car, Bike, Shield, Clock, CheckCircle2 } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { PolicyActions } from '@/components/PolicyActions'
import { EmptyState } from '@/components/EmptyState'
import { Pagination } from '@/components/Pagination'
import { ClickableDiv } from '@/components/ClickableDiv'
import { Search } from 'lucide-react'

// Re-using the helper functions from the original page
function ExpiryBadge({ expiryDate, status }: { expiryDate: string; status: string }) {
    const days = differenceInDays(new Date(expiryDate), new Date())

    if (status === 'Renewed') {
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100"><CheckCircle2 className="h-3 w-3" /> Renewed</span>
    }
    if (status === 'Expired' || days < 0) {
        return (
            <div>
                <div className="text-xs font-bold text-red-600">{format(new Date(expiryDate), 'dd MMM yyyy')}</div>
                <div className="text-xs text-red-500 font-medium">{Math.abs(days)}d overdue</div>
            </div>
        )
    }
    if (days <= 7) {
        return (
            <div>
                <div className="text-xs font-bold text-red-600">{format(new Date(expiryDate), 'dd MMM yyyy')}</div>
                <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse inline-block" /><span className="text-xs text-red-500 font-semibold">{days}d left!</span></div>
            </div>
        )
    }
    if (days <= 30) {
        return (
            <div>
                <div className="text-xs font-bold text-amber-700">{format(new Date(expiryDate), 'dd MMM yyyy')}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /><span className="text-xs text-amber-600 font-semibold">{days}d left</span></div>
            </div>
        )
    }
    return (
        <div>
            <div className="text-xs font-semibold text-gray-700">{format(new Date(expiryDate), 'dd MMM yyyy')}</div>
            <div className="text-xs text-gray-400">{days}d left</div>
        </div>
    )
}

function StatusDot({ status }: { status: string }) {
    const map: Record<string, { dot: string; label: string; bg: string; text: string }> = {
        Active: { dot: 'bg-green-500 animate-pulse', label: 'Active', bg: 'bg-green-50', text: 'text-green-700' },
        Expired: { dot: 'bg-red-500', label: 'Expired', bg: 'bg-red-50', text: 'text-red-700' },
        Renewed: { dot: 'bg-blue-500', label: 'Renewed', bg: 'bg-blue-50', text: 'text-blue-700' },
        Cancelled: { dot: 'bg-gray-400', label: 'Cancelled', bg: 'bg-gray-50', text: 'text-gray-600' },
    }
    const s = map[status] || map['Cancelled']
    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", s.bg, s.text, "border-current/20")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
            {s.label}
        </span>
    )
}

function RowAccent({ status, expiryDate }: { status: string; expiryDate: string }) {
    const days = differenceInDays(new Date(expiryDate), new Date())
    if (status === 'Active' && days <= 7) return <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-xl" />
    if (status === 'Active' && days <= 30) return <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-xl" />
    if (status === 'Active') return <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-xl" />
    if (status === 'Expired') return <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-300 rounded-l-xl" />
    return <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-l-xl" />
}

export async function PoliciesList({ query, page, limit, status, company }: { query: string, page: number, limit: number, status: string, company: string }) {
    const { data: policies, count } = await getPolicies({ query, page, limit, status, company_id: company })
    const totalPages = Math.ceil(count / limit)

    if (!policies || policies.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16">
                <EmptyState icon={Search} title="No policies found" description="Try adjusting your filters or add a new policy." actionLabel="Add Policy" actionHref="/policies/new" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Mini Stats could be here or separate, lets keep them together for streaming */}
            <PolicyMiniStats policies={policies} />

            <div className="flex flex-col gap-2">
                {policies.map((policy) => {
                    const customer = Array.isArray(policy.customers) ? policy.customers[0] : policy.customers
                    const premium = policy.premium_total || (policy as any).premium || 0
                    const days = differenceInDays(new Date(policy.expiry_date), new Date())
                    const isUrgent = policy.status === 'Active' && days <= 7
                    const isDueSoon = policy.status === 'Active' && days > 7 && days <= 30

                    return (
                        <ClickableDiv
                            key={policy.id}
                            href={`/policies/${policy.id}`}
                            className={cn(
                                "group flex items-center bg-white border rounded-xl px-4 py-3.5 hover:shadow-md transition-all duration-200 overflow-hidden relative",
                                isUrgent ? "border-red-200 bg-red-50/30" : isDueSoon ? "border-amber-200 bg-amber-50/20" : "border-gray-100"
                            )}
                        >
                            <RowAccent status={policy.status} expiryDate={policy.expiry_date} />
                            <div className="pl-3 flex items-center gap-4 w-full">
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                    policy.policy_type === 'Two Wheeler' ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
                                )}>
                                    {policy.policy_type === 'Two Wheeler' ? <Bike className="h-5 w-5" /> : <Car className="h-5 w-5" />}
                                </div>
                                <div className="min-w-0 w-36 flex-shrink-0">
                                    <div className="text-xs font-mono font-bold text-gray-900 truncate">{policy.policy_number}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wide truncate">{policy.vehicle_reg_no || '—'}</div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold text-gray-800 truncate">{customer?.name || '—'}</div>
                                    <div className="text-xs text-gray-400 truncate">{(policy.companies as any)?.name}</div>
                                </div>
                                <div className="hidden sm:block flex-shrink-0 w-28 text-right">
                                    <ExpiryBadge expiryDate={policy.expiry_date} status={policy.status} />
                                </div>
                                <div className="hidden md:block flex-shrink-0 w-24 text-right">
                                    <div className="text-sm font-bold text-gray-900">₹{premium.toLocaleString()}</div>
                                    <div className="text-xs text-gray-400">premium</div>
                                </div>
                                <div className="hidden sm:block flex-shrink-0">
                                    <StatusDot status={policy.status} />
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 relative z-10">
                                    <a
                                        href={getWhatsAppUrl(customer?.phone, `Namaste *${customer?.name || 'Customer'}*, your policy *${policy.policy_number}* is expiring on *${format(new Date(policy.expiry_date), 'dd MMM yyyy')}*. Please pay *₹${premium.toLocaleString()}* to renew. - PolicySathi`)}
                                        target="_blank" rel="noopener noreferrer"
                                        title="Send WhatsApp"
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                    >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                    </a>
                                    <PolicyActions id={policy.id} pdf_url={policy.pdf_url} customerPhone={customer?.phone} policyNumber={policy.policy_number} />
                                </div>
                            </div>
                        </ClickableDiv>
                    )
                })}
            </div>

            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">Showing {policies.length} of {count} policies</span>
                {totalPages > 1 && <Pagination totalPages={totalPages} />}
            </div>
        </div>
    )
}

function PolicyMiniStats({ policies }: { policies: any[] }) {
    const active = policies.filter(p => p.status === 'Active').length
    const expired = policies.filter(p => p.status === 'Expired').length
    const dueSoon = policies.filter(p => {
        if (p.status !== 'Active') return false
        return differenceInDays(new Date(p.expiry_date), new Date()) <= 30
    }).length

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                    <div className="text-lg font-bold text-green-800">{active}</div>
                    <div className="text-xs text-green-600 font-medium">Active</div>
                </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                    <div className="text-lg font-bold text-amber-800">{dueSoon}</div>
                    <div className="text-xs text-amber-600 font-medium">Due in 30d</div>
                </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <Clock className="h-4 w-4 text-red-500" />
                <div>
                    <div className="text-lg font-bold text-red-800">{expired}</div>
                    <div className="text-xs text-red-600 font-medium">Expired</div>
                </div>
            </div>
        </div>
    )
}
