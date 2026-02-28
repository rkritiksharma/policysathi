import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wallet, TrendingUp, AlertCircle, CheckCircle, Clock, IndianRupee, MessageCircle } from 'lucide-react'
import { getDuePayments, getPaymentStats } from './actions'
import { getWhatsAppUrl } from '@/lib/utils'
import { RecordPaymentDialog } from '@/components/RecordPaymentDialog'

async function PaymentStats() {
    const { stats } = await getPaymentStats()

    if (!stats) return null

    return (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Premium</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{stats.totalPremium.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collected</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">₹{stats.totalCollected.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">₹{stats.totalDue.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Policies Status</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 text-sm">
                        <Badge variant="default" className="bg-green-100 text-green-700">{stats.paidPolicies} Paid</Badge>
                        <Badge variant="default" className="bg-yellow-100 text-yellow-700">{stats.partialPolicies} Partial</Badge>
                        <Badge variant="default" className="bg-red-100 text-red-700">{stats.duePolicies} Due</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

async function DuePaymentsList() {
    const { policies, error } = await getDuePayments()

    if (error) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                <p>Error loading payments: {error}</p>
            </div>
        )
    }

    if (policies.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">All Payments Collected!</h3>
                <p className="mt-1">No pending payments at the moment.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {policies.map((policy: any) => {
                const amountDue = (policy.premium_total || 0) - (policy.amount_paid || 0)
                const customer = Array.isArray(policy.customer) ? policy.customer[0] : policy.customer
                const company = Array.isArray(policy.company) ? policy.company[0] : policy.company

                return (
                    <Card key={policy.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Customer</p>
                                        <p className="font-medium">{customer?.name || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Policy No.</p>
                                        <p className="font-medium">{policy.policy_number}</p>
                                        <p className="text-xs text-muted-foreground">{policy.policy_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Company</p>
                                        <p className="font-medium">{company?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Premium</p>
                                        <p className="font-medium">₹{(policy.premium_total || 0).toLocaleString()}</p>
                                        <p className="text-xs text-green-600">Paid: ₹{(policy.amount_paid || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Due Amount</p>
                                        <p className="font-bold text-red-600 text-lg">₹{amountDue.toLocaleString()}</p>
                                        <Badge
                                            variant="outline"
                                            className={policy.payment_status === 'partial' ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-600'}
                                        >
                                            {policy.payment_status === 'partial' ? (
                                                <><Clock className="h-3 w-3 mr-1" /> Partial</>
                                            ) : (
                                                <><AlertCircle className="h-3 w-3 mr-1" /> Due</>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex flex-col gap-2">
                                    <a
                                        href={getWhatsAppUrl(customer?.phone, `Namaste *${customer?.name || 'Customer'}*, your policy *${policy.policy_number}* payment of *₹${amountDue.toLocaleString()}* is pending. Please pay soon to ensure continued coverage. - PolicySathi`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-200 bg-transparent hover:bg-green-50 text-green-600 h-9 px-3 w-full"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        WhatsApp Reminder
                                    </a>
                                    <RecordPaymentDialog
                                        policyId={policy.id}
                                        policyNumber={policy.policy_number}
                                        customerName={customer?.name || 'N/A'}
                                        premiumTotal={policy.premium_total || 0}
                                        amountPaid={policy.amount_paid || 0}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default function PaymentsPage() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Payments</h1>
                    <p className="text-sm text-gray-500 font-medium">Track and collect pending policy payments</p>
                </div>
            </div>

            <Suspense fallback={<div className="animate-pulse h-24 bg-muted rounded-lg" />}>
                <PaymentStats />
            </Suspense>

            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Pending Payments
                </h2>
                <Suspense fallback={<div className="animate-pulse h-48 bg-muted rounded-lg" />}>
                    <DuePaymentsList />
                </Suspense>
            </div>
        </div>
    )
}
