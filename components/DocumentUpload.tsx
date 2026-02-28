'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, FileText, X, Trash2, MessageCircle } from 'lucide-react'
import { uploadPolicyDocument, deletePolicyDocument } from '@/app/(dashboard)/policies/document-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getWhatsAppUrl } from '@/lib/utils'

export function DocumentUpload({
    policyId,
    currentUrl,
    customerPhone,
    policyNumber
}: {
    policyId: string,
    currentUrl?: string | null,
    customerPhone?: string,
    policyNumber?: string
}) {
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('policyId', policyId)

        try {
            const result = await uploadPolicyDocument(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setFile(null)
                router.refresh()
            }
        } catch (error) {
            toast.error('Failed to upload document')
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this document?')) return

        setIsDeleting(true)
        try {
            const result = await deletePolicyDocument(policyId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                router.refresh()
            }
        } catch (error) {
            toast.error('Failed to remove document')
        } finally {
            setIsDeleting(false)
        }
    }

    const waShareText = `Namaste! Here is your policy document${policyNumber ? ` (${policyNumber})` : ''}. Please download or view it here: ${currentUrl}`
    const waShareLink = customerPhone
        ? getWhatsAppUrl(customerPhone, waShareText)
        : `https://wa.me/?text=${encodeURIComponent(waShareText)}`

    return (
        <Card>
            <CardHeader>
                <CardTitle>Policy Document</CardTitle>
                <CardDescription>Upload or view the policy PDF.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {currentUrl ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-md bg-primary/5 border-primary/10">
                            <div className="flex items-center gap-2 text-primary">
                                <FileText className="h-5 w-5" />
                                <a href={currentUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline flex items-center gap-1">
                                    View Document <Upload className="h-3 w-3" />
                                </a>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                <span className="sr-only">Remove</span>
                            </Button>
                        </div>

                        <Button
                            asChild
                            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm font-medium"
                        >
                            <a href={waShareLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4" />
                                Send PDF via WhatsApp
                            </a>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="policy-doc" className="text-xs text-muted-foreground uppercase tracking-wider">Select PDF File</Label>
                            <Input
                                id="policy-doc"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>
                        {file && (
                            <Button onClick={handleUpload} disabled={isUploading} className="w-full bg-primary hover:bg-primary/90 text-white">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Document
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
