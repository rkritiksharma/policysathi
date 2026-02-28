import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IndianRupee, CreditCard } from 'lucide-react'

export default function PolicyFormPremiumStep({ formData, handleInputChange, setFormData }: any) {
    return (
        <div className="p-8 transition-all duration-300">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <IndianRupee className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Premium & Payment</h2>
                <p className="text-gray-500 mt-2">Set policy dates and payment details</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Start Date <span className="text-red-500">*</span></Label>
                        <Input
                            id="start_date"
                            name="start_date"
                            type="date"
                            required
                            className="h-12 text-base bg-gray-50"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            suppressHydrationWarning
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Expiry Date <span className="text-red-500">*</span></Label>
                        <Input
                            id="expiry_date"
                            name="expiry_date"
                            type="date"
                            required
                            className="h-12 text-base bg-gray-50"
                            value={formData.expiry_date}
                            onChange={handleInputChange}
                            suppressHydrationWarning
                        />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                    <h3 className="font-semibold text-gray-700">Premium Breakdown</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label className="text-sm text-gray-500">OD Premium</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                                <Input id="premium_od" name="premium_od" type="text" inputMode="numeric" pattern="[0-9]*" className="pl-8 h-11 bg-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm text-gray-500">TP Premium</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                                <Input id="premium_tp" name="premium_tp" type="text" inputMode="numeric" pattern="[0-9]*" className="pl-8 h-11 bg-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-bold text-gray-900">Total <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-primary font-bold">₹</span>
                                <Input
                                    id="premium_total"
                                    name="premium_total"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    className="pl-8 h-11 bg-white border-primary/30 font-bold text-lg"
                                    value={formData.premium_total}
                                    onChange={handleInputChange}
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-4">
                    <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" /> Payment Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Status</Label>
                            <Select
                                name="payment_status"
                                value={formData.payment_status}
                                onValueChange={(val) => {
                                    setFormData((prev: any) => {
                                        let newAmount = prev.amount_paid;
                                        if (val === 'paid') newAmount = prev.premium_total;
                                        else if (val === 'due') newAmount = '0';
                                        else if (val === 'partial') newAmount = ''; // Reset for user input

                                        return {
                                            ...prev,
                                            payment_status: val,
                                            amount_paid: newAmount
                                        }
                                    })
                                }}
                            >
                                <SelectTrigger className="h-11 bg-white border-amber-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="paid">✅ Fully Paid</SelectItem>
                                    <SelectItem value="partial">⏳ Partial</SelectItem>
                                    <SelectItem value="due">❌ Due</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Mode</Label>
                            <Select name="payment_mode" defaultValue="Cash">
                                <SelectTrigger className="h-11 bg-white border-amber-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">💵 Cash</SelectItem>
                                    <SelectItem value="UPI">📱 UPI</SelectItem>
                                    <SelectItem value="Card">💳 Card</SelectItem>
                                    <SelectItem value="Cheque">📝 Cheque</SelectItem>
                                    <SelectItem value="Bank Transfer">🏦 Bank</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Amount Paid</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                                <Input
                                    id="amount_paid"
                                    name="amount_paid"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="0"
                                    value={formData.amount_paid}
                                    onChange={handleInputChange}
                                    className="pl-8 h-11 bg-white border-amber-200"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-sm font-medium">Reference</Label>
                            <Input
                                id="payment_reference"
                                name="payment_reference"
                                placeholder="UPI ID / Cheque No."
                                className="h-11 bg-white border-amber-200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
