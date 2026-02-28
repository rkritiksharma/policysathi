'use client'

import { useEffect, useState } from 'react'

export function GreetingBanner({ userName }: { userName?: string }) {
    const [greeting, setGreeting] = useState('Good Day')
    const [icon, setIcon] = useState('🌤️')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) {
            setGreeting('Good Morning')
            setIcon('🌅')
        } else if (hour < 17) {
            setGreeting('Good Afternoon')
            setIcon('☀️')
        } else {
            setGreeting('Good Evening')
            setIcon('🌙')
        }
    }, [])

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-6">
            <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1">
                    {greeting}, {userName || 'Agent'}! {icon}
                </h2>
                <p className="text-primary-foreground/90 text-sm md:text-base font-medium">
                    Ready to protect more families today? Let&apos;s check your overview.
                </p>
            </div>
            {/* Abstract background shapes for premium feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl" />
        </div>
    )
}
