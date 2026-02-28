"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export interface DashboardChartsProps {
    revenueData: { name: string; policies: number; revenue: number }[]
    policyDistribution: { name: string; value: number; color?: string }[]
}

const COLORS = ['#4A6741', '#5F8552', '#354A2E', '#EAB308', '#EF4444', '#8B5CF6'] // Green palette + accents

export function DashboardCharts({ revenueData, policyDistribution }: DashboardChartsProps) {
    // Determine if we have data to show
    const hasRevenueData = !!revenueData && revenueData.length > 0;
    const hasPolicyData = !!policyDistribution && policyDistribution.length > 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
            {/* Revenue Trend Chart */}
            <Card className="col-span-4 shadow-sm">
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>
                        Monthly collection for the last 6 months
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {hasRevenueData ? (
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4A6741" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4A6741" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value: number) => `₹${value.toLocaleString()}`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#4A6741', strokeWidth: 1 }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        formatter={(value: any) => [<span className="font-bold text-primary">₹{Number(value || 0).toLocaleString()}</span>, <span className="text-gray-500">Revenue</span>]}
                                        labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#4A6741"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2 border-muted">
                            No revenue data available yet
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Policy Distribution Chart */}
            <Card className="col-span-3 shadow-sm">
                <CardHeader>
                    <CardTitle>Policy Distribution</CardTitle>
                    <CardDescription>
                        Active policies by type
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {hasPolicyData ? (
                        <div className="h-[350px] w-full relative">
                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                <div className="text-3xl font-bold text-gray-900">
                                    {policyDistribution.reduce((acc, curr) => acc + curr.value, 0)}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">Policies</div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={policyDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        cornerRadius={5}
                                    >
                                        {policyDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [<span className="font-bold text-gray-900">{value}</span>, <span className="text-gray-500">{name}</span>]}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        itemStyle={{ padding: 0 }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2 border-muted">
                            No policy data available yet
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
