
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { revalidatePath } from 'next/cache'


export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch agent details
    const { data: agent } = await supabase.from('agents').select('*').eq('id', user?.id).single()

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Settings</h1>
                <p className="text-sm text-gray-500 font-medium">Configure your preferences and templates</p>
            </div>

            <div className="grid gap-6">
                {/* Automation Preferences */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Automation Preferences</CardTitle>
                        <CardDescription>Configure when to send automatic reminders to customers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                <div>
                                    <Label htmlFor="auto_remind" className="text-base font-semibold text-green-900">Enable Daily Auto-Reminders</Label>
                                    <p className="text-xs text-green-700">System will automatically send WhatsApp messages at 10:00 AM</p>
                                </div>
                                <div className="text-sm font-bold text-green-700 border border-green-300 px-3 py-1 rounded bg-white">ACTIVE</div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700">Send reminders before:</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50">
                                        <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                                        <span className="text-sm">30 Days</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50">
                                        <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                                        <span className="text-sm">15 Days</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50">
                                        <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                                        <span className="text-sm">7 Days</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50">
                                        <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                                        <span className="text-sm">1 Day</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Message Templates */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Message Templates</CardTitle>
                        <CardDescription>Customize the content of WhatsApp/SMS messages sent to customers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="template_renewal">🔄 Renewal Reminder Template</Label>
                            <Textarea
                                id="template_renewal"
                                className="min-h-[100px] bg-gray-50 font-mono text-sm"
                                defaultValue="Dear {customer_name}, your {policy_type} policy for {vehicle_no} is expiring on {expiry_date}. Please renew now to avoid penalty. Call {agent_name} at {agent_phone}."
                            />
                            <p className="text-xs text-gray-500">Available variables: {'{customer_name}, {policy_type}, {vehicle_no}, {expiry_date}, {agent_name}, {agent_phone}'}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template_welcome">👋 Welcome Message</Label>
                            <Textarea
                                id="template_welcome"
                                className="bg-gray-50 font-mono text-sm"
                                defaultValue="Welcome to PolicySathi, {customer_name}! Thank you for choosing us for your insurance needs."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template_payment_full" className="text-amber-700">💰 Payment Due Reminder (Full Amount)</Label>
                            <Textarea
                                id="template_payment_full"
                                className="min-h-[100px] bg-amber-50 font-mono text-sm border-amber-200"
                                defaultValue="Namaste {customer_name}! 🙏

Aapki {policy_type} policy ({policy_number}) ka payment ₹{amount_due} pending hai.

📋 Policy: {vehicle_no}
💵 Due Amount: ₹{amount_due}

Jaldi payment karein aur apni policy active rakhein!

Contact: {agent_name}
📞 {agent_phone}"
                            />
                            <p className="text-xs text-amber-600">Variables: {'{customer_name}, {policy_type}, {policy_number}, {vehicle_no}, {amount_due}, {agent_name}, {agent_phone}'}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template_payment_partial" className="text-orange-700">⏳ Partial Payment Reminder</Label>
                            <Textarea
                                id="template_payment_partial"
                                className="min-h-[100px] bg-orange-50 font-mono text-sm border-orange-200"
                                defaultValue="Namaste {customer_name}! 🙏

Aapki policy {policy_number} ka partial payment received - Thank you! ✅

📋 Policy: {vehicle_no}
💵 Total Premium: ₹{premium_total}
✅ Paid: ₹{amount_paid}
⚠️ Balance Due: ₹{balance_due}

Baaki amount jaldi clear karein.

Contact: {agent_name}
📞 {agent_phone}"
                            />
                            <p className="text-xs text-orange-600">Variables: {'{customer_name}, {policy_number}, {vehicle_no}, {premium_total}, {amount_paid}, {balance_due}, {agent_name}, {agent_phone}'}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template_payment_thanks" className="text-green-700">✅ Payment Received Confirmation</Label>
                            <Textarea
                                id="template_payment_thanks"
                                className="bg-green-50 font-mono text-sm border-green-200"
                                defaultValue="Namaste {customer_name}! 🙏

Aapka payment ₹{amount} successfully receive ho gaya! ✅

📋 Policy: {policy_number}
💳 Mode: {payment_mode}
🔖 Ref: {reference_no}

Thank you for trusting {agent_name}! 🎉"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button variant="outline" className="mr-2">Reset to Defaults</Button>
                            <Button className="bg-primary hover:bg-primary/90">Save Templates</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
