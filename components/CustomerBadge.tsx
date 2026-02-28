import { Badge } from "@/components/ui/badge"

interface CustomerBadgeProps {
    code?: string | null
    className?: string
}

export function CustomerBadge({ code, className }: CustomerBadgeProps) {
    if (!code) return null

    return (
        <Badge
            variant="outline"
            className={`font-mono text-[10px] sm:text-xs bg-primary/5 text-primary border-primary/20 px-1.5 py-0 ${className || ''}`}
        >
            {code}
        </Badge>
    )
}
