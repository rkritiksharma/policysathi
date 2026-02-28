
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SettingsForm } from "@/components/SettingsForm"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch agent details
    const { data: agent } = await supabase.from('agents').select('*').eq('id', user?.id).single()

    const defaultTemplates = {
        renewal: "Dear {customer_name}, your {policy_type} policy for {vehicle_no} is expiring on {expiry_date}. Please renew now to avoid penalty. Call {agent_name} at {agent_phone}.",
        welcome: "Welcome to PolicySathi, {customer_name}! Thank you for choosing us for your insurance needs.",
        payment_full: `Namaste {customer_name}! 🙏

Aapki {policy_type} policy ({policy_number}) ka payment ₹{amount_due} pending hai.

📋 Policy: {vehicle_no}
💵 Due Amount: ₹{amount_due}

Jaldi payment karein aur apni policy active rakhein!

Contact: {agent_name}
📞 {agent_phone}`,
        payment_partial: `Namaste {customer_name}! 🙏

Aapki policy {policy_number} ka partial payment received - Thank you! ✅

📋 Policy: {vehicle_no}
💵 Total Premium: ₹{premium_total}
✅ Paid: ₹{amount_paid}
⚠️ Balance Due: ₹{balance_due}

Baaki amount jaldi clear karein.

Contact: {agent_name}
📞 {agent_phone}`,
        payment_thanks: `Namaste {customer_name}! 🙏

Aapka payment ₹{amount} successfully receive ho gaya! ✅

📋 Policy: {policy_number}
💳 Mode: {payment_mode}
🔖 Ref: {reference_no}

Thank you for trusting {agent_name}! 🎉`
    }

    // Try to get saved templates from agent metadata
    const savedTemplates = agent?.settings?.templates || defaultTemplates
    const savedReminders = agent?.settings?.reminders || { day30: true, day15: true, day7: true, day1: true }
    const autoRemindEnabled = agent?.settings?.auto_remind !== false

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Settings</h1>
                <p className="text-sm text-gray-500 font-medium">Configure your preferences and templates</p>
            </div>

            <SettingsForm
                defaultTemplates={defaultTemplates}
                savedTemplates={savedTemplates}
                savedReminders={savedReminders}
                autoRemindEnabled={autoRemindEnabled}
            />
        </div>
    )
}
