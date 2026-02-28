'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Payment {
    id: string
    policy_id: string
    agent_id: string
    amount: number
    payment_date: string
    payment_mode: string
    reference_no: string | null
    notes: string | null
    created_at: string
}

export interface PolicyWithPayment {
    id: string
    policy_number: string
    policy_type: string
    premium_total: number
    payment_status: string
    amount_paid: number
    customer: {
        id: string
        name: string
        phone: string
    }
    company: {
        id: string
        name: string
    } | null
    expiry_date: string
}

// Get policies for payment overview based on filter
export async function getFilteredPayments(filter: string = 'due') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated', policies: [] }

    let query = supabase
        .from('policies')
        .select(`
            id,
            policy_number,
            policy_type,
            premium_total,
            payment_status,
            amount_paid,
            expiry_date,
            customer:customers(id, name, phone),
            company:companies(id, name)
        `)
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })

    // Apply filters based on URL parameter
    if (filter === 'due') {
        query = query.in('payment_status', ['due', 'partial'])
    } else if (filter === 'paid') {
        query = query.eq('payment_status', 'paid')
    } else if (filter === 'partial') {
        query = query.eq('payment_status', 'partial')
    } else if (filter === 'collected') {
        // Show everything that has at least some payment collected
        query = query.gt('amount_paid', 0)
    }
    // if filter === 'all', no status filter is applied

    const { data, error } = await query

    if (error) {
        console.error('Error fetching due payments:', error)
        return { error: error.message, policies: [] }
    }

    return { policies: data || [], error: null }
}

// Get all policies for payment overview
export async function getAllPoliciesPaymentStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated', policies: [] }

    const { data, error } = await supabase
        .from('policies')
        .select(`
            id,
            policy_number,
            policy_type,
            premium_total,
            payment_status,
            amount_paid,
            expiry_date,
            customer:customers(id, name, phone),
            company:companies(id, name)
        `)
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching policies:', error)
        return { error: error.message, policies: [] }
    }

    return { policies: data || [], error: null }
}

// Get payment history for a policy
export async function getPaymentHistory(policyId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated', payments: [] }

    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('policy_id', policyId)
        .eq('agent_id', user.id)
        .order('payment_date', { ascending: false })

    if (error) {
        console.error('Error fetching payment history:', error)
        return { error: error.message, payments: [] }
    }

    return { payments: data || [], error: null }
}

// Record a new payment
export async function recordPayment(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const policyId = formData.get('policy_id') as string
    const amount = parseFloat(formData.get('amount') as string)
    const paymentMode = formData.get('payment_mode') as string
    const referenceNo = formData.get('reference_no') as string || null
    const paymentDate = formData.get('payment_date') as string
    const notes = formData.get('notes') as string || null

    // Get current policy info
    const { data: policy, error: policyError } = await supabase
        .from('policies')
        .select('premium_total, amount_paid')
        .eq('id', policyId)
        .single()

    if (policyError || !policy) {
        return { error: 'Policy not found' }
    }

    const currentPaid = policy.amount_paid || 0
    const newAmountPaid = currentPaid + amount
    const premiumTotal = policy.premium_total || 0

    // Determine new payment status
    let newStatus = 'due'
    if (newAmountPaid >= premiumTotal) {
        newStatus = 'paid'
    } else if (newAmountPaid > 0) {
        newStatus = 'partial'
    }

    // Insert payment record
    const { error: paymentError } = await supabase
        .from('payments')
        .insert({
            agent_id: user.id,
            policy_id: policyId,
            amount,
            payment_date: paymentDate,
            payment_mode: paymentMode,
            reference_no: referenceNo,
            notes
        })

    if (paymentError) {
        console.error('Error recording payment:', paymentError)
        return { error: paymentError.message }
    }

    // Update policy payment status
    const { error: updateError } = await supabase
        .from('policies')
        .update({
            amount_paid: newAmountPaid,
            payment_status: newStatus
        })
        .eq('id', policyId)

    if (updateError) {
        console.error('Error updating policy:', updateError)
        return { error: updateError.message }
    }

    revalidatePath('/payments')
    revalidatePath('/policies')
    return { success: true }
}

// Get payment summary stats
export async function getPaymentStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated', stats: null }

    const { data: policies, error } = await supabase
        .from('policies')
        .select('premium_total, amount_paid, payment_status')
        .eq('agent_id', user.id)

    if (error) {
        return { error: error.message, stats: null }
    }

    const stats = {
        totalPremium: 0,
        totalCollected: 0,
        totalDue: 0,
        paidPolicies: 0,
        partialPolicies: 0,
        duePolicies: 0
    }

    policies?.forEach(policy => {
        const premium = policy.premium_total || 0
        const paid = policy.amount_paid || 0

        stats.totalPremium += premium
        stats.totalCollected += paid
        stats.totalDue += (premium - paid)

        if (policy.payment_status === 'paid') stats.paidPolicies++
        else if (policy.payment_status === 'partial') stats.partialPolicies++
        else stats.duePolicies++
    })

    return { stats, error: null }
}
