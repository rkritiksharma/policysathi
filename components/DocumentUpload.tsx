'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, FileText, X } from 'lucide-react'
import { uploadPolicyDocument } from '@/app/(dashboard)/policies/document-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DocumentUpload({ policyId, currentUrl }: { policyId: string, currentUrl?: string | null }) {
    const [isUploading, setIsUploading] = useState(false)
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Policy Document</CardTitle>
                <CardDescription>Upload or view the policy PDF.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {currentUrl ? (
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2 text-primary">
                            <FileText className="h-5 w-5" />
                            <a href={currentUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline">
                                View Policy Document
                            </a>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* Implement delete if needed, for now just UI */ }}
                        >
                            <span className="sr-only">Remove</span>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="policy-doc">Upload PDF</Label>
                            <Input
                                id="policy-doc"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </div>
                        {file && (
                            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload
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
