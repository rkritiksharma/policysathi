"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md shadow-lg border-gray-200">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                            <MailCheck className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
                        <CardDescription className="text-base">
                            We've sent you a verification link. Please check your email and click the link to verify your account.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-500">
                    <p>If you don't see the email, check your spam folder.</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
