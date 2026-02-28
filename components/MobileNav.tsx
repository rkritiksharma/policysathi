"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, FileText, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Customers",
        href: "/customers",
        icon: Users,
    },
    {
        title: "Policies",
        href: "/policies",
        icon: FileText,
    },
    {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            <div className="flex items-center justify-around min-h-[64px]">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 min-h-[64px] gap-1 transition-all duration-200 active:scale-95",
                                isActive
                                    ? "text-primary"
                                    : "text-gray-500 hover:text-gray-900 active:text-primary"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span className="text-xs font-medium">{item.title}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
