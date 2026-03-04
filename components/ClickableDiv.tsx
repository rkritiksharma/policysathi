'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import React from 'react'

export function ClickableDiv({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    const router = useRouter()

    return (
        <div
            className={cn("cursor-pointer", className)}
            onClick={(e) => {
                // Don't navigate if clicking on a button, link, or interactive element
                const target = e.target as HTMLElement
                if (target.closest('button, a, input, [role="menuitem"], [data-radix-collection-item]')) return
                router.push(href)
            }}
        >
            {children}
        </div>
    )
}
