'use client'

import { useState } from 'react'
import { Plus, Building2, Loader2 } from 'lucide-react'
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
import { createCompanyInline } from '@/app/(dashboard)/companies/actions'

interface AddCompanyModalProps {
    onCompanyAdded: (company: any) => void
}

export function AddCompanyModal({ onCompanyAdded }: AddCompanyModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createCompanyInline(formData)

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
            return
        }

        if (result.success && result.company) {
            onCompanyAdded(result.company)
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
                                <Building2 className="h-5 w-5" />
                            </span>
                            Add New Company
                        </DialogTitle>
                        <DialogDescription>
                            Create a new insurance company instantly.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-semibold">Company Name *</Label>
                            <Input id="name" name="name" placeholder="HDFC Ergo" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="font-semibold">Type</Label>
                            <select id="type" name="type" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="General">General Insurance</option>
                                <option value="Life">Life Insurance</option>
                                <option value="Health">Health Insurance</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Company'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
