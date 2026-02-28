
'use client'

import { Bell, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getExpiringNotifications } from '@/app/(dashboard)/dashboard/actions'
import { logout as logoutAction } from '@/app/login/actions'
import { format } from 'date-fns'
import { UniversalSearch } from './UniversalSearch'
import { UserMenu } from './UserMenu'

interface PolicyNotification {
    id: string
    policy_number: string
    vehicle_reg_no: string
    expiry_date: string
    status: string
    customers: { name: string; phone: string }[] | { name: string } | null
}

export function Header() {
    const router = useRouter()
    const [notifications, setNotifications] = useState<PolicyNotification[]>([])
    const [loadingNotifications, setLoadingNotifications] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getExpiringNotifications()
                setNotifications(data)
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
            } finally {
                setLoadingNotifications(false)
            }
        }
        fetchNotifications()
    }, [])

    return (
        <header className="flex h-14 md:h-16 items-center gap-2 md:gap-4 border-b border-gray-100 bg-white/50 px-3 md:px-8 backdrop-blur-sm">
            {/* Left Section: Title */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <h1 className="font-serif text-base md:text-xl font-semibold text-gray-800">Overview</h1>
            </div>

            {/* Middle Section: Universal Search (Centered) */}
            <div className="flex-1 flex justify-center max-w-2xl mx-auto hidden md:flex">
                <UniversalSearch className="shadow-none border-gray-200 w-full" />
            </div>

            {/* Right Section: Actions (Notifications + User) */}
            <div className="flex items-center justify-end gap-1 md:gap-2 flex-shrink-0">

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button suppressHydrationWarning className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-full relative h-8 w-8 md:h-10 md:w-10">
                            <Bell className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 md:top-2 md:right-2 h-2 w-2 rounded-full bg-red-600 border border-white" />
                            )}
                            <span className="sr-only">Notifications</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="end" forceMount>
                        <DropdownMenuLabel className="font-semibold flex items-center justify-between">
                            Notifications
                            {notifications.length > 0 && (
                                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-[300px] overflow-y-auto">
                            {loadingNotifications ? (
                                <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                            ) : (
                                notifications.map((policy) => (
                                    <DropdownMenuItem key={policy.id} className="cursor-pointer p-3 focus:bg-gray-50" onClick={() => router.push(`/policies/${policy.id}`)}>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none text-gray-900">
                                                    Renewal Due
                                                </p>
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    <span className="font-semibold">{Array.isArray(policy.customers) ? policy.customers[0]?.name : policy.customers?.name}</span>&apos;s policy ({policy.vehicle_reg_no}) expires on {format(new Date(policy.expiry_date), 'dd MMM')}.
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    {policy.policy_number}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="p-2 justify-center text-primary font-medium cursor-pointer text-xs" onClick={() => router.push('/policies?status=Active&sort=expiry_asc')}>
                                    View All Renewals
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <UserMenu onLogout={logoutAction} />
            </div>
        </header>
    )
}
