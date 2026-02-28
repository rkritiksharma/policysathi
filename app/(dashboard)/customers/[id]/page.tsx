
import Link from 'next/link'
import { getCustomerById, getCustomerPolicies } from '../actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, Mail, MapPin, Calendar, CheckCircle2, Circle, RefreshCw, Shield, AlertCircle, FileText, ArrowUpRight, Clock } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CustomerNotes } from '@/components/CustomerNotes'

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: customer } = await getCustomerById(id)
    const policies = await getCustomerPolicies(id)
    const comms: { type: string; date: string; message: string }[] = [] // TODO: Implement communications
    const tasks: { id: string; title: string; due_date: string; status: string }[] = [] // TODO: Implement tasks

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900">Customer not found</h1>
                <p className="text-gray-500">The customer you are looking for does not exist or you do not have permission to view it.</p>
                <Button asChild variant="outline">
                    <Link href="/customers">Back to Customers</Link>
                </Button>
            </div>
        )
    }

    // Calculate Stats
    const totalPremium = policies.reduce((sum, p) => sum + (p.premium || 0), 0)
    const activePoliciesCount = policies.filter(p => p.status === 'Active').length
    const renewalDueCount = policies.filter(p => {
        if (!p.expiry) return false;
        const expiryDate = new Date(p.expiry);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0 && p.status === 'Active';
    }).length;


    return (
        <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
            {/* Modern Clean Header */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/10 flex items-center justify-center text-primary text-3xl md:text-4xl font-bold shadow-inner">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">{customer.name}</h1>
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 text-xs font-bold uppercase tracking-wider px-2 py-0.5">VIP</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium">
                                <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                    <MapPin className="h-3.5 w-3.5 text-primary" /> {customer.city || 'No City'}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                    <Calendar className="h-3.5 w-3.5 text-primary" /> Born: {customer.date_of_birth || 'N/A'}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-100">
                                    <Clock className="h-3.5 w-3.5 text-primary" /> Joined {new Date(customer.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold gap-2">
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                        </Button>
                        <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white shadow-md gap-2">
                            <Phone className="h-4 w-4" /> Call
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none shadow-sm gap-2">
                            <Mail className="h-4 w-4" /> Email
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-widest">Active Policies</CardTitle>
                        <Shield className="h-5 w-5 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{activePoliciesCount}</div>
                        <p className="text-xs text-gray-500 mt-1">out of {policies.length} total policies</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-widest">Total Premium</CardTitle>
                        <FileText className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">₹{totalPremium.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">Lifetime value</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-widest">Renewals Due</CardTitle>
                        <RefreshCw className="h-5 w-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{renewalDueCount}</div>
                        <p className="text-xs text-gray-500 mt-1">in the next 30 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Tabs - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="policies" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-white p-1 rounded-xl shadow-sm border h-auto">
                                <TabsTrigger value="policies" className="rounded-lg px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all">Policies</TabsTrigger>
                                <TabsTrigger value="overview" className="rounded-lg px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all">Details</TabsTrigger>
                                <TabsTrigger value="communications" className="rounded-lg px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all">Timeline</TabsTrigger>
                                <TabsTrigger value="tasks" className="rounded-lg px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all">Tasks</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Policies Tab */}
                        <TabsContent value="policies" className="mt-0">
                            <Card className="border-0 shadow-lg overflow-hidden">
                                <CardHeader className="bg-white border-b px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Insurance Policies</CardTitle>
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm" asChild>
                                            <Link href="/policies/new"><Shield className="h-4 w-4" /> New Policy</Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50">
                                            <TableRow>
                                                <TableHead>Policy Details</TableHead>
                                                <TableHead>Premium</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {policies.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                                                        No policies found. Create one to get started.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                policies.map((policy) => (
                                                    <TableRow key={policy.id} className="hover:bg-blue-50/30 transition-colors group">
                                                        <TableCell className="align-top py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-gray-900">{policy.type}</span>
                                                                <span className="text-sm text-gray-500">{policy.company}</span>
                                                                <span className="text-xs text-gray-400 font-mono">{policy.policy_number}</span>
                                                                {policy.vehicle_reg !== 'N/A' && (
                                                                    <Badge variant="outline" className="w-fit mt-1 text-[10px] bg-gray-100">{policy.vehicle_reg}</Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-medium">₹{policy.premium.toLocaleString()}</span>
                                                                <span className="text-xs text-gray-500">Expires: {policy.expiry}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="align-top py-4">
                                                            <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}
                                                                className={
                                                                    policy.status === 'Active'
                                                                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none"
                                                                        : "bg-gray-100 text-gray-600 border-0 shadow-none"
                                                                }>
                                                                {policy.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right align-top py-4">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-blue-100" asChild>
                                                                    <Link href={`/policies/${policy.id}`}><ArrowUpRight className="h-4 w-4 text-blue-600" /></Link>
                                                                </Button>
                                                                <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-white gap-1 shadow-sm" asChild>
                                                                    <Link href={`/policies/new?renew=${policy.id}`}>Renew</Link>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Comms Tab */}
                        <TabsContent value="communications" className="mt-0">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Communication History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200 before:content-['']">
                                        {comms.length === 0 ? (
                                            <div className="text-center py-10 text-gray-500">No communication history yet.</div>
                                        ) : (
                                            comms.map((comm, idx) => (
                                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                        {comm.type === 'WhatsApp' ? <MessageCircle className="h-5 w-5 text-green-600" /> : <Phone className="h-5 w-5 text-blue-600" />}
                                                    </div>
                                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                                            <div className="font-bold text-gray-900">{comm.type}</div>
                                                            <time className="font-mono italic text-xs text-gray-500">{comm.date}</time>
                                                        </div>
                                                        <div className="text-gray-600 text-sm">{comm.message}</div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tasks Tab */}
                        <TabsContent value="tasks" className="mt-0">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Tasks & To-Dos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {tasks.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">No pending tasks.</div>
                                    ) : (
                                        tasks.map((task) => (
                                            <div key={task.id} className="flex gap-4 p-4 border rounded-xl bg-white items-center hover:shadow-md transition-shadow">
                                                {task.status === 'Completed' ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Circle className="h-6 w-6 text-gray-300" />}
                                                <div className="flex-1">
                                                    <p className={`font-semibold ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Due: {task.due_date}</p>
                                                </div>
                                                <Badge variant={task.status === 'Completed' ? 'secondary' : 'default'}>{task.status}</Badge>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-0">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle>Customer Profile</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">Phone Number</div>
                                        <div className="font-medium text-gray-900 text-lg">{customer.phone}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">Email Address</div>
                                        <div className="font-medium text-gray-900 text-lg">{customer.email || '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">Birth Date</div>
                                        <div className="font-medium text-gray-900 text-lg">{customer.date_of_birth || '-'}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs font-semibold text-gray-500 uppercase">City / Location</div>
                                        <div className="font-medium text-gray-900 text-lg">{customer.city || '-'}</div>
                                    </div>
                                    <div className="col-span-2 border-t pt-4 mt-2">
                                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Registered Address</div>
                                        <div className="font-medium text-gray-900">123, Some Street, {customer.city}, India</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <CustomerNotes customerId={id} />

                    {/* Quick Actions Card */}
                    <Card className="border shadow-md bg-white text-gray-900">
                        <CardHeader className="pb-3 border-b bg-gray-50/50">
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Shield className="h-5 w-5" /> Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-white shadow-md" asChild>
                                <Link href="/policies/new"><Shield className="mr-2 h-4 w-4" /> Create New Policy</Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50 text-gray-700">
                                <FileText className="mr-2 h-4 w-4" /> Send Statement
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
