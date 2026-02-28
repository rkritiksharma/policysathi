"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DashboardFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentDays = searchParams.get("days") || "30"

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("days", value)
        router.push(`?${params.toString()}`)
    }

    return (
        <Select defaultValue={currentDays} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px] bg-white rounded-xl border-gray-200 focus:ring-primary/20">
                <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="7">Next 7 Days</SelectItem>
                <SelectItem value="15">Next 15 Days</SelectItem>
                <SelectItem value="30">Next 30 Days</SelectItem>
                <SelectItem value="60">Next 60 Days</SelectItem>
            </SelectContent>
        </Select>
    )
}
