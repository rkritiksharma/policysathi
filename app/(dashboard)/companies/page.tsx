import { getCompaniesWithPolicyCount, createCompany, deleteCompany } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ExternalLink, Trash2, Building2, Phone, Globe, FileText, ShieldCheck, Heart, Zap } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components/EmptyState'

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string; gradient: string }> = {
    General: { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-100', gradient: 'from-blue-50 to-indigo-50/40' },
    Health: { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-100', gradient: 'from-rose-50 to-pink-50/40' },
    Life: { icon: Zap, color: 'text-violet-600', bg: 'bg-violet-100', border: 'border-violet-100', gradient: 'from-violet-50 to-purple-50/40' },
}

const LOGO_COLORS = [
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-violet-400 to-purple-500',
    'from-cyan-400 to-sky-500',
    'from-teal-400 to-emerald-500',
    'from-orange-400 to-red-500',
]

function CompanyLogoPlaceholder({ name, index }: { name: string; index: number }) {
    const gradient = LOGO_COLORS[index % LOGO_COLORS.length]
    const initials = name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase()
    return (
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}>
            {initials}
        </div>
    )
}

function CreateCompanyDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Company
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Insurance Company</DialogTitle>
                    <DialogDescription>Add details of a new insurance provider.</DialogDescription>
                </DialogHeader>
                <form action={async (formData) => {
                    'use server'
                    await createCompany(formData)
                }}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-sm">Name</Label>
                            <Input id="name" name="name" className="col-span-3" required placeholder="e.g. HDFC ERGO" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right text-sm">Type</Label>
                            <select id="type" name="type" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <option value="General">General</option>
                                <option value="Health">Health</option>
                                <option value="Life">Life</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="portal_url" className="text-right text-sm">Portal</Label>
                            <Input id="portal_url" name="portal_url" className="col-span-3" placeholder="https://..." />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="support_phone" className="text-right text-sm">Phone</Label>
                            <Input id="support_phone" name="support_phone" className="col-span-3" placeholder="1800-xxx-xxxx" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">Save Company</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default async function CompaniesPage() {
    const { data: companies } = await getCompaniesWithPolicyCount()

    const totalPolicies = companies?.reduce((sum: number, c: any) => sum + (c.policy_count || 0), 0) || 0

    return (
        <div className="flex flex-col gap-5 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Companies</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        {companies?.length || 0} providers · {totalPolicies} total policies
                    </p>
                </div>
                <CreateCompanyDialog />
            </div>

            {/* Summary Tiles */}
            {companies && companies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['General', 'Health', 'Life'].map(type => {
                        const cfg = TYPE_CONFIG[type]
                        const Icon = cfg.icon
                        const typeCompanies = companies.filter((c: any) => c.type === type)
                        const typePolicies = typeCompanies.reduce((s: number, c: any) => s + (c.policy_count || 0), 0)
                        return (
                            <div key={type} className={`bg-gradient-to-br ${cfg.gradient} border ${cfg.border} rounded-xl px-4 py-3 flex items-center gap-3`}>
                                <div className={`${cfg.bg} ${cfg.color} p-2 rounded-lg`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-base font-bold text-gray-800">{typeCompanies.length} <span className="text-xs font-normal text-gray-500">companies</span></div>
                                    <div className="text-xs text-gray-500">{type} · {typePolicies} policies</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Company Cards */}
            {!companies || companies.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16">
                    <EmptyState icon={Building2} title="No companies yet" description="Add your first insurance company to get started." />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {companies.map((company: any, index: number) => {
                        const cfg = TYPE_CONFIG[company.type] || TYPE_CONFIG['General']
                        const Icon = cfg.icon

                        return (
                            <div
                                key={company.id}
                                className={`group relative bg-white border ${cfg.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col gap-4`}
                            >
                                {/* Subtle bg gradient accent */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-40 pointer-events-none`} />

                                {/* Card Header */}
                                <div className="relative flex items-start gap-3">
                                    <CompanyLogoPlaceholder name={company.name} index={index} />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{company.name}</h3>
                                        <span className={`inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                            <Icon className="h-3 w-3" />{company.type}
                                        </span>
                                    </div>
                                    {/* Delete button — shown on hover */}
                                    <form action={async () => {
                                        'use server'
                                        await deleteCompany(company.id)
                                    }}>
                                        <button
                                            type="submit"
                                            title={company.policy_count > 0 ? 'Cannot delete: has linked policies' : 'Delete company'}
                                            disabled={company.policy_count > 0}
                                            className="relative opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:hover:text-gray-300 disabled:hover:bg-transparent"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </form>
                                </div>

                                {/* Stats */}
                                <div className="relative flex items-center gap-3">
                                    <div className="flex-1 bg-white/70 rounded-xl px-3 py-2 border border-white text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                                        <div className="text-xl font-bold text-gray-900 font-serif">{company.policy_count || 0}</div>
                                        <div className="text-xs text-gray-400 font-medium">Policies</div>
                                    </div>
                                </div>

                                {/* Footer Links */}
                                <div className="relative flex items-center gap-3 pt-1 border-t border-black/5">
                                    {company.portal_url ? (
                                        <Link
                                            href={company.portal_url}
                                            target="_blank"
                                            className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.color} hover:underline`}
                                        >
                                            <Globe className="h-3.5 w-3.5" /> Portal
                                            <ExternalLink className="h-3 w-3 opacity-60" />
                                        </Link>
                                    ) : (
                                        <span className="text-xs text-gray-300">No portal</span>
                                    )}
                                    {company.support_phone && (
                                        <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                                            <Phone className="h-3 w-3" />{company.support_phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
