'use client'

import { MoreHorizontal, Pencil, Trash, Download, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { deletePolicy } from "@/app/(dashboard)/policies/actions"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getWhatsAppUrl } from "@/lib/utils"

export function PolicyActions({ id, pdf_url, customerPhone, policyNumber }: { id: string, pdf_url?: string | null, customerPhone?: string, policyNumber?: string }) {
    const [open, setOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deletePolicy(id)
                setShowDeleteDialog(false)
            } catch (error) {
                alert('Failed to delete policy')
            }
        })
    }

    // Create WhatsApp Share Text
    const waShareText = `Namaste! Here is your policy document${policyNumber ? ` (${policyNumber})` : ''}. Please download or view it here: ${pdf_url}`
    const waShareLink = customerPhone
        ? getWhatsAppUrl(customerPhone, waShareText)
        : `https://wa.me/?text=${encodeURIComponent(waShareText)}`

    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" suppressHydrationWarning>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* JSON.stringify(pdf_url) // Debug */}
                    {pdf_url && (
                        <>
                            <DropdownMenuItem asChild>
                                <a href={pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer text-primary focus:text-primary/80">
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Download PDF</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={waShareLink} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    <span>Share on WhatsApp</span>
                                </a>
                            </DropdownMenuItem>
                        </>
                    )}

                    <DropdownMenuItem asChild>
                        <Link href={`/policies/${id}/edit`} className="flex items-center cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit Policy</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the policy record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isPending}
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
