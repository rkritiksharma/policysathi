'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReminder(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const customer_id = formData.get('customer_id') as string
    const policy_id = formData.get('policy_id') as string || null
    const type = formData.get('type') as string
    const date = formData.get('date') as string
    const message = formData.get('message') as string

    const { error } = await supabase.from('reminders').insert({
        agent_id: user.id,
        customer_id,
        policy_id,
        reminder_type: type,
        scheduled_for: new Date(date).toISOString(),
        message_preview: message,
        channel: 'WhatsApp', // Default for now
        status: 'pending'
    })

    if (error) {
        return { error: 'Failed to create reminder' }
    }

    revalidatePath('/dashboard')
    return { success: 'Reminder scheduled' }
}

export async function checkExpiringPoliciesManual() {
    // This is a manual trigger for the logic that would normally be a cron job
    // Useful for testing or if pg_cron is not available on free tier
    const supabase = await createClient()

    // We can't call PL/pgSQL functions easily via client if they are not exposed via RPC 
    // So we'll replicate the logic in TS for the manual trigger button

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const today = new Date()
    const warningDays = [30, 7, 0] // 30 days, 7 days, 0 days

    let count = 0

    for (const days of warningDays) {
        const targetDate = new Date()
        targetDate.setDate(today.getDate() + days)
        const targetDateStr = targetDate.toISOString().split('T')[0]

        const { data: policies } = await supabase
            .from('policies')
            .select(`
                id, policy_number, expiry_date, policy_type,
                customers (id, name, phone)
            `)
            .eq('agent_id', user.id)
            .eq('status', 'Active')
            .eq('expiry_date', targetDateStr)

        if (policies && policies.length > 0) {
            for (const p of policies) {
                // Check if reminder already exists
                const { data: existing } = await supabase
                    .from('reminders')
                    .select('id')
                    .eq('policy_id', p.id)
                    .eq('reminder_type', 'Renewal')
                    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Created in last 24h

                if (!existing || existing.length === 0) {
                    const msg = days === 0
                        ? `FINAL REMINDER: Policy ${p.policy_number} expires TODAY.`
                        : `Renewal Reminder: Policy ${p.policy_number} expires in ${days} days.`

                    await supabase.from('reminders').insert({
                        agent_id: user.id,
                        customer_id: Array.isArray(p.customers) ? p.customers[0]?.id : (p.customers as any)?.id,
                        policy_id: p.id,
                        reminder_type: 'Renewal',
                        scheduled_for: new Date().toISOString(),
                        message_preview: msg,
                        channel: 'WhatsApp',
                        status: 'pending',
                        is_automated: true
                    })
                    count++
                }
            }
        }
    }

    revalidatePath('/dashboard')
    return { success: `Generated ${count} reminders` }
}
