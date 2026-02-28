import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, MoreVertical } from "lucide-react"
import Link from "next/link"

interface MobileTableCardProps {
    id: string
    title: string
    subtitle?: string
    badge?: {
        text: string
        variant: "active" | "pending" | "expired" | "info"
    }
    fields: Array<{
        label: string
        value: string | number
    }>
    href?: string
    onAction?: () => void
}

export function MobileTableCard({
    id,
    title,
    subtitle,
    badge,
    fields,
    href,
    onAction,
}: MobileTableCardProps) {
    const badgeClass = badge
        ? `badge-status ${badge.variant === "active"
            ? "status-active"
            : badge.variant === "pending"
                ? "status-pending"
                : badge.variant === "expired"
                    ? "status-expired"
                    : "status-info"
        }`
        : ""

    return (
        <Card className="md:hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-base">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {badge && <span className={badgeClass}>{badge.text}</span>}
                        {onAction && (
                            <Button variant="ghost" size="icon" onClick={onAction}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <p className="text-xs text-gray-500 mb-0.5">{field.label}</p>
                            <p className="text-sm font-medium">{field.value}</p>
                        </div>
                    ))}
                </div>
                {href && (
                    <Link href={href}>
                        <Button variant="outline" size="sm" className="w-full">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    )
}
