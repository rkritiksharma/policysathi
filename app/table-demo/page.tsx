"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, DataTableColumnHeader } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

// Sample data
type Policy = {
    id: string
    customer: string
    policy_number: string
    company: string
    premium: number
    status: "active" | "expired" | "pending"
}

const sampleData: Policy[] = [
    {
        id: "1",
        customer: "Rajesh Kumar",
        policy_number: "POL-2024-001",
        company: "LIC",
        premium: 25000,
        status: "active",
    },
    {
        id: "2",
        customer: "Priya Sharma",
        policy_number: "POL-2024-002",
        company: "HDFC Life",
        premium: 18000,
        status: "pending",
    },
    {
        id: "3",
        customer: "Amit Patel",
        policy_number: "POL-2024-003",
        company: "ICICI Prudential",
        premium: 32000,
        status: "active",
    },
    {
        id: "4",
        customer: "Sneha Reddy",
        policy_number: "POL-2023-045",
        company: "SBI Life",
        premium: 15000,
        status: "expired",
    },
    {
        id: "5",
        customer: "Vikram Singh",
        policy_number: "POL-2024-004",
        company: "Max Life",
        premium: 28000,
        status: "active",
    },
]

const columns: ColumnDef<Policy>[] = [
    {
        accessorKey: "customer",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    },
    {
        accessorKey: "policy_number",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Policy Number" />,
        cell: ({ row }) => (
            <span className="font-mono text-sm">{row.getValue("policy_number")}</span>
        ),
    },
    {
        accessorKey: "company",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
    },
    {
        accessorKey: "premium",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Premium" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("premium"))
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const statusClass =
                status === "active"
                    ? "status-active"
                    : status === "pending"
                        ? "status-pending"
                        : "status-expired"
            return <span className={`badge-status ${statusClass}`}>{status}</span>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <Button variant="ghost" size="sm">
                <ArrowUpRight className="h-4 w-4" />
            </Button>
        ),
    },
]

export default function TableDemo() {
    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Enhanced Data Table Demo</h1>
                <p className="text-gray-500">
                    Try sorting, filtering, hiding columns, and exporting data
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Policies Table</CardTitle>
                    <CardDescription>
                        Click column headers to sort • Use search to filter • Toggle columns • Export to CSV
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={sampleData}
                        searchKey="customer"
                        searchPlaceholder="Search by customer name..."
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features Included</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Column Sorting:</strong> Click any column header to sort ascending/descending</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Search/Filter:</strong> Real-time filtering by search key</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Column Visibility:</strong> Show/hide columns using the "Columns" dropdown</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Pagination:</strong> Navigate through pages, adjust rows per page</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Row Selection:</strong> Select multiple rows (checkboxes can be added)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>CSV Export:</strong> Export visible data to CSV file</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Status Colors:</strong> Color-coded status badges</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
