"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useState } from "react"

export default function FuzzySearchDemo() {
    const [query, setQuery] = useState("")

    const sampleData = [
        { name: "Rajesh Kumar", phone: "+91 98765 43210" },
        { name: "Priya Sharma", phone: "+91 98765 43211" },
        { name: "Amit Patel", phone: "+91 98765 43212" },
    ]

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Fuzzy Search Demo</h1>
                <p className="text-gray-500">
                    Search with typos - try "rajsh" instead of "rajesh" or "pria" instead of "priya"
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fuzzy Search Features</CardTitle>
                    <CardDescription>Powered by Fuse.js</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Try searching with typos..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm">Features:</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Typo Tolerance:</strong> Finds results even with spelling mistakes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Multi-field Search:</strong> Searches across name, phone, email, policy numbers</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Smart Ranking:</strong> Best matches appear first</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span><strong>Fast:</strong> Results appear instantly</span>
                            </li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="font-semibold text-sm mb-3">Try These Examples:</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setQuery("rajsh")}>
                                rajsh → Rajesh
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setQuery("pria")}>
                                pria → Priya
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setQuery("amit")}>
                                amit → Amit
                            </Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={() => setQuery("9876")}>
                                9876 → Phone numbers
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader>
                    <CardTitle className="text-green-900">✅ Fuzzy Search Active!</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-800">
                    <p>
                        The universal search (top-right corner) now uses fuzzy matching. Try searching for customers or policies with typos - it will still find the right results!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
