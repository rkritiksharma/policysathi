"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/toast"
import { TableSkeleton, CardSkeleton, DashboardSkeleton } from "@/components/LoadingStates"
import { useState } from "react"

export default function UIDemo() {
    const [showTableSkeleton, setShowTableSkeleton] = useState(false)
    const [showCardSkeleton, setShowCardSkeleton] = useState(false)
    const [showDashboardSkeleton, setShowDashboardSkeleton] = useState(false)

    const simulateLoading = (setter: (value: boolean) => void) => {
        setter(true)
        setTimeout(() => setter(false), 3000)
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold">UI Components Demo</h1>

            {/* Toast Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Toast Notifications</CardTitle>
                    <CardDescription>Click buttons to see different toast types</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button onClick={() => toast.success("Success!", "Operation completed successfully")}>
                        Success Toast
                    </Button>
                    <Button onClick={() => toast.error("Error!", "Something went wrong")} variant="destructive">
                        Error Toast
                    </Button>
                    <Button onClick={() => toast.info("Info", "Here's some information")} variant="outline">
                        Info Toast
                    </Button>
                    <Button
                        onClick={() => {
                            const id = toast.loading("Loading...")
                            setTimeout(() => {
                                toast.dismiss(id)
                                toast.success("Done!")
                            }, 2000)
                        }}
                        variant="secondary"
                    >
                        Loading Toast
                    </Button>
                </CardContent>
            </Card>

            {/* Loading Skeletons */}
            <Card>
                <CardHeader>
                    <CardTitle>Loading Skeletons</CardTitle>
                    <CardDescription>Simulate loading states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Button onClick={() => simulateLoading(setShowTableSkeleton)} className="mb-4">
                            Show Table Skeleton
                        </Button>
                        {showTableSkeleton ? <TableSkeleton rows={3} columns={4} /> : <p className="text-gray-500">Click to see table skeleton</p>}
                    </div>

                    <div>
                        <Button onClick={() => simulateLoading(setShowCardSkeleton)} className="mb-4">
                            Show Card Skeleton
                        </Button>
                        {showCardSkeleton ? (
                            <div className="grid grid-cols-3 gap-4">
                                <CardSkeleton />
                                <CardSkeleton />
                                <CardSkeleton />
                            </div>
                        ) : (
                            <p className="text-gray-500">Click to see card skeletons</p>
                        )}
                    </div>

                    <div>
                        <Button onClick={() => simulateLoading(setShowDashboardSkeleton)} className="mb-4">
                            Show Dashboard Skeleton
                        </Button>
                        {showDashboardSkeleton ? <DashboardSkeleton /> : <p className="text-gray-500">Click to see dashboard skeleton</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Status Colors */}
            <Card>
                <CardHeader>
                    <CardTitle>Status Colors</CardTitle>
                    <CardDescription>Color-coded status badges</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <span className="badge-status status-active">Active</span>
                    <span className="badge-status status-paid">Paid</span>
                    <span className="badge-status status-pending">Pending</span>
                    <span className="badge-status status-due-soon">Due Soon</span>
                    <span className="badge-status status-expired">Expired</span>
                    <span className="badge-status status-overdue">Overdue</span>
                    <span className="badge-status status-info">Info</span>
                </CardContent>
            </Card>
        </div>
    )
}
