
'use server'

import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { addDays } from 'date-fns'
import { cache } from 'react'

export const getDashboardStats = cache(async () => {
    const { supabase, user } = await getAuthenticatedUser()
    const today = new Date().toISOString().split('T')[0]
    const next30Days = addDays(new Date(), 30).toISOString().split('T')[0]

    // Parallel fetch for speed
    const [
        { count: totalCustomers },
        { count: totalPolicies },
        { count: expiredPolicies },
        { count: duePolicies }
    ] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('agent_id', user.id),
        supabase.from('policies').select('*', { count: 'exact', head: true }).eq('agent_id', user.id),
        supabase.from('policies').select('*', { count: 'exact', head: true }).eq('agent_id', user.id).lt('expiry_date', today).neq('status', 'Renewed'),
        supabase.from('policies').select('*', { count: 'exact', head: true }).eq('agent_id', user.id).gte('expiry_date', today).lte('expiry_date', next30Days).eq('status', 'Active')
    ])

    return {
        totalCustomers: totalCustomers || 0,
        totalPolicies: totalPolicies || 0,
        expiredPolicies: expiredPolicies || 0,
        duePolicies: duePolicies || 0
    }
})

export const getUpcomingRenewals = cache(async (days: number = 30) => {
    const { supabase, user } = await getAuthenticatedUser()
    const today = new Date().toISOString().split('T')[0]

    // Check next 'days' days
    const nextDaysDate = addDays(new Date(), days).toISOString().split('T')[0]

    const { data } = await supabase
        .from('policies')
        .select('*, customers(name, phone), companies(name)')
        .eq('agent_id', user.id)
        .gte('expiry_date', today)
        .lte('expiry_date', nextDaysDate)
        .eq('status', 'Active')
        .order('expiry_date', { ascending: true })
        .limit(10) // Keep limit but filtered by range

    return data || []
})

export const getOverduePolicies = cache(async () => {
    const { supabase, user } = await getAuthenticatedUser()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('policies')
        .select('*, customers(name, phone), companies(name)')
        .eq('agent_id', user.id)
        .lt('expiry_date', today)
        .neq('status', 'Renewed')
        .order('expiry_date', { ascending: false }) // Most recently expired first
        .limit(10)

    return data || []
})

