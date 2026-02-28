import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet, TrendingUp, AlertCircle, CheckCircle, Clock, IndianRupee, MessageCircle, Search, Phone, ChevronRight } from 'lucide-react'
import { getFilteredPayments, getPaymentStats } from './actions'
import { getWhatsAppUrl, cn } from '@/lib/utils'
import { RecordPaymentDialog } from '@/components/RecordPaymentDialog'
import Link from 'next/link'

// ─── Stats Strip ──────────────────────────────────────────────────────────────
async function PaymentStats() {
    const { stats } = await getPaymentStats()
    if (!stats) return null
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/policies" className="block">
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg"><IndianRupee className="h-4 w-4 text-primary" /></div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">₹{stats.totalPremium.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total Premium</div>
                    </div>
                </div>
            </Link>
            <Link href="/payments?filter=collected" className="block">
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="h-4 w-4 text-green-600" /></div>
                    <div>
                        <div className="text-lg font-bold text-green-800">₹{stats.totalCollected.toLocaleString()}</div>
                        <div className="text-xs text-green-600">Collected</div>
                    </div>
                </div>
            </Link>
            <Link href="/payments?filter=due" className="block">
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg"><AlertCircle className="h-4 w-4 text-red-600" /></div>
                    <div>
                        <div className="text-lg font-bold text-red-800">₹{stats.totalDue.toLocaleString()}</div>
                        <div className="text-xs text-red-600">Total Due</div>
                    </div>
                </div>
            </Link>
            <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg"><Wallet className="h-4 w-4 text-gray-500" /></div>
                <div className="flex flex-wrap gap-1.5">
                    <Link href="/payments?filter=paid"><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">{stats.paidPolicies} Paid</span></Link>
                    <Link href="/payments?filter=partial"><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{stats.partialPolicies} Partial</span></Link>
                    <Link href="/payments?filter=due"><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">{stats.duePolicies} Due</span></Link>
                </div>
            </div>
        </div>
    )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
    const gradients = ['from-blue-400 to-indigo-500', 'from-emerald-400 to-green-500', 'from-amber-400 to-orange-500', 'from-rose-400 to-pink-500', 'from-violet-400 to-purple-500', 'from-cyan-400 to-sky-500']
    const g = gradients[name.charCodeAt(0) % gradients.length]
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const sz = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-11 w-11 text-sm'
    return <div className={`${sz} rounded-full bg-gradient-to-br ${g} flex items-center justify-center text-white font-bold flex-shrink-0`}>{initials}</div>
}

