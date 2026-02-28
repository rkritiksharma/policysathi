"use client"

import { MobileTableCard } from "@/components/MobileTableCard"
import { MobileNav } from "@/components/MobileNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MobileDemo() {
    const sampleCustomers = [
        {
            id: "1",
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            email: "rajesh@example.com",
            city: "Mumbai",
            policies: 3,
            premium: "₹45,000",
            status: "active" as const,
        },
        {
            id: "2",
            name: "Priya Sharma",
            phone: "+91 98765 43211",
            email: "priya@example.com",
            city: "Delhi",
            policies: 2,
            premium: "₹32,000",
            status: "pending" as const,
        },
        {
            id: "3",
            name: "Amit Patel",
            phone: "+91 98765 43212",
            email: "amit@example.com",
            city: "Bangalore",
            policies: 1,
            premium: "₹18,000",
            status: "expired" as const,
        },
    ]

    return (
        <div className="container mx-auto p-4 pb-20 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Mobile Responsiveness Demo</h1>
                <p className="text-gray-500 text-sm">
                    Resize your browser or view on mobile to see responsive features
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mobile Features</CardTitle>
                    <CardDescription>What's included in mobile responsiveness</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Bottom Navigation:</strong> Fixed bottom nav bar on mobile devices</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Card Layout:</strong> Tables convert to cards on mobile</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Responsive Breakpoints:</strong> Optimized for all screen sizes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Touch-Friendly:</strong> Larger tap targets and spacing</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-lg font-semibold mb-3">Customer Cards (Mobile View)</h2>
                <div className="space-y-3">
                    {sampleCustomers.map((customer) => (
                        <MobileTableCard
                            key={customer.id}
                            id={customer.id}
                            title={customer.name}
                            subtitle={customer.email}
                            badge={{
                                text: customer.status,
                                variant: customer.status,
                            }}
                            fields={[
                                { label: "Phone", value: customer.phone },
                                { label: "City", value: customer.city },
                                { label: "Policies", value: customer.policies },
                                { label: "Premium", value: customer.premium },
                            ]}
                            href={`/customers/${customer.id}`}
                        />
                    ))}
                </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">Try It Out!</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800">
                    <p className="mb-2">To see mobile features:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Open browser DevTools (F12)</li>
                        <li>Toggle device toolbar (Ctrl+Shift+M)</li>
                        <li>Select a mobile device</li>
                        <li>See bottom navigation and card layout</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    )
}
