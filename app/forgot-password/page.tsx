"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { requestPasswordReset } from "./actions"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (formData: FormData) => {
        startTransition(async () => {
            setMessage(null)
            const result = await requestPasswordReset(formData)

            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({
                    type: 'success',
                    text: 'Password reset link sent! Check your email inbox.'
                })
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-sm shadow-lg border-gray-200">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                            <Shield className="h-7 w-7 text-primary-foreground" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                        <CardDescription>
                            Enter your email and we'll send you a reset link
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={isPending}
                                    className="pl-10"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link
                        href="/login"
                        className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
