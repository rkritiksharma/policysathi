
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const supabase = await createClient()

    // Proper Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error.message)
        return { error: error.message || 'Invalid email or password' }
    }

    if (!data.user) {
        return { error: 'Login failed' }
    }

    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Logout error:', error)
    }

    redirect('/login')
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Validate password strength
    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    const supabase = await createClient()

    const fullName = [firstName, lastName].filter(Boolean).join(' ')

    // Proper Supabase signup
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        }
    })

    if (error) {
        console.error('Signup error:', error.message)
        return { error: error.message || 'Signup failed' }
    }

    if (!data.user) {
        return { error: 'Signup failed' }
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
        redirect('/verify-email')
    }

    // Even if auto-login happens (if Confirm Email is off in Supabase during dev),
    // redirect to verify-email as a standard practice, or go to dashboard
    // We will redirect to dashboard here, and the middleware will catch if onboarding is needed.
    redirect('/dashboard')
}
