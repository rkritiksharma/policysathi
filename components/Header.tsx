'use client'

import { FileText } from 'lucide-react'
import { UniversalSearch } from './UniversalSearch'
import { UserMenu } from './UserMenu'
import { NotificationsDrawer } from './NotificationsDrawer'
import { logout as logoutAction } from '@/app/login/actions'

export function Header() {
    return (
        <header className="flex h-16 md:h-20 items-center gap-2 md:gap-4 border-b border-slate-100 bg-white/70 px-4 md:px-10 backdrop-blur-md">
            {/* Left Section: Title */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center md:hidden">
                    <FileText className="h-4 w-4 text-primary" />
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-black text-foreground tracking-tight">Overview</h1>
            </div>

            {/* Middle Section: Universal Search (Centered) */}
            <div className="flex-1 flex justify-center max-w-2xl mx-auto hidden md:flex">
                <UniversalSearch className="shadow-none border-gray-200 w-full" />
            </div>

            {/* Right Section: Actions (Notifications + User) */}
            <div className="flex items-center justify-end gap-1 md:gap-2 flex-shrink-0">

                {/* Notifications */}
                <NotificationsDrawer triggerClassName="h-8 w-8 md:h-10 md:w-10" />

                {/* User Menu */}
                <UserMenu onLogout={logoutAction} />
            </div>
        </header>
    )
}
