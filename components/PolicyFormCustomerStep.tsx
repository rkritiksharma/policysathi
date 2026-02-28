import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from 'lucide-react'
import { AddCustomerModal } from './AddCustomerModal'
import { AddCompanyModal } from './AddCompanyModal'

export default function PolicyFormCustomerStep({
    customers: initialCustomers,
    companies: initialCompanies,
    formData,
    handleInputChange,
    setFormData
}: any) {
    const [customers, setCustomers] = useState(initialCustomers)
    const [companies, setCompanies] = useState(initialCompanies)

    // Sync if props change via Server Actions revalidation
    useEffect(() => {
        setCustomers(initialCustomers)
    }, [initialCustomers])

    useEffect(() => {
        setCompanies(initialCompanies)
    }, [initialCompanies])

    const handleCustomerAdded = (newCustomer: any) => {
        setCustomers((prev: any) => [...prev, newCustomer])
        setFormData((prev: any) => ({ ...prev, customer_id: newCustomer.id }))
    }

    const handleCompanyAdded = (newCompany: any) => {
        setCompanies((prev: any) => [...prev, newCompany])
        setFormData((prev: any) => ({ ...prev, company_id: newCompany.id }))
    }

    return (
        <div className="p-8 transition-all duration-300">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <User className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Customer & Company</h2>
                <p className="text-gray-500 mt-2">Select customer and insurance company</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <Label className="text-base font-medium">Customer <span className="text-red-500">*</span></Label>
                        <AddCustomerModal onCustomerAdded={handleCustomerAdded} />
                    </div>
                    <Select
                        name="customer_id"
                        required
                        value={formData.customer_id}
                        onValueChange={(val) => setFormData((prev: any) => ({ ...prev, customer_id: val }))}
                    >
                        <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                            {customers?.map((c: any) => (
                                <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <Label className="text-base font-medium">Insurance Company <span className="text-red-500">*</span></Label>
                        <AddCompanyModal onCompanyAdded={handleCompanyAdded} />
                    </div>
                    <Select
                        name="company_id"
                        required
                        value={formData.company_id}
                        onValueChange={(val) => setFormData((prev: any) => ({ ...prev, company_id: val }))}
                    >
                        <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                            {companies?.map((c: any) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-medium">Policy Number <span className="text-red-500">*</span></Label>
                    <Input
                        id="policy_number"
                        name="policy_number"
                        placeholder="e.g. POL-123456789"
                        required
                        className="h-12 text-base bg-gray-50 font-mono"
                        value={formData.policy_number}
                        onChange={handleInputChange}
                        suppressHydrationWarning
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-medium">Policy Type</Label>
                    <Select
                        name="policy_type"
                        value={formData.policy_type}
                        onValueChange={(val) => setFormData((prev: any) => ({ ...prev, policy_type: val }))}
                    >
                        <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Car">🚗 Car - Comprehensive</SelectItem>
                            <SelectItem value="Bike">🏍️ Bike - Comprehensive</SelectItem>
                            <SelectItem value="CarTP">🚗 Car - Third Party</SelectItem>
                            <SelectItem value="BikeTP">🏍️ Bike - Third Party</SelectItem>
                            <SelectItem value="Health">🏥 Health</SelectItem>
                            <SelectItem value="Fire">🔥 Fire</SelectItem>
                            <SelectItem value="Commercial">🚛 Commercial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
