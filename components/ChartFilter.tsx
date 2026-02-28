"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function ChartFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentRange = searchParams.get("range") || "6M"

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("range", value)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <Select defaultValue={currentRange} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-white/50 border-gray-200 focus:ring-primary/20">
                <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent className="min-w-[120px]">
                <SelectItem value="1M">Last Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
        </Select>
    )
}
