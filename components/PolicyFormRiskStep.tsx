import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, User, Sparkles } from 'lucide-react'

export default function PolicyFormRiskStep({ formData, handleInputChange, setFormData }: any) {
    return (
        <div className="p-8 transition-all duration-300">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
                    {formData.policy_type === 'Health' ? (
                        <User className="h-8 w-8" />
                    ) : formData.policy_type === 'Fire' ? (
                        <Sparkles className="h-8 w-8" />
                    ) : (
                        <Car className="h-8 w-8" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {formData.policy_type === 'Health' ? 'Insured Details' :
                        formData.policy_type === 'Fire' ? 'Property Details' :
                            'Vehicle Details'}
                </h2>
                <p className="text-gray-500 mt-2">
                    {formData.policy_type === 'Health' ? 'Enter members and coverage details' :
                        formData.policy_type === 'Fire' ? 'Enter property address and asset values' :
                            'Enter vehicle registration and specifications'}
                </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">

                {/* MOTOR POLICIES */}
                {['Car', 'Bike', 'Commercial', 'CarTP', 'BikeTP'].includes(formData.policy_type) && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-base font-medium">Registration No.</Label>
                                <Input
                                    id="vehicle_reg_no"
                                    name="vehicle_reg_no"
                                    placeholder="MH12AB1234"
                                    className="h-12 text-base uppercase bg-gray-50 font-mono"
                                    value={formData.vehicle_reg_no}
                                    onChange={handleInputChange}
                                    suppressHydrationWarning
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-medium">Model</Label>
                                <Input
                                    id="vehicle_model"
                                    name="vehicle_model"
                                    placeholder="Swift, i20, etc."
                                    className="h-12 text-base bg-gray-50"
                                    value={formData.vehicle_model}
                                    onChange={handleInputChange}
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-base font-medium">Make</Label>
                                <Select name="vehicle_make" value={formData.vehicle_make} onValueChange={(v) => setFormData((p: any) => ({ ...p, vehicle_make: v }))}>
                                    <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Maruti">Maruti Suzuki</SelectItem>
                                        <SelectItem value="Hyundai">Hyundai</SelectItem>
                                        <SelectItem value="Tata">Tata Motors</SelectItem>
                                        <SelectItem value="Mahindra">Mahindra</SelectItem>
                                        <SelectItem value="Honda">Honda</SelectItem>
                                        <SelectItem value="Toyota">Toyota</SelectItem>
                                        <SelectItem value="Kia">Kia</SelectItem>
                                        <SelectItem value="MG">MG Motor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-medium">Year</Label>
                                <Select name="vehicle_year" value={formData.vehicle_year} onValueChange={(v) => setFormData((p: any) => ({ ...p, vehicle_year: v }))}>
                                    <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(year => (
                                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-medium">Fuel Type</Label>
                            <div className="grid grid-cols-4 gap-3">
                                {['Petrol', 'Diesel', 'CNG', 'Electric'].map(fuel => (
                                    <label key={fuel} className="relative cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fuel_type"
                                            value={fuel}
                                            checked={formData.fuel_type === fuel}
                                            onChange={(e) => setFormData((p: any) => ({ ...p, fuel_type: e.target.value }))}
                                            className="peer sr-only"
                                        />
                                        <div className="flex items-center justify-center h-12 rounded-lg border-2 border-gray-200 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all font-medium">
                                            {fuel}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* HEALTH POLICY */}
                {formData.policy_type === 'Health' && (
                    <>
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Sum Insured <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                                <Input
                                    id="sum_insured"
                                    name="sum_insured"
                                    type="number"
                                    placeholder="500000"
                                    className="pl-8 h-12 text-base bg-gray-50"
                                    value={formData.sum_insured || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-medium">TPA (Third Party Administrator)</Label>
                            <Input
                                id="tpa"
                                name="tpa"
                                placeholder="e.g. Vidal Health, MediAssist"
                                className="h-12 text-base bg-gray-50"
                                value={formData.tpa || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Insured Members (JSON for now)</Label>
                            <textarea
                                name="health_members_json"
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[100px]"
                                placeholder='[{"name": "John Doe", "age": 35, "relation": "Self"}]'
                                value={formData.health_members_json || ''}
                                onChange={(e) => setFormData((p: any) => ({ ...p, health_members_json: e.target.value }))}
                            />
                            <p className="text-xs text-gray-500">Enter simple JSON or comma separated names</p>
                        </div>
                    </>
                )}

                {/* FIRE POLICY */}
                {formData.policy_type === 'Fire' && (
                    <>
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Property Address <span className="text-red-500">*</span></Label>
                            <textarea
                                name="property_address"
                                required
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[80px]"
                                placeholder="Full address of the insured property"
                                value={formData.property_address || ''}
                                onChange={(e) => setFormData((p: any) => ({ ...p, property_address: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Occupancy Type</Label>
                            <Select
                                name="occupancy_type"
                                value={formData.occupancy_type || 'Residential'}
                                onValueChange={(val) => setFormData((p: any) => ({ ...p, occupancy_type: val }))}
                            >
                                <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Residential">🏠 Residential</SelectItem>
                                    <SelectItem value="Commercial">🏢 Commercial</SelectItem>
                                    <SelectItem value="Industrial">🏭 Industrial</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-medium">Total Assets Value <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">₹</span>
                                <Input
                                    id="sum_insured"
                                    name="sum_insured"
                                    type="number"
                                    placeholder="2000000"
                                    className="pl-8 h-12 text-base bg-gray-50"
                                    value={formData.sum_insured || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
