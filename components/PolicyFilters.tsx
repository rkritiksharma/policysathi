'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PolicyFiltersProps {
    initialStatus?: string
    initialCompanyId?: string
    companies: { id: string; name: string }[]
}

export function PolicyFilters({ initialStatus = 'all', initialCompanyId = 'all', companies }: PolicyFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (status && status !== 'all') {
            params.set('status', status)
        } else {
            params.delete('status')
        }
        // Reset page to 1 when filter changes
        params.set('page', '1')
        router.push(`/policies?${params.toString()}`)
    }

    const handleCompanyChange = (companyId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (companyId && companyId !== 'all') {
            params.set('company', companyId)
        } else {
            params.delete('company')
        }
        // Reset page to 1 when filter changes
        params.set('page', '1')
        router.push(`/policies?${params.toString()}`)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('status')
        params.delete('company')
        params.delete('page')
        router.push(`/policies?${params.toString()}`)
    }

    const hasActiveFilters = initialStatus !== 'all' || initialCompanyId !== 'all'

    return (
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto items-center">
            <Select value={initialStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[150px] bg-white" suppressHydrationWarning>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Renewed">Renewed</SelectItem>
                </SelectContent>
            </Select>

            <Select value={initialCompanyId} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-[180px] bg-white" suppressHydrationWarning>
                    <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                            {company.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="h-9 w-9 text-gray-500 hover:text-red-500"
                    title="Clear Filters"
                >
                    <Filter className="h-4 w-4 rotate-45" />
                    <span className="sr-only">Clear Filters</span>
                </Button>
            )}
        </div>
    )
}
