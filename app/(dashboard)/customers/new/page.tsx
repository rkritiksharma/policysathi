
'use client'

import { createCustomer } from '../actions' // Adjusted import path
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormStatus } from 'react-dom'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Customer'}
        </Button>
    )
}

export default function NewCustomerPage() {
    async function handleSubmit(formData: FormData) {
        try {
            await createCustomer(formData)
        } catch (error: any) {
            // Check if it's a validation error (like "Customer already exists")
            if (error.message && !error.message.includes('NEXT_REDIRECT')) {
                alert(error.message)
            } else {
                // If it's a redirect or other system error, rethrow or ignore
                // In production, we'd handle this more gracefully
                console.error(error)
            }
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <h1 className="text-2xl font-bold">Add New Customer</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input id="name" name="name" required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input id="phone" name="phone" required placeholder="9876543210" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" placeholder="Mumbai" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" name="dob" type="date" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
