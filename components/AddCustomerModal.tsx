'use client'

import { useState } from 'react'
import { Plus, User, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createCustomerInline } from '@/app/(dashboard)/customers/actions'

interface AddCustomerModalProps {
    onCustomerAdded: (customer: any) => void
}

export function AddCustomerModal({ onCustomerAdded }: AddCustomerModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createCustomerInline(formData)

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
            return
        }

        if (result.success && result.customer) {
            onCustomerAdded(result.customer)
            setOpen(false)
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex cursor-pointer items-center text-xs text-primary hover:text-primary/80 font-semibold group transition-all">
                    <Plus className="mr-1 h-3 w-3 group-hover:scale-110 transition-transform" /> Add New
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="p-2 bg-primary/10 rounded-full text-primary">
                                <User className="h-5 w-5" />
                            </span>
                            Add New Customer
                        </DialogTitle>
                        <DialogDescription>
                            Create a new customer instantly to attach to this policy.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-semibold">Full Name *</Label>
                            <Input id="name" name="name" placeholder="Rahul Sharma" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="font-semibold">Phone Number *</Label>
                            <Input id="phone" name="phone" placeholder="9876543210" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-semibold">Email (Optional)</Label>
                            <Input id="email" name="email" type="email" placeholder="rahul@example.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city" className="font-semibold">City (Optional)</Label>
                            <Input id="city" name="city" placeholder="Mumbai" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Customer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
