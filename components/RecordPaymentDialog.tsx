'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Wallet, Loader2 } from 'lucide-react'
import { recordPayment } from '@/app/(dashboard)/payments/actions'

interface RecordPaymentDialogProps {
    policyId: string
    policyNumber: string
    customerName: string
    premiumTotal: number
    amountPaid: number
    onSuccess?: () => void
}

export function RecordPaymentDialog({
    policyId,
    policyNumber,
    customerName,
    premiumTotal,
    amountPaid,
    onSuccess
}: RecordPaymentDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const amountDue = premiumTotal - amountPaid

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        formData.append('policy_id', policyId)

        const result = await recordPayment(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setLoading(false)
            setOpen(false)
            onSuccess?.()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2" suppressHydrationWarning>
                    <Wallet className="h-4 w-4" />
                    Record Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                </DialogHeader>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">Customer:</span>
                            <p className="font-medium">{customerName}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Policy:</span>
                            <p className="font-medium">{policyNumber}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Total Premium:</span>
                            <p className="font-medium">₹{premiumTotal.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Amount Due:</span>
                            <p className="font-bold text-red-600">₹{amountDue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount *</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="0"
                                max={amountDue}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_date">Date *</Label>
                            <Input
                                id="payment_date"
                                name="payment_date"
                                type="date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment_mode">Payment Mode *</Label>
                        <Select name="payment_mode" required>
                            <SelectTrigger suppressHydrationWarning>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                                <SelectItem value="Cheque">Cheque</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference_no">Reference No.</Label>
                        <Input
                            id="reference_no"
                            name="reference_no"
                            placeholder="Transaction ID / Cheque No."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Optional notes..."
                            rows={2}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Record Payment
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
