'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { TypeWriter } from './TypeWriter';
import Image from 'next/image';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export const AnimatedHero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 lg:px-10 pt-20">
            {/* Animated Glowing Backgrounds */}
            <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px]"
                />

                {/* Subtle grid pattern for premium feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10 w-full relative">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-8"
                >
                    {/* Badge */}
                    <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-sm font-semibold text-primary tracking-wide uppercase">The Future of Insurance</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div variants={item} className="space-y-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Protect What <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500">
                                Matters Most.
                            </span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mt-4">
                            All your policies. {' '}
                            <span className="text-foreground">
                                <TypeWriter
                                    texts={['In one secure vault.', 'Managed seamlessly.', 'Always accessible.']}
                                    speed={70}
                                    deleteSpeed={30}
                                    pauseTime={3000}
                                />
                            </span>
                        </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                        PolicySathi is India's most advanced insurance ecosystem. Compare, buy, and manage Life, Health, Motor, and Home insurance with zero hassle and 100% transparency.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={item} className="flex flex-col sm:flex-row gap-5 pt-4">
                        <Link href="/signup">
                            <Button size="lg" className="h-14 px-10 text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_45px_rgba(var(--primary),0.6)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative flex items-center gap-2">
                                    Get Started Free <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </Link>
                        <Link href="#explore">
                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg w-full sm:w-auto border-2 hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                                Explore Plans
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div variants={item} className="flex items-center gap-4 pt-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm z-[${5 - i}]`}>
                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center gap-1 text-amber-500">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground font-medium mt-0.5">Trusted by <span className="text-foreground font-bold">10,000+</span> families</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right side static/animated image from the current landing page */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="relative lg:block flex justify-center items-center w-full h-[600px] perspective-[1000px]"
                >
                    <div className="relative w-full h-full max-w-[800px] flex justify-center items-center">
                        <Image
                            src="/landing/hero-insurance.png"
                            alt="PolicySathi Hero Illustration"
                            fill
                            className="object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-[float_6s_ease-in-out_infinite]"
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
