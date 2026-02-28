'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cake, Phone, Gift, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getUpcomingBirthdays } from '@/app/(dashboard)/dashboard/actions'
import { getWhatsAppUrl } from '@/lib/utils'

export function BirthdayReminders() {
    const [birthdays, setBirthdays] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchBirthdays() {
            try {
                const data = await getUpcomingBirthdays()
                setBirthdays(data)
            } catch (error) {
                console.error('Error fetching birthdays:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBirthdays()
    }, [])

    if (isLoading) {
        return (
            <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Cake className="h-5 w-5 text-pink-500" />
                        Upcoming Birthdays
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Cake className="h-5 w-5 text-pink-500" />
                    Upcoming Birthdays
                    {birthdays.length > 0 && (
                        <span className="ml-auto text-xs font-normal text-gray-500">
                            Next 30 days
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {birthdays.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                        <Gift className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No upcoming birthdays</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {birthdays.slice(0, 5).map((customer) => (
                            <div
                                key={customer.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {customer.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/customers/${customer.id}`}
                                        className="font-medium text-gray-900 hover:text-primary truncate block"
                                    >
                                        {customer.name}
                                    </Link>
                                    <p className="text-xs text-gray-500">
                                        {customer.daysUntil === 0 ? (
                                            <span className="text-pink-600 font-semibold">🎉 Today!</span>
                                        ) : customer.daysUntil === 1 ? (
                                            <span className="text-pink-600 font-semibold">Tomorrow</span>
                                        ) : (
                                            <span>In {customer.daysUntil} days</span>
                                        )}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                    asChild
                                >
                                    <a href={getWhatsAppUrl(customer.phone, "🎂 Happy Birthday! Wishing you a wonderful day filled with joy and happiness.")} target="_blank" rel="noopener noreferrer">
                                        <Phone className="h-3 w-3 mr-1" /> Wish
                                    </a>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
