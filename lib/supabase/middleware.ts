
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const isPrefetch = request.headers.get('x-middleware-prefetch') === '1'
    if (isPrefetch) {
        return NextResponse.next()
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Check session - getUser is secure and validates the token.
    // We cannot use getSession because Supabase strictly warns against it for SSR.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Determine if the current path is public
    const isPublicRoute =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/verify-email') ||
        request.nextUrl.pathname.startsWith('/auth')

    if (!user && !isPublicRoute) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If there is a user, prevent them from accessing login/signup page again
    if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/verify-email'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard' // or your main authenticated route
        return NextResponse.redirect(url)
    }

    // Force onboarding if agency_name is missing
    if (user && !isPublicRoute) {
        // Check if we already know they are onboarded via a cookie to save a DB call on every navigation
        const isOnboardedCookie = request.cookies.get('policy_sathi_onboarded')?.value;
        const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding');

        let isAgentOnboarded = isOnboardedCookie === 'true';

        // If we don't know, fetch from DB
        if (!isAgentOnboarded) {
            const { data: agent } = await supabase
                .from('agents')
                .select('agency_name')
                .eq('id', user.id)
                .single();

            isAgentOnboarded = !!agent?.agency_name;

            // Set cookie so we don't have to check DB again for this session
            if (isAgentOnboarded) {
                supabaseResponse.cookies.set('policy_sathi_onboarded', 'true', {
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: '/',
                    sameSite: 'lax'
                });
            }
        }

        if (!isAgentOnboarded && !isOnboardingRoute) {
            // Missing agency_name, force them to onboarding
            const url = request.nextUrl.clone()
            url.pathname = '/onboarding'
            return NextResponse.redirect(url)
        }

        if (isAgentOnboarded && isOnboardingRoute) {
            // Already onboarded, don't let them see onboarding again
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
