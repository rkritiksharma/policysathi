'use client'

import { Suspense } from 'react'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { MobileSidebar } from '@/components/MobileSidebar'
import { MobileNav } from '@/components/MobileNav'
import { CommandMenu } from '@/components/CommandMenu'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { UserProvider } from '@/components/UserProvider'
import { UserMenu } from '@/components/UserMenu'
import { logout as logoutAction } from '@/app/login/actions'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()

    return (
        <UserProvider>
            <div className="flex min-h-screen w-full flex-col bg-gray-50/50 lg:flex-row">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block fixed inset-y-0 z-50">
                    <Sidebar className="w-64" />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col w-full lg:pl-64 transition-all duration-300">
                    {/* Mobile Header */}
                    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-3 h-14 flex items-center gap-2 lg:hidden">
                        <MobileSidebar />
                        <span className="font-serif font-bold text-base text-primary flex-1">PolicySathi</span>

                        {/* Mobile Notification Bell */}
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push('/notifications')}>
                            <Bell className="h-4 w-4 text-gray-600" />
                        </Button>

                        {/* Mobile User Menu */}
                        <UserMenu
                            avatarSize="h-7 w-7"
                            buttonSize="h-8 w-8"
                            onLogout={logoutAction}
                        />
                    </div>

                    {/* Desktop Header (Hidden on mobile) */}
                    <div className="hidden lg:block relative z-50">
                        <Header />
                    </div>

                    <main className="flex flex-1 flex-col gap-4 p-4 pb-20 md:pb-4 lg:gap-6 lg:p-8">
                        <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-12 text-muted-foreground animate-pulse">Loading dashboard...</div>}>
                            {children}
                        </Suspense>
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileNav />

                {/* Command Menu (Ctrl+K) */}
                <CommandMenu />
            </div>
        </UserProvider>
    )
}
