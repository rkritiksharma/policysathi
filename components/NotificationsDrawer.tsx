'use client'

import { Bell, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { format, differenceInDays } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getExpiringNotifications } from '@/app/(dashboard)/dashboard/actions'

interface PolicyNotification {
    id: string
    policy_number: string
    vehicle_reg_no: string
    expiry_date: string
    status: string
    customers: { name: string; phone: string }[] | { name: string } | null
}

export function NotificationsDrawer({ triggerClassName }: { triggerClassName?: string }) {
    const [mounted, setMounted] = useState(false)
    const [notifications, setNotifications] = useState<PolicyNotification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setMounted(true)
        const fetchNotifications = async () => {
            try {
                const data = await getExpiringNotifications()
                setNotifications(data)
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    const unreadCount = notifications.length

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className={`relative rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all ${triggerClassName || ''}`}>
                <Bell className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className={`relative rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all ${triggerClassName || ''}`}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && !loading && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 shrink-0 translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md p-0 flex flex-col bg-gray-50/50 z-[200] max-h-[85vh]">
                <DialogHeader className="p-4 sm:px-6 bg-white border-b border-gray-100 text-left">
                    <div className="flex items-start sm:items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg flex-shrink-0 mt-0.5 sm:mt-0">
                            <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <DialogTitle className="font-serif text-xl tracking-tight text-gray-900 leading-none">Notifications</DialogTitle>
                        {unreadCount > 0 && !loading && (
                            <Badge className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none font-semibold">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    <DialogDescription className="mt-1 text-sm text-gray-500 min-h-0 text-left">
                        Stay on top of expiring policies and actions needed.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm animate-pulse">
                                    <div className="h-10 w-10 rounded-full bg-gray-100"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 sticky top-0 bg-gray-50/50 py-1 backdrop-blur-sm z-10">
                                Attention Required
                            </h3>
                            {notifications.map((notif: any) => {
                                const daysLeft = differenceInDays(new Date(notif.expiry_date), new Date())
                                const isOverdue = daysLeft < 0
                                const isCritical = daysLeft >= 0 && daysLeft <= 3
                                const customerName = Array.isArray(notif.customers) ? notif.customers[0]?.name : notif.customers?.name

                                return (
                                    <Link key={notif.id} href={`/policies/${notif.id}`}>
                                        <div className="group relative flex gap-3 p-3.5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left">
                                            {/* Icon */}
                                            <div className={`mt-0.5 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border shadow-sm ${isOverdue
                                                ? 'bg-red-50 border-red-100 text-red-600'
                                                : isCritical
                                                    ? 'bg-amber-50 border-amber-100 text-amber-600'
                                                    : 'bg-blue-50 border-blue-100 text-blue-600'
                                                }`}>
                                                <AlertTriangle className="h-4 w-4" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 pr-6">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-semibold text-gray-900 text-sm truncate">{customerName || 'Unknown'}</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${isOverdue
                                                        ? 'bg-red-100 text-red-700'
                                                        : isCritical
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {isOverdue ? 'Overdue' : 'Expiring'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 leading-snug">
                                                    Policy <strong className="font-mono text-xs">{notif.policy_number}</strong> {isOverdue ? 'expired' : 'expires'} on {format(new Date(notif.expiry_date), 'dd MMM yyyy')}.
                                                </p>
                                                <div className="mt-2 text-xs font-medium text-gray-400">
                                                    {isOverdue
                                                        ? `${Math.abs(daysLeft)} days ago`
                                                        : daysLeft === 0
                                                            ? 'Today'
                                                            : `In ${daysLeft} days`
                                                    }
                                                </div>
                                            </div>

                                            {/* Chevron */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                            <div className="bg-green-50 p-4 rounded-full mb-4">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">All caught up!</h3>
                            <p className="text-sm text-gray-500 max-w-[200px]">
                                You have no pending notifications or expiring policies at the moment.
                            </p>
                        </div>
                    )}
                </div>

                {notifications.length > 0 && !loading && (
                    <div className="p-4 bg-white border-t border-gray-100">
                        <Button asChild variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5">
                            <Link href="/reports">View All Reports</Link>
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
