'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, FileSpreadsheet } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ExportButtonProps {
    type: 'customers' | 'policies'
    getData: () => Promise<any[]>
}

export function ExportButton({ type, getData }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false)

    const exportToCSV = async () => {
        setIsExporting(true)
        try {
            const data = await getData()
            if (!data || data.length === 0) {
                alert('No data to export')
                return
            }

            // Get headers from first object
            const headers = Object.keys(data[0])

            // Create CSV content
            const csvContent = [
                headers.join(','),
                ...data.map(row =>
                    headers.map(header => {
                        let value = row[header]
                        // Handle nested objects
                        if (typeof value === 'object' && value !== null) {
                            value = value.name || JSON.stringify(value)
                        }
                        // Escape quotes and wrap in quotes if contains comma
                        if (typeof value === 'string') {
                            value = value.replace(/"/g, '""')
                            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                                value = `"${value}"`
                            }
                        }
                        return value ?? ''
                    }).join(',')
                )
            ].join('\n')

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error('Export error:', error)
            alert('Export failed')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={isExporting}
            className="gap-2"
            suppressHydrationWarning
        >
            {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            Export CSV
        </Button>
    )
}

// Quick Export dropdown for multiple types
export function QuickExport() {
    const [isExporting, setIsExporting] = useState<string | null>(null)

    const handleExport = async (type: 'customers' | 'policies') => {
        setIsExporting(type)
        try {
            const response = await fetch(`/api/export/${type}`)
            const blob = await response.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error('Export error:', error)
        } finally {
            setIsExporting(null)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('customers')} disabled={isExporting === 'customers'}>
                    {isExporting === 'customers' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Export Customers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('policies')} disabled={isExporting === 'policies'}>
                    {isExporting === 'policies' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Export Policies
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
