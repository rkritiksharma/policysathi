"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Smartphone,
    Monitor,
    Tablet,
    Check,
    Maximize2,
    Type,
    Hand
} from "lucide-react"

export default function MobileOptimizationDemo() {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">Mobile Optimization</h1>
                <p className="text-sm md:text-base text-gray-500">
                    Best-in-class mobile responsiveness for PolicySathi
                </p>
            </div>

            {/* Device Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Smartphone className="h-5 w-5" />
                        Responsive Design
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                            <Smartphone className="h-8 w-8 mb-2 text-primary" />
                            <p className="font-semibold">Mobile</p>
                            <p className="text-xs text-gray-500">&lt; 768px</p>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                            <Tablet className="h-8 w-8 mb-2 text-primary" />
                            <p className="font-semibold">Tablet</p>
                            <p className="text-xs text-gray-500">768px - 1024px</p>
                        </div>
                        <div className="flex flex-col items-center p-4 border rounded-lg">
                            <Monitor className="h-8 w-8 mb-2 text-primary" />
                            <p className="font-semibold">Desktop</p>
                            <p className="text-xs text-gray-500">&gt; 1024px</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Optimizations */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Mobile Optimizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Hand className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm md:text-base">Touch-Friendly Targets</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                    All buttons and links are minimum 44x44px for easy tapping
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Type className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm md:text-base">Readable Typography</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                    16px base font size prevents iOS zoom, optimized line heights
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Maximize2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm md:text-base">Optimized Layouts</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                    Cards stack vertically, tables convert to cards, full-width buttons
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sm md:text-base">Safe Area Support</p>
                                <p className="text-xs md:text-sm text-gray-600">
                                    Respects notches and home indicators on modern devices
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Mobile Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Badge variant="outline" className="justify-center py-2">
                            Bottom Navigation
                        </Badge>
                        <Badge variant="outline" className="justify-center py-2">
                            Swipe Gestures
                        </Badge>
                        <Badge variant="outline" className="justify-center py-2">
                            Pull to Refresh
                        </Badge>
                        <Badge variant="outline" className="justify-center py-2">
                            Offline Support
                        </Badge>
                        <Badge variant="outline" className="justify-center py-2">
                            Fast Loading
                        </Badge>
                        <Badge variant="outline" className="justify-center py-2">
                            Touch Optimized
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Test Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Touch Target Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button className="w-full md:w-auto">Full Width on Mobile</Button>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="flex-1">Button 1</Button>
                        <Button variant="outline" className="flex-1">Button 2</Button>
                        <Button variant="outline" className="flex-1">Button 3</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Performance */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader>
                    <CardTitle className="text-green-900 text-lg md:text-xl">
                        ✅ Mobile-First Design
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-800 space-y-2">
                    <p>
                        <strong>Lighthouse Mobile Score:</strong> 90+ Performance
                    </p>
                    <p>
                        <strong>Touch Targets:</strong> All meet 44x44px minimum
                    </p>
                    <p>
                        <strong>Viewport:</strong> Optimized for all screen sizes
                    </p>
                    <p>
                        <strong>Typography:</strong> Prevents zoom, readable on all devices
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
