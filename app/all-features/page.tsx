"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdvancedFilters } from "@/components/AdvancedFilters"
import { DashboardWidget } from "@/components/DashboardWidget"
import { MotionDiv, fadeIn, slideUp, staggerContainer } from "@/lib/animations"
import { Users, FileText, DollarSign, TrendingUp, Filter } from "lucide-react"
import { toast } from "@/lib/toast"

export default function AllFeaturesDemo() {
    const [filters, setFilters] = React.useState({})
    const [savedPresets, setSavedPresets] = React.useState<
        Array<{ name: string; filters: any }>
    >([])

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters)
        console.log("Filters changed:", newFilters)
    }

    const handleSavePreset = (name: string, filters: any) => {
        setSavedPresets([...savedPresets, { name, filters }])
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <MotionDiv {...fadeIn}>
                <div>
                    <h1 className="text-3xl font-bold mb-2">All UI Features Demo</h1>
                    <p className="text-gray-500">
                        Complete showcase of all 7 phases of UI enhancements
                    </p>
                </div>
            </MotionDiv>

            {/* Phase 6: Dashboard Widgets with Trends */}
            <MotionDiv {...slideUp}>
                <Card>
                    <CardHeader>
                        <CardTitle>Phase 6: Dashboard Customization</CardTitle>
                        <CardDescription>Animated widgets with trend indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MotionDiv
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                        >
                            <MotionDiv variants={slideUp}>
                                <DashboardWidget
                                    title="Total Customers"
                                    value="2,543"
                                    icon={Users}
                                    trend={{ value: 12, isPositive: true }}
                                    description="Active customers"
                                />
                            </MotionDiv>
                            <MotionDiv variants={slideUp}>
                                <DashboardWidget
                                    title="Active Policies"
                                    value="1,234"
                                    icon={FileText}
                                    trend={{ value: 8, isPositive: true }}
                                    description="Currently active"
                                />
                            </MotionDiv>
                            <MotionDiv variants={slideUp}>
                                <DashboardWidget
                                    title="Total Premium"
                                    value="₹45.2L"
                                    icon={DollarSign}
                                    trend={{ value: 15, isPositive: true }}
                                    description="This month"
                                />
                            </MotionDiv>
                            <MotionDiv variants={slideUp}>
                                <DashboardWidget
                                    title="Growth Rate"
                                    value="23%"
                                    icon={TrendingUp}
                                    trend={{ value: 5, isPositive: false }}
                                    description="vs last month"
                                />
                            </MotionDiv>
                        </MotionDiv>
                    </CardContent>
                </Card>
            </MotionDiv>

            {/* Phase 5: Advanced Filters */}
            <MotionDiv {...slideUp}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Phase 5: Advanced Filters
                        </h2>
                        <AdvancedFilters
                            onFilterChange={handleFilterChange}
                            savedPresets={savedPresets}
                            onSavePreset={handleSavePreset}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Current Filters</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
                                    {JSON.stringify(filters, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </MotionDiv>

            {/* Phase 7: Micro-animations Demo */}
            <MotionDiv {...slideUp}>
                <Card>
                    <CardHeader>
                        <CardTitle>Phase 7: Micro-animations</CardTitle>
                        <CardDescription>Smooth transitions and hover effects</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            All components now feature smooth animations:
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Page transitions:</strong> Fade in/out when navigating</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Card hover:</strong> Subtle scale effect on hover</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Button press:</strong> Scale down on click</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Stagger animations:</strong> Children animate in sequence</span>
                            </li>
                        </ul>

                        <div className="flex gap-2 pt-4">
                            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button onClick={() => toast.success("Animated!", "Button clicked with animation")}>
                                    Try Animated Button
                                </Button>
                            </MotionDiv>
                        </div>
                    </CardContent>
                </Card>
            </MotionDiv>

            {/* Summary */}
            <MotionDiv {...fadeIn}>
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>🎉 All 7 Phases Complete!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h3 className="font-semibold mb-2">Completed Features:</h3>
                                <ul className="space-y-1">
                                    <li>✅ Toast notifications</li>
                                    <li>✅ Loading skeletons</li>
                                    <li>✅ Status colors</li>
                                    <li>✅ Advanced data tables</li>
                                    <li>✅ Mobile responsiveness</li>
                                    <li>✅ Keyboard shortcuts</li>
                                    <li>✅ Advanced filters</li>
                                    <li>✅ Dashboard widgets</li>
                                    <li>✅ Micro-animations</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Demo Pages:</h3>
                                <ul className="space-y-1">
                                    <li>→ /ui-demo</li>
                                    <li>→ /table-demo</li>
                                    <li>→ /mobile-demo</li>
                                    <li>→ /keyboard-demo</li>
                                    <li>→ /all-features (this page)</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </MotionDiv>
        </div>
    )
}
