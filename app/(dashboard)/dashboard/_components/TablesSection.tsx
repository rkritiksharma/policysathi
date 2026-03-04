import { getUpcomingRenewals, getOverduePolicies } from "../actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import { Clock, AlertTriangle, MessageCircle, FileText, Check, Car, Bike } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'

export async function TablesSection({ daysFilter }: { daysFilter: number }) {
    const [upcoming, overdue] = await Promise.all([
        getUpcomingRenewals(daysFilter),
        getOverduePolicies()
    ])

    return (
        <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Policies Overview</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage your portfolio with precision.</p>
                </div>
                <TabsList className="bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm shadow-sm h-11 shrink-0 overflow-x-auto max-w-full">
                    <TabsTrigger value="upcoming" className="rounded-xl px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-sm font-bold transition-all gap-2">
                        <Clock className="h-4 w-4" /> Upcoming
                        <Badge variant="secondary" className="ml-1 bg-slate-200/50 text-slate-700 hover:bg-slate-200 border-none px-1.5 h-5 min-w-[20px] justify-center">{upcoming.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="rounded-xl px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 text-sm font-bold transition-all gap-2">
                        <AlertTriangle className="h-4 w-4" /> Overdue
                        <Badge variant="destructive" className="ml-1 bg-red-100 text-red-700 hover:bg-red-200 border-none px-1.5 h-5 min-w-[20px] justify-center">{overdue.length}</Badge>
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="upcoming" className="mt-0 focus-visible:ring-0">
                <Card className="rounded-[2.5rem] border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 border overflow-hidden">
                    <CardHeader className="border-b border-white/40 bg-slate-50/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900">Renewals Queue</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500">Policies expiring in the next {daysFilter} days</CardDescription>
                                </div>
                            </div>
                            <Link href="/policies">
                                <Button variant="ghost" className="text-xs font-bold text-primary hover:bg-primary/5 rounded-xl">View All</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-b border-white/40">
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-6">Policy Details</TableHead>
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400">Customer</TableHead>
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400">Company</TableHead>
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400">Expiry Date</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase tracking-widest font-black text-slate-400 pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcoming.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-slate-400">No upcoming renewals found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        upcoming.map((p) => {
                                            const daysLeft = differenceInDays(new Date(p.expiry_date), new Date())
                                            return (
                                                <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100/50 group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-slate-200/50">
                                                                {p.policy_type === 'Two Wheeler' ? <Bike className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-900">{p.policy_number}</div>
                                                                <div className="text-[10px] font-mono font-medium text-slate-400 uppercase">{p.vehicle_reg_no || 'NA'}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="text-sm font-bold text-slate-800">{(p.customers as any)?.name}</div>
                                                        <div className="text-[10px] font-medium text-slate-400">{(p.customers as any)?.phone}</div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-white font-bold text-[10px] rounded-lg">{(p.companies as any)?.name}</Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-900">{format(new Date(p.expiry_date), 'dd MMM yyyy')}</span>
                                                            <span className={cn("text-[10px] font-black uppercase", daysLeft <= 7 ? "text-red-500" : "text-amber-500")}>
                                                                {daysLeft} days left
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <Button size="sm" variant="outline" className="h-8 rounded-xl border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 font-bold text-[11px] gap-2 shadow-sm" asChild>
                                                            <a href={getWhatsAppUrl((p.customers as any)?.phone, `Namaste! I'm calling from PolicySathi. Your policy ${p.policy_number} is expiring soon.`)} target="_blank" rel="noopener noreferrer">
                                                                <MessageCircle className="h-3 w-3" /> Remind
                                                            </a>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="overdue" className="mt-0 focus-visible:ring-0">
                <Card className="rounded-[2.5rem] border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 border overflow-hidden">
                    <CardHeader className="border-b border-white/40 bg-red-50/20 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-red-100/50 flex items-center justify-center border border-red-200">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900">Overdue Recovery</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500">Expired policies that need urgent renewal.</CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-b border-white/40">
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400 pl-6">Policy Details</TableHead>
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400">Customer</TableHead>
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400">Status</TableHead>
                                        <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-400">Expired On</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase tracking-widest font-black text-slate-400 pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {overdue.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-slate-400">✅ Great job! No overdue policies found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        overdue.map((p) => (
                                            <TableRow key={p.id} className="hover:bg-red-50/10 transition-colors border-b border-slate-100/50 group">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 border border-red-100">
                                                            <FileText className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{p.policy_number}</div>
                                                            <div className="text-[10px] font-mono font-medium text-slate-400 uppercase">{p.vehicle_reg_no || 'NA'}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="text-sm font-bold text-slate-800">{(p.customers as any)?.name}</div>
                                                    <div className="text-[10px] font-medium text-slate-400">{(p.customers as any)?.phone}</div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge className="bg-red-100 text-red-700 border-red-200 font-bold text-[10px] rounded-lg">EXPIRED</Badge>
                                                </TableCell>
                                                <TableCell className="py-4 text-sm font-bold text-red-600">
                                                    {format(new Date(p.expiry_date), 'dd MMM yyyy')}
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <Button size="sm" variant="outline" className="h-8 rounded-xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 font-bold text-[11px] shadow-sm">
                                                        Process
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
