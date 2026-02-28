import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white border-2 border-dashed border-gray-100 rounded-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 shadow-sm ring-1 ring-gray-200/50">
                <Icon className="h-10 w-10 text-gray-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h3>
            <p className="text-base text-gray-500 max-w-sm mb-8 leading-relaxed">{description}</p>
            {actionLabel && actionHref && (
                <Button asChild size="lg" className="rounded-xl px-8 font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            )}
        </div>
    )
}
