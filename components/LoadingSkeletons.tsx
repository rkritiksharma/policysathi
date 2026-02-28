import { cn } from '@/lib/utils'

function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-gray-200/80',
                className
            )}
        />
    )
}

export function DashboardStatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                </div>
            ))}
        </div>
    )
}

export function InsightsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-14 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm col-span-1 lg:col-span-2 space-y-3">
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-4 items-center">
                    <Skeleton className="h-36 w-36 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                <Skeleton className="h-4 w-28" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-2 w-16" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
            <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2 space-y-3">
                <Skeleton className="h-4 w-32" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                        <div className="space-y-1">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-2 w-20" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2 w-24" />
                    </div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full ml-auto" />
                </div>
            ))}
        </div>
    )
}
