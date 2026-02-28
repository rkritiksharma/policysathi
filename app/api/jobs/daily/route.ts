
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addDays } from 'date-fns'
import { sendNotification } from '@/lib/notifications'

// This route should be secured by a secret key in production
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // For MVP/Demo, you might skip this or use a simple env var
        // return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const remindersToSend = []

    // 1. Check Renewals (30, 15, 7, 1 days)
    const daysToCheck = [30, 15, 7, 1]

    for (const days of daysToCheck) {
        const targetDate = addDays(new Date(), days).toISOString().split('T')[0]

        const { data: policies } = await supabase
            .from('policies')
            .select('*, customers(*), agents(*)')
            .eq('expiry_date', targetDate)
            .eq('status', 'Active')

        if (policies) {
            for (const policy of policies) {
                remindersToSend.push({
                    type: `renewal_${days}`,
                    policy,
                    message: `Hello ${policy.customers.name}, your policy ${policy.policy_number} expires in ${days} days on ${policy.expiry_date}. Please renew.`
                })
            }
        }
    }

    // 2. Check Overdue (expired yesterday and active)
    const yesterday = addDays(new Date(), -1).toISOString().split('T')[0]
    const { data: overduePolicies } = await supabase
        .from('policies')
        .select('*, customers(*), agents(*)')
        .eq('expiry_date', yesterday)
        .eq('status', 'Active') // Technically expired now, but status might still be Active in DB until updated

    if (overduePolicies) {
        for (const policy of overduePolicies) {
            remindersToSend.push({
                type: `overdue`,
                policy,
                message: `Hello ${policy.customers.name}, your policy ${policy.policy_number} expired yesterday. Please renew immediately to avoid penalties.`
            })
            // Also update status to Expired?
            await supabase.from('policies').update({ status: 'Expired' }).eq('id', policy.id)
        }
    }

    // 3. Process Reminders
    const results = { success: 0, failed: 0 }

    for (const item of remindersToSend) {
        const { policy, message, type } = item
        const customer = policy.customers

        // Log in DB
        const { data: reminder, error } = await supabase.from('reminders').insert({
            agent_id: policy.agent_id,
            customer_id: policy.customer_id,
            policy_id: policy.id,
            reminder_type: type,
            channel: 'whatsapp', // Default for now
            scheduled_for: new Date().toISOString(),
            message_preview: message,
            status: 'pending'
        }).select().single()

        if (error) {
            console.error('Failed to create reminder log', error)
            continue
        }

        // Send (Mock)
        const sent = await sendNotification(customer.phone, message, 'whatsapp')

        if (sent) {
            await supabase.from('reminders').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', reminder.id)
            results.success++
        } else {
            await supabase.from('reminders').update({ status: 'failed' }).eq('id', reminder.id)
            results.failed++
        }
    }

    return NextResponse.json({
        message: 'Job completed',
        processed: remindersToSend.length,
        results
    })
}
