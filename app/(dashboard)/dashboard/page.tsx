import { getDashboardStats, getUpcomingRenewals, getOverduePolicies, getExpiringNotifications, getRevenueStats, getCustomerInsights } from './actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import { Users, FileText, AlertCircle, Clock, Car, Bike, AlertTriangle, Filter, RefreshCw, MessageCircle, Check } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCharts } from "@/components/DashboardCharts"
import { BirthdayReminders } from "@/components/BirthdayReminders"
import { DashboardFilter } from "@/components/DashboardFilter"
import { ChartFilter } from "@/components/ChartFilter"
import { EmptyState } from "@/components/EmptyState"
import { AutomationButton } from "@/components/AutomationButton"
import { InsightsGrid } from "@/components/InsightsGrid"


export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ days?: string; range?: string }> }) {
    const params = await searchParams
    const daysFilter = params.days ? parseInt(params.days) : 30 // Default 30 days
    const chartRange = params.range || '6M'
    const [stats, revenueStats, upcoming, overdue, expiringPolicies, insights] = await Promise.all([
        getDashboardStats(),
        getRevenueStats(chartRange),
        getUpcomingRenewals(daysFilter),
        getOverduePolicies(),
        getExpiringNotifications(),
        getCustomerInsights()
    ])

    // Determine alert banner content (Mock logic for now based on design)
    // Real logic: count policies expiring in < 7 days
    const expiringCount = expiringPolicies.length
    const expiringDays = 7

    return (
        <div className="flex flex-col gap-4 md:gap-6 w-full max-w-[1600px] mx-auto px-4 md:px-0 pb-20 md:pb-6">



            {/* Alert Banner - Urgency Focus */}
            {expiringCount > 0 && (
                <div className="w-full bg-red-50/80 border border-red-100 text-red-800 px-3 md:px-4 py-2 md:py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm md:text-base">
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0 animate-pulse" />
                    <span className="font-bold text-sm md:text-lg text-red-900 leading-tight">⚠️ {expiringCount} policies expiring in next {expiringDays} days!</span>
                    <Link href="/policies?status=Active&sort=expiry_asc">
                        <Button variant="link" className="text-red-800 underline font-semibold h-auto p-0 ml-2 hover:text-red-900 text-xs md:text-sm" suppressHydrationWarning>View Now</Button>
                    </Link>
                </div>
            )}

            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">Dashboard</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Overview of your agency performance</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <AutomationButton />
                    <span className="text-xs md:text-sm font-medium text-gray-600">Filter Renewals:</span>
                    {/* Client Component for URL updates */}
                    <DashboardFilter />
                </div>
            </div>

            {/* Stats Cards - Premium Visuals */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/customers" className="block">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50/30 shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Users className="h-24 w-24 text-blue-600" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-900 font-serif">{stats.totalCustomers?.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/policies" className="block">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50/30 shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <FileText className="h-24 w-24 text-green-600" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-green-700 uppercase tracking-wider">Total Policies</CardTitle>
                            <FileText className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-900 font-serif">{stats.totalPolicies?.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Amber / Due Card */}
                <Link href="/policies?status=Active" className="block">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50/30 shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Clock className="h-24 w-24 text-amber-600" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-amber-700 uppercase tracking-wider">Due Soon (30 Days)</CardTitle>
                            <Clock className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-amber-900 font-serif">{stats.duePolicies}</div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Red / Expired Card */}
                <Link href="/policies?status=Expired" className="block">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-rose-50/30 shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <AlertCircle className="h-24 w-24 text-red-600" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-red-700 uppercase tracking-wider">Expired Policies</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-red-900 font-serif">{stats.expiredPolicies}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Quick Actions - Most used shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/policies/new" className="group">
                    <Card className="border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer shadow-none hover:shadow-sm">
                        <CardContent className="p-3 md:p-4 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-primary">+ New Policy</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/customers/new" className="group">
                    <Card className="border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all cursor-pointer shadow-none hover:shadow-sm">
                        <CardContent className="p-3 md:p-4 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-700">+ New Customer</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/payments" className="group">
                    <Card className="border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-all cursor-pointer shadow-none hover:shadow-sm">
                        <CardContent className="p-3 md:p-4 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Clock className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-amber-700">Payments</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/reports" className="group">
                    <Card className="border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer shadow-none hover:shadow-sm">
                        <CardContent className="p-3 md:p-4 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <AlertCircle className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Reports</span>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Charts + Birthday Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="lg:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Analytics Overview</h2>
                        <ChartFilter />
                    </div>
                    <DashboardCharts
                        revenueData={revenueStats.monthlyData || []}
                        policyDistribution={revenueStats.policyDistribution || []}
                    />
                </div>
                <div className="lg:col-span-1">
                    <BirthdayReminders />
                </div>
            </div>

            {/* Smart Insights Section */}
            <div>
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-gray-800">Smart Insights</h2>
                        <p className="text-xs text-gray-400">Real-time analytics for your agency</p>
                    </div>
                </div>
                <InsightsGrid
                    marketShare={insights.marketShare}
                    topCustomers={insights.topCustomers}
                    missedRenewals={insights.missedRenewals}
                    growth={insights.growth}
                />
            </div>

            {/* Actionable Tables */}
            <div className="grid gap-4 md:gap-6 w-full">
                <Tabs defaultValue="upcoming" className="w-full">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <TabsList className="bg-gray-100/80 p-1 rounded-lg md:rounded-xl border border-gray-200">
                            <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium text-xs md:text-sm px-3 md:px-4">Upcoming Renewals</TabsTrigger>
                            <TabsTrigger value="overdue" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 font-medium text-xs md:text-sm px-3 md:px-4">Overdue Policies</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="upcoming" className="p-0 m-0">
                        <Card className="shadow-sm border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50/80">
                                        <TableRow>
                                            <TableHead className="w-[100px] font-semibold text-gray-700 whitespace-nowrap">Type</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Customer Name</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Policy No.</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Expiry Date</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Status</TableHead>
                                            <TableHead className="text-right font-semibold text-gray-700 whitespace-nowrap">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {upcoming.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="p-0 border-0">
                                                    <div className="py-8">
                                                        <EmptyState
                                                            icon={Check}
                                                            title="No upcoming renewals"
                                                            description="Great job! No policies are expiring in this period."
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : upcoming.map((p: any) => (
                                            <TableRow key={p.id} className="hover:bg-gray-50/80 transition-colors border-b last:border-0 border-gray-100">
                                                <TableCell>
                                                    {/* Mock Logic for Icon */}
                                                    <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                                        <Car className="h-4 w-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                                                    {p.customers?.name}
                                                    <div className="text-xs text-gray-500 font-normal">One-Click WhatsApp</div>
                                                </TableCell>
                                                <TableCell className="text-gray-600 font-mono text-xs whitespace-nowrap">{p.policy_number}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <span className="font-semibold text-gray-900">{format(new Date(p.expiry_date), 'dd MMM yyyy')}</span>
                                                    <div className="text-xs text-amber-600 font-medium">{differenceInDays(new Date(p.expiry_date), new Date())} days left</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={getWhatsAppUrl(p.customers?.phone, `Namaste *${p.customers?.name || 'Customer'}*, your policy *${p.policy_number}* is expiring on *${format(new Date(p.expiry_date), 'dd MMM yyyy')}*. Please pay *₹${(p.premium_total || 0).toLocaleString()}* to renew instantly. - PolicySathi`)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-200 bg-transparent hover:bg-green-50 text-green-600 h-8 px-3"
                                                        >
                                                            <MessageCircle className="h-4 w-4 mr-2" />
                                                            WhatsApp
                                                        </a>
                                                        <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-white shadow-none" suppressHydrationWarning>
                                                            Renew
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="overdue" className="p-0 m-0">
                        <Card className="shadow-sm border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="w-[100px] font-semibold text-gray-700 whitespace-nowrap">Type</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Customer Name</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Policy No.</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Expiry Date</TableHead>
                                            <TableHead className="font-semibold text-gray-700 whitespace-nowrap">Status</TableHead>
                                            <TableHead className="text-right font-semibold text-gray-700 whitespace-nowrap">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {overdue.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="text-center p-8 text-gray-500">No overdue policies.</TableCell></TableRow>
                                        ) : overdue.map((p: any) => (
                                            <TableRow key={p.id} className="hover:bg-red-50/10">
                                                <TableCell>
                                                    <div className="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-red-100/50 text-red-600">
                                                        <AlertTriangle className="h-4 w-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900 whitespace-nowrap">{p.customers?.name}</TableCell>
                                                <TableCell className="text-gray-600 font-mono text-xs whitespace-nowrap">{p.policy_number}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <span className="font-semibold text-red-600">{format(new Date(p.expiry_date), 'dd MMM yyyy')}</span>
                                                    <div className="text-xs text-red-500 font-medium">Overdue by {Math.abs(differenceInDays(new Date(p.expiry_date), new Date()))} days</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="destructive" className="shadow-none">Expired</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={getWhatsAppUrl(p.customers?.phone, `Namaste *${p.customers?.name || 'Customer'}*, your policy *${p.policy_number}* is overdue by ${Math.abs(differenceInDays(new Date(p.expiry_date), new Date()))} days. Please pay *₹${((p.premium_total || 0) - (p.amount_paid || 0)).toLocaleString()}* immediately to renew. - PolicySathi`)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-200 bg-transparent hover:bg-green-50 text-green-600 h-8 px-3"
                                                        >
                                                            <MessageCircle className="h-4 w-4 mr-2" />
                                                            WhatsApp
                                                        </a>
                                                        <Button variant="outline" size="sm" className="h-8 text-gray-700 border-gray-300 hover:bg-gray-100">
                                                            View
                                                        </Button>
                                                        <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-white shadow-none" suppressHydrationWarning>
                                                            Renew
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
