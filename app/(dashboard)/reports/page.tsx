import Link from 'next/link'
import { getPolicies, getAllPoliciesForExport } from '../policies/actions'
import { Policy } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from 'date-fns'
import { Download, Filter, FileSpreadsheet } from 'lucide-react'
import { ReportDateFilter } from '@/components/ReportDateFilter'
import { ExportButton } from '@/components/ExportButton'

export default async function ReportsPage(props: {
    searchParams: Promise<{ days?: string, from?: string, to?: string }>
}) {
    const searchParams = await props.searchParams;
    const days = Number(searchParams.days) || 30
    const fromDate = searchParams.from
    const toDate = searchParams.to

    // Fetch data for tabs
    // If range is selected, explicit from/to take precedence over utility "days" logic
    // However, for "Upcoming", we usually mean "starting today".
    // If from/to are present, we use them.
    // If NOT present, we fall back to "next X days" logic.

    const upcomingQuery = fromDate && toDate
        ? { fromDate, toDate }
        : { fromDate: new Date().toISOString().split('T')[0], expiry_days: days }

    const [{ data: upcoming }, { data: overdue }, { data: expired }] = await Promise.all([
        getPolicies({ ...upcomingQuery, limit: 50, status: 'Active' }),
        getPolicies({ is_overdue: true, limit: 50 }),
        getPolicies({ status: 'Expired', limit: 50 })
    ])

    // Prepare export query (convert days to explicit date range if needed)
    const exportQuery = fromDate && toDate
        ? { fromDate, toDate }
        : {
            fromDate: new Date().toISOString().split('T')[0],
            toDate: addDays(new Date(), days).toISOString().split('T')[0]
        }

    return (
        <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Reports</h1>
                    <p className="text-sm text-gray-500 font-medium">Business insights and operational lists</p>
                </div>
                <div className="flex gap-2 items-center">
                    <ReportDateFilter />
                    <ExportButton type="policies" getData={getAllPoliciesForExport.bind(null, exportQuery)} />
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="bg-gray-100/80 p-1 mb-6 rounded-xl border border-gray-200">
                    <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium">Upcoming Renewals</TabsTrigger>
                    <TabsTrigger value="overdue" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 font-medium">Overdue Policies</TabsTrigger>
                    <TabsTrigger value="expired" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 font-medium">Lapsed / Expired</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="m-0">
                    <Card className="shadow-sm border">
                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-base font-semibold">Upcoming Renewals List</CardTitle>
                                    <CardDescription>
                                        {fromDate && toDate
                                            ? `Policies expiring between ${fromDate} and ${toDate}`
                                            : `Policies expiring in the next ${days} days`}
                                    </CardDescription>
                                </div>
                                <div className="text-sm font-medium text-gray-500">Total: {upcoming?.length}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <PolicyTable policies={upcoming || []} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="overdue" className="m-0">
                    <Card className="shadow-sm border">
                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-base font-semibold text-red-700">Overdue Policies</CardTitle>
                                    <CardDescription>Policies past expiry date that need immediate attention.</CardDescription>
                                </div>
                                <div className="text-sm font-medium text-red-600">Total: {overdue?.length}</div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <PolicyTable policies={overdue || []} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expired" className="m-0">
                    <Card className="shadow-sm border">
                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                            <CardTitle className="text-base font-semibold text-gray-700">Expired & Lapsed</CardTitle>
                            <CardDescription>Policies that are no longer active.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <PolicyTable policies={expired || []} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function PolicyTable({ policies }: { policies: Policy[] }) {
    return (
        <div className="border rounded-xl overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-gray-50/80">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Policy No</TableHead>
                        <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700">Company</TableHead>
                        <TableHead className="font-semibold text-gray-700">Vehicle</TableHead>
                        <TableHead className="font-semibold text-gray-700">Expiry Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {policies?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                No records found for this category.
                            </TableCell>
                        </TableRow>
                    ) : (
                        policies?.map((policy: Policy) => (
                            <TableRow key={policy.id} className="hover:bg-gray-50/80 transition-colors border-b last:border-0 border-gray-100">
                                <TableCell className="font-medium text-gray-900 font-mono text-xs whitespace-nowrap">{policy.policy_number}</TableCell>
                                <TableCell className="font-medium text-gray-800 whitespace-nowrap">{policy.customers?.name}</TableCell>
                                <TableCell className="text-gray-600 whitespace-nowrap">{policy.companies?.name}</TableCell>
                                <TableCell className="text-gray-600 font-mono text-xs max-w-[100px] truncate uppercase">{policy.vehicle_reg_no || 'N/A'}</TableCell>
                                <TableCell className="font-medium text-gray-700 whitespace-nowrap">
                                    {policy.expiry_date ? format(new Date(policy.expiry_date), 'dd MMM yyyy') : '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={policy.status === 'Active' ? 'default' : policy.status === 'Expired' ? 'destructive' : 'secondary'} className={policy.status === 'Active' ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none px-2 py-0.5" : "shadow-none px-2 py-0.5"}>
                                        {policy.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:border-primary/30" asChild>
                                        <Link href={`/policies/${policy.id}`}>
                                            <FileSpreadsheet className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
