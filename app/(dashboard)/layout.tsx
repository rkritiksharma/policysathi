import { Suspense } from 'react'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { MobileSidebar } from '@/components/MobileSidebar'
import { MobileNav } from '@/components/MobileNav'
import { CommandMenu } from '@/components/CommandMenu'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserProvider } from '@/components/UserProvider'
import { UserMenu } from '@/components/UserMenu'
import { NotificationsDrawer } from '@/components/NotificationsDrawer'
import { logout as logoutAction } from '@/app/login/actions'
import Link from 'next/link'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = await getAuthenticatedUser()

    const userData = {
        id: user.id,
        name: (user as any).name,
        email: user.email!,
        agency_name: (user as any).agency_name,
        role: (user as any).role
    }

    return (
        <UserProvider initialUserData={userData}>
            <div className="flex min-h-screen w-full flex-col bg-slate-50/60 lg:flex-row relative overflow-hidden">
                <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden lg:block fixed inset-y-0 z-50">
                    <Sidebar className="w-64 border-r border-slate-200/60 bg-white/70 backdrop-blur-xl" />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col w-full lg:pl-64 transition-all duration-300">
                    {/* Mobile Header */}
                    <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 h-16 flex items-center gap-3 lg:hidden shadow-sm">
                        <MobileSidebar />
                        <div className="flex items-center gap-2 flex-1">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="font-bold text-primary text-xs">PS</span>
                            </div>
                            <span className="font-bold text-lg text-slate-900 tracking-tight">PolicySathi</span>
                        </div>

                        {/* Mobile Notification Bell */}
                        <NotificationsDrawer triggerClassName="h-9 w-9 border border-slate-200 bg-white shadow-sm" />

                        {/* Mobile User Menu */}
                        <UserMenu
                            avatarSize="h-8 w-8"
                            buttonSize="h-9 w-9"
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
