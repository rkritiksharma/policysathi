'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { Save, RotateCcw, Loader2 } from 'lucide-react'

interface SettingsFormProps {
    defaultTemplates: Record<string, string>
    savedTemplates: Record<string, string>
    savedReminders: { day30: boolean; day15: boolean; day7: boolean; day1: boolean }
    autoRemindEnabled: boolean
}

export function SettingsForm({ defaultTemplates, savedTemplates, savedReminders, autoRemindEnabled }: SettingsFormProps) {
    const [templates, setTemplates] = useState(savedTemplates)
    const [reminders, setReminders] = useState(savedReminders)
    const [autoRemind, setAutoRemind] = useState(autoRemindEnabled)
    const [saving, setSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    const updateTemplate = (key: string, value: string) => {
        setTemplates(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const updateReminder = (key: string, value: boolean) => {
        setReminders(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Save to localStorage for now (until settings table is created)
            localStorage.setItem('policysathi_settings', JSON.stringify({
                templates,
                reminders,
                auto_remind: autoRemind
            }))
            setHasChanges(false)
            toast.success('Settings saved successfully! ✅')
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        setTemplates(defaultTemplates)
        setReminders({ day30: true, day15: true, day7: true, day1: true })
        setAutoRemind(true)
        setHasChanges(true)
        toast.info('Templates reset to defaults. Click Save to apply.')
    }

    return (
        <div className="grid gap-6">
            {/* Automation Preferences */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Automation Preferences</CardTitle>
                    <CardDescription>Configure when to send automatic reminders to customers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${autoRemind ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                            onClick={() => { setAutoRemind(!autoRemind); setHasChanges(true) }}
                        >
                            <div>
                                <Label htmlFor="auto_remind" className={`text-base font-semibold cursor-pointer ${autoRemind ? 'text-green-900' : 'text-gray-600'}`}>
                                    Enable Daily Auto-Reminders
                                </Label>
                                <p className={`text-xs ${autoRemind ? 'text-green-700' : 'text-gray-500'}`}>
                                    System will automatically send WhatsApp messages at 10:00 AM
                                </p>
                            </div>
                            <div className={`text-sm font-bold px-3 py-1 rounded border ${autoRemind
                                ? 'text-green-700 border-green-300 bg-white'
                                : 'text-gray-500 border-gray-300 bg-white'
                                }`}>
                                {autoRemind ? 'ACTIVE' : 'DISABLED'}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">Send reminders before:</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { key: 'day30', label: '30 Days' },
                                    { key: 'day15', label: '15 Days' },
                                    { key: 'day7', label: '7 Days' },
                                    { key: 'day1', label: '1 Day' },
                                ].map(item => (
                                    <label key={item.key} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={reminders[item.key as keyof typeof reminders]}
                                            onChange={(e) => updateReminder(item.key, e.target.checked)}
                                            className="h-4 w-4 accent-primary"
                                        />
                                        <span className="text-sm">{item.label}</span>
                                    </label>
                                ))}
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
                            value={templates.renewal}
                            onChange={(e) => updateTemplate('renewal', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            Variables: {'{customer_name}, {policy_type}, {vehicle_no}, {expiry_date}, {agent_name}, {agent_phone}'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="template_welcome">👋 Welcome Message</Label>
                        <Textarea
                            id="template_welcome"
                            className="bg-gray-50 font-mono text-sm"
                            value={templates.welcome}
                            onChange={(e) => updateTemplate('welcome', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="template_payment_full" className="text-amber-700">💰 Payment Due Reminder (Full Amount)</Label>
                        <Textarea
                            id="template_payment_full"
                            className="min-h-[100px] bg-amber-50 font-mono text-sm border-amber-200"
                            value={templates.payment_full}
                            onChange={(e) => updateTemplate('payment_full', e.target.value)}
                        />
                        <p className="text-xs text-amber-600">
                            Variables: {'{customer_name}, {policy_type}, {policy_number}, {vehicle_no}, {amount_due}, {agent_name}, {agent_phone}'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="template_payment_partial" className="text-orange-700">⏳ Partial Payment Reminder</Label>
                        <Textarea
                            id="template_payment_partial"
                            className="min-h-[100px] bg-orange-50 font-mono text-sm border-orange-200"
                            value={templates.payment_partial}
                            onChange={(e) => updateTemplate('payment_partial', e.target.value)}
                        />
                        <p className="text-xs text-orange-600">
                            Variables: {'{customer_name}, {policy_number}, {vehicle_no}, {premium_total}, {amount_paid}, {balance_due}, {agent_name}, {agent_phone}'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="template_payment_thanks" className="text-green-700">✅ Payment Received Confirmation</Label>
                        <Textarea
                            id="template_payment_thanks"
                            className="bg-green-50 font-mono text-sm border-green-200"
                            value={templates.payment_thanks}
                            onChange={(e) => updateTemplate('payment_thanks', e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <div>
                            {hasChanges && (
                                <span className="text-sm text-amber-600 font-medium animate-pulse">● Unsaved changes</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleReset} className="gap-2">
                                <RotateCcw className="h-4 w-4" /> Reset to Defaults
                            </Button>
                            <Button onClick={handleSave} disabled={saving || !hasChanges} className="bg-primary hover:bg-primary/90 gap-2">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Settings
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
