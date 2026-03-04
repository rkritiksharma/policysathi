import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="rounded-3xl border-white/60 bg-white/40 backdrop-blur-xl shadow-xl shadow-slate-200/40 border overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 bg-slate-200 animate-pulse rounded mb-1" />
                        <div className="h-3 w-32 bg-slate-100 animate-pulse rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export function ChartSkeleton() {
    return (
        <Card className="rounded-[2.5rem] border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 border overflow-hidden p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <div className="h-6 w-32 bg-slate-200 animate-pulse rounded" />
                    <div className="h-4 w-48 bg-slate-100 animate-pulse rounded" />
                </div>
                <div className="h-10 w-44 bg-slate-200 animate-pulse rounded-full" />
            </div>
            <div className="h-[300px] w-full bg-slate-50/50 rounded-2xl flex items-end justify-between px-8 py-4 gap-4">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="w-full bg-slate-200/60 animate-pulse rounded-t-lg"
                        style={{ height: `${20 + Math.random() * 60}%` }}
                    />
                ))}
            </div>
        </Card>
    )
}

export function InsightsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-3xl h-48 bg-slate-50 animate-pulse border-0" />
            <Card className="rounded-[2rem] h-48 bg-slate-50 animate-pulse border-0 lg:col-span-2" />
            <Card className="rounded-[2rem] h-48 bg-slate-50 animate-pulse border-0" />
            <Card className="rounded-[2rem] h-48 bg-slate-50 animate-pulse border-0 lg:col-span-2" />
        </div>
    )
}

export function TableSkeleton() {
    return (
        <Card className="rounded-[2.5rem] border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl shadow-slate-200/50 border overflow-hidden">
            <CardHeader className="border-b border-white/40 pb-4">
                <div className="h-6 w-48 bg-slate-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent className="p-0">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
                                <div className="h-3 w-24 bg-slate-100 animate-pulse rounded" />
                            </div>
                        </div>
                        <div className="h-4 w-16 bg-slate-100 animate-pulse rounded" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export function ListSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 w-full bg-white/40 border border-white/60 backdrop-blur-md rounded-2xl animate-pulse flex items-center px-4 gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-slate-200 rounded" />
                        <div className="h-3 w-1/4 bg-slate-100 rounded" />
                    </div>
                    <div className="h-4 w-20 bg-slate-200 rounded hidden sm:block" />
                    <div className="h-8 w-8 rounded-lg bg-slate-100 hidden sm:block" />
                </div>
            ))}
        </div>
    )
}

export function MiniStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-full bg-white/40 border border-white/60 backdrop-blur-md rounded-xl animate-pulse" />
            ))}
        </div>
    )
}