// Universal Search - searches across customers, policies, vehicle numbers, phone numbers
export async function universalSearch(query: string) {
    if (!query || query.trim().length < 2) {
        return { customers: [], policies: [] }
    }

    const { supabase, user } = await getAuthenticatedUser()
    const searchTerm = query.trim().toLowerCase()

    // Run all search queries in parallel for better performance
    const [
        { data: customers },
        { data: policies },
        { data: policiesByCustomerName },
        { data: policiesByCustomerCode }
    ] = await Promise.all([
        // 1. Search customers by name, phone, email, or customer_code
        supabase
            .from('customers')
            .select('id, name, phone, email, customer_code')
            .eq('agent_id', user.id)
            .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,customer_code.ilike.%${searchTerm}%`)
            .limit(5),

        // 2. Search policies by policy number or vehicle reg no
        supabase
            .from('policies')
            .select('id, policy_number, vehicle_reg_no, policy_type, expiry_date, status, customers(id, name, phone, customer_code), companies(name)')
            .eq('agent_id', user.id)
            .or(`policy_number.ilike.%${searchTerm}%,vehicle_reg_no.ilike.%${searchTerm}%`)
            .limit(5),

        // 3. Search policies by customer name match
        supabase
            .from('policies')
            .select('id, policy_number, vehicle_reg_no, policy_type, expiry_date, status, customers!inner(id, name, phone, customer_code), companies(name)')
            .eq('agent_id', user.id)
            .ilike('customers.name', `%${searchTerm}%`)
            .limit(5),

        // 4. Search policies by customer code match
        supabase
            .from('policies')
            .select('id, policy_number, vehicle_reg_no, policy_type, expiry_date, status, customers!inner(id, name, phone, customer_code), companies(name)')
            .eq('agent_id', user.id)
            .ilike('customers.customer_code', `%${searchTerm}%`)
            .limit(5)
    ])

    // Merge and deduplicate policies
    const allPolicies = [
        ...(policies || []),
        ...(policiesByCustomerName || []),
        ...(policiesByCustomerCode || [])
    ]
    const uniquePolicies = allPolicies.filter((policy, index, self) =>
        index === self.findIndex((p) => p.id === policy.id)
    ).slice(0, 8)

    return {
        customers: customers || [],
        policies: uniquePolicies
    }
}

// Revenue Dashboard Stats - Monthly collection and company breakdown
export const getRevenueStats = cache(async (range: string = '6M') => {
    const { supabase, user } = await getAuthenticatedUser()

    // Calculate start date based on range
    const now = new Date()
    const startDate = new Date()

    if (range === '1M') startDate.setMonth(now.getMonth() - 1)
    else if (range === '3M') startDate.setMonth(now.getMonth() - 3)
    else if (range === '6M') startDate.setMonth(now.getMonth() - 6)
    else if (range === '1Y') startDate.setFullYear(now.getFullYear() - 1)

    // Set to start of day needed? Using ISO string so it's precise time, maybe set to 00:00:00 for cleaner boundary
    startDate.setHours(0, 0, 0, 0)
    const startDateISO = startDate.toISOString()

    // Get all policies with premium and company info
    const { data: policies } = await supabase
        .from('policies')
        .select('premium_total, amount_paid, start_date, created_at, policy_type, companies(id, name)')
        .eq('agent_id', user.id)
        .gte('created_at', startDateISO) // Only fetch relevant data
        .order('created_at', { ascending: true })

    if (!policies) return { monthlyData: [], companyBreakdown: [], totalRevenue: 0, totalPolicies: 0 }

    // Aggregation logic
    const monthlyMap = new Map<string, { policies: number, revenue: number }>()
    const companyMap = new Map<string, { name: string, count: number, revenue: number }>()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    let totalRevenue = 0

    // Determine grouping key function
    const getKey = (dateString: string) => {
        const d = new Date(dateString)
        if (range === '1M') {
            // Daily grouping for 1M view: "12 Jan"
            return `${d.getDate()} ${months[d.getMonth()]}`
        }
        // Monthly grouping for others: "Jan 2025" or just "Jan" if year implies current year, but "Jan 25" is better
        // The chart expects simple names. Let's start with "Jan", "Feb" etc for 1Y/6M/3M
        // If strict '1Y' crosses year boundary, we receive 'Jan' twice? No, slice logic before handled it by reversing.
        // Better to use unique keys then map to display name.
        return `${months[d.getMonth()]} ${d.getFullYear()}`
    }

    // Pre-fill keys to ensure continuous line
    const fillKeys = () => {
        const current = new Date(startDate)
        const end = new Date()
        while (current <= end) {
            const key = getKey(current.toISOString())
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, { policies: 0, revenue: 0 })
            }
            // Increment
            if (range === '1M') current.setDate(current.getDate() + 1)
            else current.setMonth(current.getMonth() + 1)
        }
    }
    fillKeys()

    policies.forEach((policy: any) => {
        const dateStr = policy.created_at || policy.start_date
        const premium = parseFloat(policy.premium_total) || 0
        totalRevenue += premium

        // Time aggregation
        const timeKey = getKey(dateStr)
        // If key exists (it should from pre-fill, unless date logic slightly off), update it
        if (monthlyMap.has(timeKey)) {
            const entry = monthlyMap.get(timeKey)!
            entry.policies += 1
            entry.revenue += premium
        }

        // Company aggregation
        const companyName = policy.companies?.name || 'Unknown'
        const companyId = policy.companies?.id || 'unknown'
        if (!companyMap.has(companyId)) {
            companyMap.set(companyId, { name: companyName, count: 0, revenue: 0 })
        }
        const company = companyMap.get(companyId)!
        company.count += 1
        company.revenue += premium
    })

    // Convert to array
    // For 3M/6M/1Y we just show "Jan", "Feb". 1Y might overlap "Jan" (Jan 24 vs Jan 25).
    // Let's format the name for the chart:
    const monthlyData = Array.from(monthlyMap.entries())
        .map(([key, data]) => {
            // key is "12 Jan" or "Jan 2025"
            // If monthly, maybe show "Jan" or "Jan '25"
            let name = key
            if (range !== '1M') {
                const [m, y] = key.split(' ')
                name = m // Just month name for simplicity currently, but 1Y needs year distinction if crossing year boundary
                // Ideally charts handle unique names. 
                // Let's keep full key "Jan 2025" for uniqueness, but display might be truncated in chart XAxis if needed
                // Actually, the previous UI just showed "Jan", "Feb". Let's stick to "Jan" if within same year?
                // For 1Y, "Jan 24" and "Jan 25" are distinct.
                // Recharts XAxis can format ticks. Let's send "Jan 25" format essentially.
                name = `${m}` // Simplified for now to match UI expectation of short labels, relying on order
            }
            return { name, ...data }
        })

    const companyBreakdown = Array.from(companyMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

    // Policy Type Distribution (filtered by range too)
    const typeMap = new Map<string, number>()
    policies.forEach((policy: any) => {
        const type = policy.policy_type || 'Unknown'
        typeMap.set(type, (typeMap.get(type) || 0) + 1)
    })

    const policyDistribution = Array.from(typeMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

    return {
        monthlyData, // Now dynamic length based on range
        companyBreakdown,
        policyDistribution,
        totalRevenue,
        totalPolicies: policies.length
    }
})

// Get upcoming birthdays
export const getUpcomingBirthdays = cache(async () => {
    const { supabase, user } = await getAuthenticatedUser()

    // Get customers with date_of_birth
    const { data: customers } = await supabase
        .from('customers')
        .select('id, name, phone, date_of_birth')
        .eq('agent_id', user.id)
        .not('date_of_birth', 'is', null)

    if (!customers) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to midnight to avoid time issues

    const upcomingBirthdays = customers
        .map((customer: any) => {
            if (!customer.date_of_birth) return null

            // Robust parsing of YYYY-MM-DD or ISO string
            const dateStr = customer.date_of_birth.split('T')[0]
            const [y, m, d] = dateStr.split('-').map(Number)

            if (!y || !m || !d) return null

            const dob = new Date(y, m - 1, d) // Month is 0-indexed

            const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
            thisYearBirthday.setHours(0, 0, 0, 0)

            // If birthday passed this year (strictly less than today), check next year
            if (thisYearBirthday.getTime() < today.getTime()) {
                thisYearBirthday.setFullYear(today.getFullYear() + 1)
            }

            const daysUntil = Math.round((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            return {
                ...customer,
                daysUntil,
                birthdayDate: thisYearBirthday
            }
        })
        .filter((c: any) => c && c.daysUntil >= 0 && c.daysUntil <= 30) // Next 30 days
        .sort((a: any, b: any) => a.daysUntil - b.daysUntil)
        .slice(0, 10)

    return upcomingBirthdays
})


export const getExpiringNotifications = cache(async () => {
    const { supabase, user } = await getAuthenticatedUser()
    const today = new Date().toISOString().split('T')[0]
    const next7Days = addDays(new Date(), 7).toISOString().split('T')[0]

    const { data } = await supabase
        .from('policies')
        .select('id, policy_number, expiry_date, status, vehicle_reg_no, customers(name, phone)')
        .eq('agent_id', user.id)
        .gte('expiry_date', today)
        .lte('expiry_date', next7Days)
        .eq('status', 'Active')
        .order('expiry_date', { ascending: true })

    return data || []
})

export const getTodayRenewals = cache(async () => {
    const { supabase, user } = await getAuthenticatedUser()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('policies')
        .select('id, policy_number, vehicle_reg_no, customers(name, phone), companies(name)')
        .eq('agent_id', user.id)
        .eq('expiry_date', today)
        .eq('status', 'Active')

    return data || []
})

// Smart Customer Insights
export const getCustomerInsights = cache(async () => {
    const { supabase, user } = await getAuthenticatedUser()
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
    const thirtyDaysAgo = addDays(now, -30).toISOString().split('T')[0]

    const [
        { data: allPolicies },
        { data: topCustomersRaw },
        { data: missedRenewals },
        { count: thisMonthCount },
        { count: lastMonthCount }
    ] = await Promise.all([
        // All policies with company + premium info
        supabase.from('policies')
            .select('premium_total, companies(id, name), status, expiry_date')
            .eq('agent_id', user.id),

        // Top customers by policy count
        supabase.from('policies')
            .select('customer_id, premium_total, customers(id, name, phone)')
            .eq('agent_id', user.id)
            .eq('status', 'Active'),

        // Missed renewals: expired > 30 days ago, still not renewed
        supabase.from('policies')
            .select('id, policy_number, expiry_date, customers(name, phone)')
            .eq('agent_id', user.id)
            .lt('expiry_date', thirtyDaysAgo)
            .neq('status', 'Renewed')
            .order('expiry_date', { ascending: false })
            .limit(5),

        // This month policies
        supabase.from('policies')
            .select('id', { count: 'exact', head: true })
            .eq('agent_id', user.id)
            .gte('created_at', thisMonthStart),

        // Last month policies
        supabase.from('policies')
            .select('id', { count: 'exact', head: true })
            .eq('agent_id', user.id)
            .gte('created_at', lastMonthStart)
            .lte('created_at', lastMonthEnd),
    ])

    // 1. Company Market Share
    const companyMap = new Map<string, { name: string; count: number; revenue: number }>()
    allPolicies?.forEach((p: any) => {
        const co = p.companies
        if (!co) return
        const existing = companyMap.get(co.id) || { name: co.name, count: 0, revenue: 0 }
        existing.count++
        existing.revenue += p.premium_total || 0
        companyMap.set(co.id, existing)
    })
    const marketShare = Array.from(companyMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(c => ({ ...c, revenue: Math.round(c.revenue) }))

    // 2. Top Customers by premium
    const customerMap = new Map<string, { name: string; phone: string; premium: number; count: number }>()
    topCustomersRaw?.forEach((p: any) => {
        const cu = p.customers
        if (!cu) return
        const existing = customerMap.get(cu.id) || { name: cu.name, phone: cu.phone, premium: 0, count: 0 }
        existing.premium += p.premium_total || 0
        existing.count++
        customerMap.set(cu.id, existing)
    })
    const topCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.premium - a.premium)
        .slice(0, 5)
        .map(c => ({ ...c, premium: Math.round(c.premium) }))

    // 3. Month-over-Month Growth
    const growth = lastMonthCount && lastMonthCount > 0
        ? Math.round(((thisMonthCount || 0) - lastMonthCount) / lastMonthCount * 100)
        : (thisMonthCount || 0) > 0 ? 100 : 0

    return {
        marketShare,
        topCustomers,
        missedRenewals: missedRenewals || [],
        growth: { thisMonth: thisMonthCount || 0, lastMonth: lastMonthCount || 0, percent: growth }
    }
})