// ─── Grouped Payments List ─────────────────────────────────────────────────────
async function GroupedPaymentsList({ filter, q }: { filter: string; q: string }) {
    const { policies, error } = await getFilteredPayments(filter)

    if (error) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-300 mb-3" />
            <p className="text-gray-400">{error}</p>
        </div>
    )

    if (!policies || policies.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="h-10 w-10 text-green-300 mb-3" />
            <p className="text-gray-700 font-semibold">All caught up!</p>
            <p className="text-gray-400 text-sm">No pending payments at the moment.</p>
        </div>
    )

    // ── Group by customer ──
    type PolicyItem = typeof policies[0]
    const grouped = new Map<string, { customer: any; policies: PolicyItem[] }>()

    for (const policy of policies) {
        const customer = Array.isArray(policy.customer) ? policy.customer[0] : policy.customer
        const name = customer?.name || 'Unknown'
        // Search filter
        if (q && !name.toLowerCase().includes(q.toLowerCase()) && !policy.policy_number.toLowerCase().includes(q.toLowerCase())) continue

        const key = customer?.id || name
        if (!grouped.has(key)) grouped.set(key, { customer, policies: [] })
        grouped.get(key)!.policies.push(policy)
    }

    const groups = Array.from(grouped.values())

    if (groups.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-400">No results found for &quot;{q}&quot;</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-4">
            {groups.map(({ customer, policies: customerPolicies }) => {
                const totalDue = customerPolicies.reduce((sum, p) => sum + ((p.premium_total || 0) - (p.amount_paid || 0)), 0)
                const totalPremium = customerPolicies.reduce((sum, p) => sum + (p.premium_total || 0), 0)
                const hasMultiple = customerPolicies.length > 1

                // Build combined WhatsApp message for multiple policies
                const waMsgLines = customerPolicies.map(p => {
                    const company = Array.isArray(p.company) ? p.company[0] : p.company
                    const due = (p.premium_total || 0) - (p.amount_paid || 0)
                    return `• *${p.policy_number}* (${company?.name || '—'}) → ₹${due.toLocaleString()}`
                }).join('\n')
                const waMsg = hasMultiple
                    ? `Namaste *${customer?.name || 'Customer'}* ji! 🙏\n\nAapke *${customerPolicies.length} pending payments* hain:\n\n${waMsgLines}\n\n*Total Due: ₹${totalDue.toLocaleString()}*\n\nKripya jald payment karein. - PolicySathi`
                    : (() => {
                        const p = customerPolicies[0]
                        const due = (p.premium_total || 0) - (p.amount_paid || 0)
                        return `Namaste *${customer?.name || 'Customer'}*, your policy *${p.policy_number}* payment of *₹${due.toLocaleString()}* is pending. Please pay soon to ensure continued coverage. - PolicySathi`
                    })()

                return (
                    <div key={customer?.id || customer?.name} className={cn(
                        "bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                        hasMultiple ? "border-amber-200" : "border-gray-100"
                    )}>
                        {/* Customer Header */}
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-3.5",
                            hasMultiple ? "bg-amber-50/60" : "bg-gray-50/60"
                        )}>
                            <Avatar name={customer?.name || '?'} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-gray-900 text-sm">{customer?.name || 'Unknown'}</span>
                                    {hasMultiple && (
                                        <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                            {customerPolicies.length} policies pending
                                        </span>
                                    )}
                                </div>
                                {customer?.phone && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                        <Phone className="h-3 w-3" />{customer.phone}
                                    </div>
                                )}
                            </div>

                            {/* Total due + WhatsApp */}
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-lg font-bold text-red-600">₹{totalDue.toLocaleString()}</div>
                                    <div className="text-xs text-gray-400">of ₹{totalPremium.toLocaleString()} due</div>
                                </div>
                                <a
                                    href={getWhatsAppUrl(customer?.phone, waMsg)}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-xs font-semibold"
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    {hasMultiple ? 'Remind All' : 'WhatsApp'}
                                </a>
                            </div>
                        </div>

                        {/* Policy Rows */}
                        <div className={cn("divide-y divide-gray-50", hasMultiple && "border-t border-amber-100")}>
                            {customerPolicies.map((policy) => {
                                const company = Array.isArray(policy.company) ? policy.company[0] : policy.company
                                const amountDue = (policy.premium_total || 0) - (policy.amount_paid || 0)

                                return (
                                    <div key={policy.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3">
                                        {/* Policy info */}
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {hasMultiple && <ChevronRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />}
                                            <div className="min-w-0 flex-1 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
                                                <div>
                                                    <div className="text-xs text-gray-400">Policy No.</div>
                                                    <div className="text-xs font-mono font-bold text-gray-800">{policy.policy_number}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-400">Company</div>
                                                    <div className="text-xs font-medium text-gray-700 truncate">{company?.name || '—'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-400">Premium</div>
                                                    <div className="text-xs font-semibold text-gray-800">₹{(policy.premium_total || 0).toLocaleString()}</div>
                                                    {(policy.amount_paid || 0) > 0 && (
                                                        <div className="text-xs text-green-600">Paid: ₹{policy.amount_paid.toLocaleString()}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-400">Due</div>
                                                    <div className="text-sm font-bold text-red-600">₹{amountDue.toLocaleString()}</div>
                                                    <span className={cn(
                                                        "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                                                        policy.payment_status === 'partial'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : 'bg-red-50 text-red-700 border border-red-200'
                                                    )}>
                                                        {policy.payment_status === 'partial'
                                                            ? <><Clock className="h-2.5 w-2.5" /> Partial</>
                                                            : <><AlertCircle className="h-2.5 w-2.5" /> Due</>}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Record Payment */}
                                        <div className="flex-shrink-0 flex justify-end">
                                            <RecordPaymentDialog
                                                policyId={policy.id}
                                                policyNumber={policy.policy_number}
                                                customerName={customer?.name || 'N/A'}
                                                premiumTotal={policy.premium_total || 0}
                                                amountPaid={policy.amount_paid || 0}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string }> }) {
    const params = await searchParams
    const currentFilter = params.filter || 'due'
    const q = params.q || ''

    const filterLabels: Record<string, string> = {
        due: 'Pending Payments', paid: 'Paid Policies', partial: 'Partial Payments', collected: 'Collected', all: 'All Payments'
    }

    return (
        <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Payments</h1>
                    <p className="text-sm text-gray-500 font-medium">Track and collect pending policy payments</p>
                </div>
            </div>

            {/* Stats */}
            <Suspense fallback={<div className="animate-pulse h-20 bg-gray-100 rounded-xl" />}>
                <PaymentStats />
            </Suspense>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                {[
                    { key: 'due', label: '⚠️ Pending', color: 'text-red-700 bg-red-50 border-red-200' },
                    { key: 'partial', label: '🕐 Partial', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { key: 'paid', label: '✅ Paid', color: 'text-green-700 bg-green-50 border-green-200' },
                    { key: 'all', label: '🗂️ All', color: 'text-gray-700 bg-gray-50 border-gray-200' },
                ].map(tab => (
                    <Link key={tab.key} href={`/payments?filter=${tab.key}${q ? `&q=${q}` : ''}`}
                        className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors",
                            currentFilter === tab.key ? tab.color : "text-gray-500 bg-white border-gray-200 hover:border-gray-300"
                        )}>
                        {tab.label}
                    </Link>
                ))}
                {currentFilter !== 'due' && (
                    <Link href="/payments" className="text-xs text-gray-400 hover:text-gray-600 ml-1 underline">Reset</Link>
                )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-3 rounded-xl">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
                <form className="flex-1">
                    <input type="hidden" name="filter" value={currentFilter} />
                    <Input
                        name="q"
                        type="text"
                        placeholder="Search by customer name or policy number..."
                        defaultValue={q}
                        className="border-0 shadow-none focus-visible:ring-0 h-9 text-sm placeholder:text-gray-400 bg-transparent"
                    />
                </form>
                {q && <Link href={`/payments?filter=${currentFilter}`} className="text-xs text-gray-400 hover:text-gray-600">Clear</Link>}
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-700">{filterLabels[currentFilter] || 'Payments'}</h2>
                <span className="text-xs text-gray-400">· grouped by customer</span>
            </div>

            {/* List */}
            <Suspense fallback={<div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}</div>}>
                <GroupedPaymentsList filter={currentFilter} q={q} />
            </Suspense>
        </div>
    )
}
