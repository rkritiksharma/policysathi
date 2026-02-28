import Link from 'next/link'
import { getPolicies, getAllPoliciesForExport } from '../policies/actions'
import { Policy } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { format, differenceInDays, addDays } from 'date-fns'
import { FileSpreadsheet, Clock, AlertTriangle, XCircle, Car, Bike, MessageCircle, CheckCircle2 } from 'lucide-react'
import { ReportDateFilter } from '@/components/ReportDateFilter'
import { ExportButton } from '@/components/ExportButton'
import { getWhatsAppUrl, cn } from '@/lib/utils'

function ExpiryBadge({ expiryDate, status }: { expiryDate: string; status: string }) {
    const days = differenceInDays(new Date(expiryDate), new Date())
    if (status !== 'Active') {
        return <span className="text-xs font-semibold text-red-600">{Math.abs(days)}d overdue</span>
    }
    if (days <= 7) return <span className="flex items-center gap-1 text-xs font-bold text-red-600"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />{days}d left!</span>
    if (days <= 30) return <span className="flex items-center gap-1 text-xs font-semibold text-amber-600"><Clock className="h-3 w-3" />{days}d left</span>
    return <span className="text-xs text-gray-400">{days}d left</span>
}

function PolicyRow({ policy }: { policy: Policy }) {
    const customer = Array.isArray(policy.customers) ? policy.customers[0] : policy.customers
    const premium = (policy as any).premium_total || (policy as any).premium || 0
    const isExpired = policy.status === 'Expired'
    const days = policy.expiry_date ? differenceInDays(new Date(policy.expiry_date), new Date()) : null
    const isUrgent = policy.status === 'Active' && days !== null && days <= 7
    const isDueSoon = policy.status === 'Active' && days !== null && days > 7 && days <= 30

    return (
        <div className={cn(
            "group relative flex items-center gap-4 px-4 py-3.5 bg-white border rounded-xl transition-all duration-200 hover:shadow-md overflow-hidden",
            isUrgent ? "border-red-200 bg-red-50/30" : isDueSoon ? "border-amber-200 bg-amber-50/20" : isExpired ? "border-gray-100" : "border-gray-100"
        )}>
            {/* Left accent */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                isUrgent ? "bg-red-400" : isDueSoon ? "bg-amber-400" : isExpired ? "bg-gray-300" : "bg-green-400"
            )} />

            {/* Icon */}
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ml-2",
                (policy as any).policy_type === 'Two Wheeler' ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"
            )}>
                {(policy as any).policy_type === 'Two Wheeler' ? <Bike className="h-4 w-4" /> : <Car className="h-4 w-4" />}
            </div>

            {/* Policy number + vehicle */}
            <div className="min-w-0 w-32 flex-shrink-0">
                <div className="text-xs font-mono font-bold text-gray-900 truncate">{policy.policy_number}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide truncate">{(policy as any).vehicle_reg_no || '—'}</div>
            </div>

            {/* Customer + Company */}
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">{customer?.name || '—'}</div>
                <div className="text-xs text-gray-400 truncate">{policy.companies?.name}</div>
            </div>

            {/* Expiry */}
            <div className="hidden sm:block flex-shrink-0 text-right w-28">
                <div className="text-xs font-semibold text-gray-700">{policy.expiry_date ? format(new Date(policy.expiry_date), 'dd MMM yyyy') : '—'}</div>
                {policy.expiry_date && <ExpiryBadge expiryDate={policy.expiry_date} status={policy.status} />}
            </div>

            {/* Premium */}
            <div className="hidden md:block flex-shrink-0 w-20 text-right">
                <div className="text-sm font-bold text-gray-900">₹{premium.toLocaleString()}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {customer?.phone && (
                    <a
                        href={getWhatsAppUrl(customer.phone, `Namaste *${customer.name || 'Customer'}*, your policy *${policy.policy_number}* ${isExpired ? `expired on *${policy.expiry_date ? format(new Date(policy.expiry_date), 'dd MMM yyyy') : ''}*. Please renew now` : `is expiring on *${policy.expiry_date ? format(new Date(policy.expiry_date), 'dd MMM yyyy') : ''}*. Please renew`}. - PolicySathi`)}
                        target="_blank" rel="noopener noreferrer"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                )}
                <Link
                    href={`/policies/${policy.id}`}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    )
}

