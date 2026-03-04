"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

function LoginContent() {
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const resetSuccess = searchParams.get('reset') === 'success';

    const handleLogin = async (formData: FormData) => {
        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) {
                alert(result.error);
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Panel - Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-50 dark:bg-slate-950 overflow-hidden items-center justify-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

                {/* Decorative Blobs */}
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 w-full max-w-lg p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-card/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-border/50 overflow-hidden relative group">
                                <Image src="/logo.png" alt="PolicySathi Logo" fill className="object-cover p-1.5 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="font-bold text-3xl tracking-tight text-foreground">PolicySathi</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 text-foreground">
                            Manage your insurance portfolio <span className="text-primary italic">smarter.</span>
                        </h1>

                        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                            Join thousands of agents using our premium ecosystem to automate renewals and grow trust.
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                <span className="text-primary font-bold">4k+</span> agents ka bharosa
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-gray-50/30">
                {/* Subtle mobile background */}
                <div className="lg:hidden absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden flex flex-col items-center mb-10">
                        <Link href="/" className="flex flex-col items-center gap-3 group">
                            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-border/50 overflow-hidden relative">
                                <Image src="/logo.png" alt="PolicySathi Logo" fill className="object-cover p-1.5" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-foreground">PolicySathi</span>
                        </Link>
                    </div>

                    <div className="mb-6 md:mb-8 text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-sm md:text-base text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {resetSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200 flex items-center gap-3"
                        >
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 text-lg">✓</span>
                            </div>
                            Password reset successful! Please login with your new password.
                        </motion.div>
                    )}

                    <form action={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold ml-1">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                disabled={isPending}
                                suppressHydrationWarning
                                className="h-12 px-4 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all text-base md:text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    disabled={isPending}
                                    suppressHydrationWarning
                                    className="h-12 pl-4 pr-12 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all text-base md:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="outline"
                            className="w-full h-12 text-base font-medium rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-all hover:shadow-sm mt-2"
                            disabled={isPending}
                        >
                            {isPending ? "Signing in..." : "Sign in to Dashboard"}
                        </Button>
                    </form>

                    <div className="mt-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-200 after:mt-0.5 after:flex-1 after:border-t after:border-gray-200">
                        <span className="text-sm text-gray-400 font-medium mx-4 bg-transparent uppercase tracking-wider">or</span>
                    </div>

                    <div className="mt-8">
                        <Button
                            variant="outline"
                            className="w-full h-12 text-base font-medium rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-all hover:shadow-sm"
                            disabled={isPending}
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>

                    <p className="mt-10 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
            <LoginContent />
        </Suspense>
    );
}
