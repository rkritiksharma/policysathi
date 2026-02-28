import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, Car, Download, FileText, Shield, User } from 'lucide-react'
import { format } from 'date-fns'
import { DocumentUpload } from '@/components/DocumentUpload'

export default async function PolicyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: policy } = await supabase
        .from('policies')
        .select(`
            *,
            customers (name, phone, email),
            companies (name)
        `)
        .eq('id', id)
        .eq('agent_id', user.id)
        .single()

    if (!policy) {
        notFound()
    }

    const isExpired = new Date(policy.expiry_date) < new Date()
    const expiryDays = Math.ceil((new Date(policy.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/policies">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Policy Details</h1>
                    <p className="text-muted-foreground">{policy.policy_number}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline">Edit Policy</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {/* Main Policy Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{policy.companies?.name || 'Unknown Company'}</CardTitle>
                                    <CardDescription>{policy.policy_type} Insurance</CardDescription>
                                </div>
                                <Badge variant={isExpired ? "destructive" : "default"} className="uppercase">
                                    {isExpired ? 'Expired' : 'Active'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Vehicle Reg No</Label>
                                    <div className="font-medium flex items-center gap-2 mt-1">
                                        <Car className="h-4 w-4 text-primary" />
                                        {policy.vehicle_reg_no || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Make / Model</Label>
                                    <div className="font-medium mt-1">
                                        {policy.vehicle_make} {policy.vehicle_model}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{policy.vehicle_variant}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Premium</Label>
                                    <div className="font-medium mt-1">₹ {parseFloat(policy.premium_total).toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Start Date</Label>
                                    <div className="font-medium mt-1">
                                        {format(new Date(policy.start_date), 'dd MMM yyyy')}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Expiry Date</Label>
                                    <div className={`font-medium mt-1 ${expiryDays < 30 ? 'text-orange-600' : ''}`}>
                                        {format(new Date(policy.expiry_date), 'dd MMM yyyy')}
                                    </div>
                                    {!isExpired && (
                                        <div className="text-xs text-muted-foreground">Expires in {expiryDays} days</div>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">IDV</Label>
                                    <div className="font-medium mt-1">₹ {policy.idv ? parseFloat(policy.idv).toLocaleString('en-IN') : 'N/A'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" /> Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Name</Label>
                                <div className="font-medium">{policy.customers?.name}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Phone</Label>
                                <div className="font-medium">{policy.customers?.phone}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Email</Label>
                                <div className="font-medium">{policy.customers?.email || '-'}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Document Upload Section */}
                    <DocumentUpload policyId={policy.id} currentUrl={policy.pdf_url} />

                    {/* Additional Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="outline">{policy.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Created</span>
                                <span>{format(new Date(policy.created_at), 'dd MMM yyyy')}</span>
                            </div>
                            {policy.ncb && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">NCB</span>
                                    <span>{policy.ncb}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Label({ children, className, htmlFor }: { children: React.ReactNode, className?: string, htmlFor?: string }) {
    return <p className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</p>
}