function PolicyList({ policies, emptyMsg }: { policies: Policy[]; emptyMsg: string }) {
    if (!policies || policies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-10 w-10 text-green-300 mb-3" />
                <p className="text-gray-400 font-medium">{emptyMsg}</p>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-2">
            {policies.map(p => <PolicyRow key={p.id} policy={p} />)}
        </div>
    )
}

export default async function ReportsPage(props: {
    searchParams: Promise<{ days?: string, from?: string, to?: string }>
}) {
    const searchParams = await props.searchParams
    const days = Number(searchParams.days) || 30
    const fromDate = searchParams.from
    const toDate = searchParams.to

    const upcomingQuery = fromDate && toDate
        ? { fromDate, toDate }
        : { fromDate: new Date().toISOString().split('T')[0], expiry_days: days }

    const exportQuery = fromDate && toDate
        ? { fromDate, toDate }
        : { fromDate: new Date().toISOString().split('T')[0], toDate: addDays(new Date(), days).toISOString().split('T')[0] }

    const [{ data: upcoming }, { data: overdue }, { data: expired }] = await Promise.all([
        getPolicies({ ...upcomingQuery, limit: 50, status: 'Active' }),
        getPolicies({ is_overdue: true, limit: 50 }),
        getPolicies({ status: 'Expired', limit: 50 })
    ])

    return (
        <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Reports</h1>
                    <p className="text-sm text-gray-500 font-medium">Business insights and operational lists</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <ReportDateFilter />
                    <ExportButton type="policies" getData={getAllPoliciesForExport.bind(null, exportQuery)} />
                </div>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                        <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-serif text-amber-800">{upcoming?.length || 0}</div>
                        <div className="text-xs text-amber-600 font-medium">Upcoming</div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50/40 border border-red-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-serif text-red-800">{overdue?.length || 0}</div>
                        <div className="text-xs text-red-600 font-medium">Overdue</div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-slate-50/40 border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <XCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold font-serif text-gray-700">{expired?.length || 0}</div>
                        <div className="text-xs text-gray-500 font-medium">Expired</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="bg-gray-100/80 p-1 rounded-xl border border-gray-200 mb-4">
                    <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-700 font-medium text-sm px-4">
                        ⏰ Upcoming ({upcoming?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 font-medium text-sm px-4">
                        ⚠️ Overdue ({overdue?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="expired" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-700 font-medium text-sm px-4">
                        ❌ Expired ({expired?.length || 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="m-0">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            {fromDate && toDate ? `${fromDate} → ${toDate}` : `Next ${days} days`}
                        </p>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">{upcoming?.length || 0} policies</span>
                    </div>
                    <PolicyList policies={upcoming || []} emptyMsg="No upcoming renewals in this period. Great!" />
                </TabsContent>

                <TabsContent value="overdue" className="m-0">
                    <div className="mb-3">
                        <p className="text-xs text-gray-400">Policies past their expiry date that need immediate follow-up</p>
                    </div>
                    <PolicyList policies={overdue || []} emptyMsg="No overdue policies. All caught up!" />
                </TabsContent>

                <TabsContent value="expired" className="m-0">
                    <div className="mb-3">
                        <p className="text-xs text-gray-400">Policies that are no longer active (Expired / Lapsed)</p>
                    </div>
                    <PolicyList policies={expired || []} emptyMsg="No expired policies found." />
                </TabsContent>
            </Tabs>
        </div>
    )
}
