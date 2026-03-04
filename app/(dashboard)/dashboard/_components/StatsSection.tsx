import { getDashboardStats } from "../actions"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Clock, AlertCircle } from 'lucide-react'

export async function StatsSection() {
    const stats = await getDashboardStats()

    const cards = [
        {
            title: "Total Customers",
            value: stats.totalCustomers,
            icon: Users,
            href: "/customers",
            color: "text-primary",
            bgColor: "bg-primary/10",
            borderColor: "border-primary/20",
            label: "+12% from last month"
        },
        {
            title: "Total Policies",
            value: stats.totalPolicies,
            icon: FileText,
            href: "/policies",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100/50",
            borderColor: "border-emerald-200",
            label: "Active coverage"
        },
        {
            title: "Due Soon",
            value: stats.duePolicies,
            icon: Clock,
            href: "/policies?status=Active",
            color: "text-amber-600",
            bgColor: "bg-amber-100/50",
            borderColor: "border-amber-200",
            label: "Next 30 days"
        },
        {
            title: "Expired",
            value: stats.expiredPolicies,
            icon: AlertCircle,
            href: "/policies?status=Expired",
            color: "text-red-600",
            bgColor: "bg-red-100/50",
            borderColor: "border-red-200",
            label: "Requires renewal"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Link key={card.title} href={card.href} className="block">
                    <Card className="relative overflow-hidden border border-white/40 bg-card/40 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full group rounded-3xl">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
                            <card.icon className={cn("h-24 w-24", card.color)} />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.title}</CardTitle>
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border", card.bgColor, card.borderColor)}>
                                <card.icon className={cn("h-4 w-4", card.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-4xl font-extrabold tracking-tight", card.color === 'text-primary' ? 'text-slate-900' : card.color)}>{card.value?.toLocaleString()}</div>
                            <p className={cn("text-[10px] font-medium mt-1", card.color.replace('600', '500').replace('text-', 'text-'))}>{card.label}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
