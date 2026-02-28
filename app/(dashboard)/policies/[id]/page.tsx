import { notFound, redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, Car, Download, FileText, Shield, User, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { DocumentUpload } from '@/components/DocumentUpload'
import { CustomerBadge } from '@/components/CustomerBadge'

export default async function PolicyDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const { supabase, user } = await getAuthenticatedUser()
    if (!user) redirect('/login')

    const { data: policy } = await supabase
        .from('policies')
        .select(`
            *,
            customers (id, customer_code, name, phone, email),
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
                    <Button variant="outline" asChild>
                        <Link href={`/policies/${id}/edit`}>Edit Policy</Link>
                    </Button>
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
                                        {policy.start_date && new Date(policy.start_date).getFullYear() > 1971
                                            ? format(new Date(policy.start_date), 'dd MMM yyyy')
                                            : 'N/A'}
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

                    {/* Customer Info integrated link */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3 border-b border-primary/10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5 text-primary" /> Customer Overview
                                </CardTitle>
                                {policy.customers?.id && (
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary hover:text-primary hover:bg-primary/10" asChild>
                                        <Link href={`/customers/${policy.customers.id}`}>
                                            View Profile <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4 pt-4">
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase">Name</Label>
                                <div className="font-medium flex items-center justify-between mt-1">
                                    <span>{policy.customers?.name}</span>
                                    {policy.customers?.customer_code && (
                                        <CustomerBadge code={policy.customers.customer_code} className="text-xs py-0" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase">Contact</Label>
                                <div className="font-medium mt-1">{policy.customers?.phone}</div>
                                <div className="text-sm text-muted-foreground">{policy.customers?.email || '-'}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Document Upload Section */}
                    <DocumentUpload
                        policyId={policy.id}
                        currentUrl={policy.pdf_url}
                        customerPhone={policy.customers?.phone}
                        policyNumber={policy.policy_number}
                    />

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
