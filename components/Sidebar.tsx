
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Building,
    FileText,
    Settings,
    Wallet,
    BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/policies', label: 'Policies', icon: FileText },
    { href: '/payments', label: 'Payments', icon: Wallet },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/companies', label: 'Companies', icon: Building },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 w-64 border-r border-gray-100 min-h-screen bg-white/50 backdrop-blur-xl", className)}>
            <div className="space-y-6 py-6">
                <div className="px-6">
                    <h2 className="text-2xl font-serif font-bold tracking-tight text-primary">
                        PolicySathi
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">Agent Console</p>
                </div>

                <div className="px-3">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Button
                                    key={item.href}
                                    asChild
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start rounded-xl mb-1 transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                            : "text-gray-500 hover:text-primary hover:bg-gray-50"
                                    )}
                                >
                                    <Link href={item.href}>
                                        <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                                        {item.label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

