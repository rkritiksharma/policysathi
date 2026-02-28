"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building, Phone, MapPin, FileBadge } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await completeOnboarding(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Profile properly set up!");
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-lg shadow-lg border-gray-200">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                            <Building className="h-7 w-7 text-primary-foreground" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Complete your Profile</CardTitle>
                        <CardDescription>
                            Welcome to PolicySathi! Tell us a bit about your agency to get started.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="agency_name">Agency Name <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="agency_name"
                                        name="agency_name"
                                        required
                                        disabled={isPending}
                                        className="pl-9"
                                        placeholder="e.g. Shield Insurance Brokers"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        required
                                        disabled={isPending}
                                        className="pl-9"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="irda_code">IRDA License Number</Label>
                                <div className="relative">
                                    <FileBadge className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="irda_code"
                                        name="irda_code"
                                        disabled={isPending}
                                        className="pl-9"
                                        placeholder="Optional for now"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Office Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        name="address"
                                        disabled={isPending}
                                        className="pl-9"
                                        placeholder="Complete office address"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Setting up..." : "Go to Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
