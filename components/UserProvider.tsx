'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface UserData {
    id?: string
    name: string
    email: string
    agency_name?: string
    role?: string
}

interface UserContextType {
    user: UserData | null
    loading: boolean
}

const UserContext = createContext<UserContextType>({ user: null, loading: true })

export function UserProvider({ children, initialUserData }: { children: ReactNode, initialUserData?: UserData }) {
    const [user, setUser] = useState<UserData | null>(initialUserData || null)
    const [loading, setLoading] = useState(!initialUserData)

    useEffect(() => {
        if (initialUserData) return // Skip fetch if data provided from server

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [initialUserData])

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext)
}
