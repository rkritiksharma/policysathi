'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UploadCloud, FileText, Loader2, Sparkles, User, Car, IndianRupee, ChevronRight, ChevronLeft, Check, CreditCard } from 'lucide-react'
import { createPolicy, extractPolicyData } from '@/app/(dashboard)/policies/actions'
import { Policy } from '@/types'
import { addYears, addDays, format, parseISO } from 'date-fns'
import dynamic from 'next/dynamic'

// Dynamically import steps to reduce main bundle size initially
const PolicyFormCustomerStep = dynamic(() => import('./PolicyFormCustomerStep'))
const PolicyFormRiskStep = dynamic(() => import('./PolicyFormRiskStep'))
const PolicyFormPremiumStep = dynamic(() => import('./PolicyFormPremiumStep'))

type Props = {
    customers: { id: string; name: string; phone: string }[]
    companies: { id: string; name: string }[]
    initialData?: Partial<Policy>
}

export function PolicyForm({ customers, companies, initialData }: Props) {
    const [isPending, startTransition] = useTransition()
    const [isScanning, setIsScanning] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [currentStep, setCurrentStep] = useState(initialData ? 1 : 0) // Skip upload if renewing

    // Calculate dates for renewal
    let defaultStart = ''
    let defaultExpiry = ''

    if (initialData?.expiry_date) {
        const oldExpiry = parseISO(initialData.expiry_date)
        const newStart = addDays(oldExpiry, 1)
        const newExpiry = addDays(addYears(newStart, 1), -1)
        defaultStart = format(newStart, 'yyyy-MM-dd')
        defaultExpiry = format(newExpiry, 'yyyy-MM-dd')
    }

    const [formData, setFormData] = useState({
        policy_number: initialData ? `${initialData.policy_number}-RENEW` : '',
        vehicle_reg_no: initialData?.vehicle_reg_no || '',
        start_date: defaultStart,
        expiry_date: defaultExpiry,
        premium_total: initialData?.premium_total?.toString() || '',
        vehicle_make: initialData?.vehicle_make || 'Maruti',
        vehicle_model: initialData?.vehicle_model || '',
        idv: initialData?.idv?.toString() || '',
        ncb: initialData?.ncb?.toString() || '',
        engine_no: initialData?.engine_no || '',
        chassis_no: initialData?.chassis_no || '',
        company_id: initialData?.company_id || '',
        customer_id: initialData?.customer_id || '',
        policy_type: initialData?.policy_type || 'Car',
        fuel_type: initialData?.fuel_type || 'Petrol',
        vehicle_year: initialData?.vehicle_year || '2024',
        payment_status: initialData?.payment_status || 'paid',
        payment_mode: 'Cash',
        amount_paid: '',
        payment_reference: '',

        // New Fields (Health/Fire)
        sum_insured: initialData?.notes ? (JSON.parse(initialData.notes).sum_insured || '') : '',
        tpa: initialData?.notes ? (JSON.parse(initialData.notes).tpa || '') : '',
        health_members_json: initialData?.notes ? JSON.stringify(JSON.parse(initialData.notes).insured_members || []) : '',
        property_address: initialData?.notes ? (JSON.parse(initialData.notes).property_address || '') : '',
        occupancy_type: initialData?.notes ? (JSON.parse(initialData.notes).occupancy_type || 'Residential') : 'Residential',
    })

    const steps = [
        { id: 0, title: 'Document', icon: FileText, description: 'Upload & scan PDF' },
        { id: 1, title: 'Customer', icon: User, description: 'Select customer & company' },
        { id: 2, title: 'Details', icon: Car, description: 'Risk specifics' },
        { id: 3, title: 'Premium', icon: IndianRupee, description: 'Dates & payment' },
    ]

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleScan = async () => {
        if (!file) return alert('Please select a PDF file first.')
        setIsScanning(true)
        try {
            const formData = new FormData()
            formData.append('policy_file', file)
            const result = await extractPolicyData(formData)
            if (result.error) {
                alert(result.error)
            } else if (result.data) {
                setFormData(prev => ({ ...prev, ...result.data }))
                // Auto move to next step after successful scan
                setCurrentStep(1)
            }
        } catch (error) {
            console.error(error)
            alert('Failed to scan.')
        } finally {
            setIsScanning(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => {
            const updates: any = { [name]: value }

            // If premium changes and status is 'paid', update amount_paid too
            if (name === 'premium_total' && prev.payment_status === 'paid') {
                updates.amount_paid = value
            }

            return { ...prev, ...updates }
        })
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

    return (
        <form action={createPolicy} suppressHydrationWarning className="min-h-[600px]">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => setCurrentStep(index)}
                            className={`flex flex-col items-center gap-2 transition-all ${index <= currentStep ? 'opacity-100' : 'opacity-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${index < currentStep
                                ? 'bg-primary text-white'
                                : index === currentStep
                                    ? 'bg-primary text-white ring-4 ring-primary/20'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                {index < currentStep ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <step.icon className="h-5 w-5" />
                                )}
                            </div>
                            <div className="text-center hidden sm:block">
                                <p className={`text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Step 0: Document Upload */}
                <div className={`p-8 transition-all duration-300 ${currentStep === 0 ? 'block' : 'hidden'}`}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Upload Policy Document</h2>
                        <p className="text-gray-500 mt-2">Upload PDF to auto-fill form fields using AI</p>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-gray-50/50">
                            <input
                                id="policy_file"
                                name="policy_file"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="policy_file" className="cursor-pointer">
                                <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 font-medium">
                                    {file ? file.name : 'Click to upload PDF'}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
                            </label>
                        </div>

                        {file && (
                            <Button
                                type="button"
                                onClick={handleScan}
                                disabled={isScanning}
                                className="w-full mt-4 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 h-12 text-base"
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Scanning with AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 mr-2" />
                                        Auto-Fill Form Data
                                    </>
                                )}
                            </Button>
                        )}

                        <p className="text-center text-sm text-gray-400 mt-4">
                            Skip this step if you want to fill manually
                        </p>
                    </div>
                </div>

                {/* Step 1: Customer & Company */}
                <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                    <PolicyFormCustomerStep
                        customers={customers}
                        companies={companies}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        setFormData={setFormData}
                    />
                </div>

                {/* Step 2: Risk Details (Vehicle / Health / Fire) */}
                <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                    <PolicyFormRiskStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        setFormData={setFormData}
                    />
                </div>

                {/* Step 3: Premium & Payment */}
                <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                    <PolicyFormPremiumStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        setFormData={setFormData}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="h-12 px-6"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </Button>

                <div className="flex gap-3">
                    {currentStep < steps.length - 1 ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="h-12 px-8 bg-primary hover:bg-primary/90"
                        >
                            Next Step
                            <ChevronRight className="h-5 w-5 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-12 px-8 bg-primary hover:bg-primary/90 min-w-[180px]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    {initialData ? 'Renewing...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    {initialData ? 'Renew Policy' : 'Save Policy'}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}
