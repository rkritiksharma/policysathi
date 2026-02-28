"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Example customer type
export type Customer = {
    id: string
    name: string
    phone: string
    email: string
    city: string
    policies_count: number
    total_premium: number
    status: "active" | "inactive"
}

// Define columns
export const customerColumns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
            return (
                <Link
                    href={`/customers/${row.original.id}`}
                    className="font-medium hover:underline"
                >
                    {row.getValue("name")}
                </Link>
            )
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
        accessorKey: "city",
        header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
    },
    {
        accessorKey: "policies_count",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Policies" />,
        cell: ({ row }) => {
            const count = row.getValue("policies_count") as number
            return (
                <Badge variant="outline" className="font-mono">
                    {count}
                </Badge>
            )
        },
    },
    {
        accessorKey: "total_premium",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Premium" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total_premium"))
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
            return (
                <span
                    className={`badge-status ${status === "active" ? "status-active" : "status-expired"
                        }`}
                >
                    {status}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const customer = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/customers/${customer.id}`}>
                                <ArrowUpRight className="mr-2 h-4 w-4" />
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(customer.phone)}
                        >
                            Copy Phone
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(customer.email)}
                        >
                            Copy Email
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

// Example usage component
export function CustomersDataTable({ data }: { data: Customer[] }) {
    return (
        <DataTable
            columns={customerColumns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search by name..."
        />
    )
}
