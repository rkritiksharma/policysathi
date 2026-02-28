'use client'

import { TrendingUp, TrendingDown, Award, AlertTriangle, Building2, Crown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']

interface InsightsGridProps {
    marketShare: { name: string; count: number; revenue: number }[]
    topCustomers: { name: string; phone: string; premium: number; count: number }[]
    missedRenewals: any[]
    growth: { thisMonth: number; lastMonth: number; percent: number }
}

export function InsightsGrid({ marketShare, topCustomers, missedRenewals, growth }: InsightsGridProps) {
    const isGrowth = growth.percent >= 0

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

            {/* Month-over-Month Growth Banner */}
            <Card className={`border-0 shadow-sm col-span-1 ${isGrowth ? 'bg-gradient-to-br from-green-50 to-emerald-50/40' : 'bg-gradient-to-br from-red-50 to-rose-50/40'}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        {isGrowth ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                        Month-over-Month
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`text-5xl font-bold font-serif ${isGrowth ? 'text-green-700' : 'text-red-600'}`}>
                        {isGrowth ? '+' : ''}{growth.percent}%
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {growth.thisMonth} policies this month vs {growth.lastMonth} last month
                    </p>
                    <Badge className={`mt-3 ${isGrowth ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {isGrowth ? '📈 Growing' : '📉 Declining'}
                    </Badge>
                </CardContent>
            </Card>

            {/* Company Market Share */}
            <Card className="border-0 shadow-sm col-span-1 lg:col-span-2">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        Top Companies by Policies
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {marketShare.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No data yet</p>
                    ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="h-40 w-40 flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={marketShare} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                                            {marketShare.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: any) => [v, 'Policies']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full space-y-2">
                                {marketShare.map((co, i) => (
                                    <div key={co.name} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                                            <span className="text-sm font-medium text-gray-700 truncate">{co.name}</span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-sm font-bold text-gray-900">{co.count}</span>
                                            <span className="text-xs text-gray-400 ml-1">policies</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Top Customers */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-500" />
                        Top Customers
                    </CardTitle>
                    <CardDescription className="text-xs">By total premium value</CardDescription>
                </CardHeader>
                <CardContent>
                    {topCustomers.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topCustomers.map((c, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                                        <p className="text-xs text-gray-400">{c.count} {c.count === 1 ? 'policy' : 'policies'}</p>
                                    </div>
                                    <span className="text-sm font-bold text-green-700">₹{c.premium.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Missed Renewals */}
            <Card className="border-0 shadow-sm lg:col-span-2 border-l-4 border-l-red-400">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Missed Renewals
                    </CardTitle>
                    <CardDescription className="text-xs">Expired &gt; 30 days, not yet renewed</CardDescription>
                </CardHeader>
                <CardContent>
                    {missedRenewals.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">✅ No missed renewals! Great job.</p>
                    ) : (
                        <div className="space-y-2">
                            {missedRenewals.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/60 border border-red-100">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{(p.customers as any)?.name}</p>
                                        <p className="text-xs font-mono text-gray-500">{p.policy_number}</p>
                                    </div>
                                    <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                        Expired {new Date(p.expiry_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
