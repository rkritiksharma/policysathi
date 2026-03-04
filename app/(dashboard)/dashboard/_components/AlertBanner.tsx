import { getExpiringNotifications } from "../actions"
import { AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export async function AlertBanner() {
    const expiringPolicies = await getExpiringNotifications()
    const expiringCount = expiringPolicies.length

    if (expiringCount === 0) return null

    return (
        <div className="w-full bg-red-50/50 backdrop-blur-md border border-red-100/60 text-red-800 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex flex-col text-left">
                    <span className="font-bold text-base text-red-900 leading-tight">{expiringCount} policies expiring soon!</span>
                    <span className="text-xs text-red-700/80">Check them before they lapse to maintain trust.</span>
                </div>
            </div>
            <Link href="/policies?status=Active&sort=expiry_asc">
                <Button variant="outline" className="border-red-200 bg-white hover:bg-red-50 text-red-700 font-semibold h-9 px-4 rounded-xl transition-all shadow-sm">
                    View Now
                </Button>
            </Link>
        </div>
    )
}
