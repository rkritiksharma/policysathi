'use client'

import { useRouter } from 'next/navigation'

export function ClickableRow({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    const router = useRouter()

    return (
        <tr
            className={`cursor-pointer border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ''}`}
            onClick={(e) => {
                // Don't navigate if clicking on a button, link, or interactive element
                const target = e.target as HTMLElement
                if (target.closest('button, a, [role="menuitem"], [data-radix-collection-item]')) return
                router.push(href)
            }}
        >
            {children}
        </tr>
    )
}
