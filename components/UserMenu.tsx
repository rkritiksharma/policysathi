'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/components/UserProvider'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import { User, Settings, LogOut } from 'lucide-react'

interface UserMenuProps {
    /** Avatar size class, e.g. "h-7 w-7" or "h-8 w-8" */
    avatarSize?: string
    /** Button size class */
    buttonSize?: string
    /** Logout action to call */
    onLogout: () => Promise<void>
}

export function UserMenu({
    avatarSize = 'h-7 w-7 md:h-8 md:w-8',
    buttonSize = 'h-8 w-8 md:h-10 md:w-10',
    onLogout,
}: UserMenuProps) {
    const router = useRouter()
    const { user } = useUser()

    const handleLogout = async () => {
        try {
            await onLogout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button suppressHydrationWarning className={`relative ${buttonSize} rounded-full p-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary`}>
                    <Avatar className={avatarSize}>
                        <AvatarImage src="/avatars/01.png" alt={user?.name || 'User'} />
                        <AvatarFallback className="text-xs md:text-sm">
                            {user ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'Loading...'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || ''}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer flex items-center" onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
