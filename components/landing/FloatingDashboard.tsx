'use client'

import { LayoutDashboard, Users, FileText, BarChart3, Bell, Shield } from 'lucide-react'

export function FloatingDashboard() {
    return (
        <div className="relative w-full h-[400px] lg:h-[500px]">
            {/* Main Dashboard Card - Floating */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] lg:w-[380px] animate-float">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <span className="font-bold">PolicySathi Dashboard</span>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-4 space-y-3">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-blue-600">156</p>
                                <p className="text-xs text-blue-600/70">Active Policies</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-green-600">₹24L</p>
                                <p className="text-xs text-green-600/70">Total Premium</p>
                            </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-end h-12">
                                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                                    <div
                                        key={i}
                                        className="w-6 bg-gradient-to-t from-primary to-primary/60 rounded-t"
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">Weekly Performance</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            <button className="flex-1 bg-primary/10 text-primary text-xs font-medium py-2 px-3 rounded-lg hover:bg-primary/20 transition-colors">
                                + Add Policy
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-600 text-xs font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                                View All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Mini Cards */}
            <div className="absolute top-8 left-4 lg:left-8 animate-float-delayed">
                <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">5 Renewals Due</p>
                            <p className="text-[10px] text-gray-400">This week</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 right-4 lg:right-8 animate-float-slow">
                <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">89 Customers</p>
                            <p className="text-[10px] text-gray-400">+12 this month</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-16 right-8 lg:right-16 animate-float">
                <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">₹4.2L</p>
                            <p className="text-[10px] text-gray-400">Commission</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-20 left-8 lg:left-16 animate-float-delayed">
                <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">23 Claims</p>
                            <p className="text-[10px] text-gray-400">Processing</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
