"use client"

import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { useRouter, useSearchParams } from "next/navigation"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { useEffect, useState } from "react"

export function ReportDateFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize state from URL params
    const initialFrom = searchParams.get('from')
    const initialTo = searchParams.get('to')

    const [date, setDate] = useState<DateRange | undefined>(() => {
        if (initialFrom && initialTo) {
            return {
                from: new Date(initialFrom),
                to: new Date(initialTo)
            }
        }
        // Default to last 30 days if no params
        return {
            from: addDays(new Date(), 0), // Today
            to: addDays(new Date(), 30)   // Next 30 days (matching default logic)
        }
    })

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate)

        if (newDate?.from) {
            const params = new URLSearchParams(searchParams.toString())
            params.set('from', format(newDate.from, 'yyyy-MM-dd'))

            if (newDate.to) {
                params.set('to', format(newDate.to, 'yyyy-MM-dd'))
            } else {
                params.delete('to')
            }
            // Remove 'days' param if present, as custom range overrides it
            params.delete('days')

            router.push(`?${params.toString()}`)
        }
    }

    return (
        <DatePickerWithRange
            date={date}
            onDateChange={handleDateChange}
        />
    )
}
