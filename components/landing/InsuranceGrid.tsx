'use client';

import { motion } from 'framer-motion';
import { Shield, Car, Home, HeartPulse, Plane, Briefcase, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const insuranceTypes = [
    {
        id: 'health',
        title: 'Health Insurance',
        description: 'Comprehensive medical coverage for you and your family, including cashless hospitalization and maternity benefits.',
        icon: HeartPulse,
        color: 'from-pink-500/20 to-rose-500/5',
        iconColor: 'text-rose-500',
        delay: 0.1,
    },
    {
        id: 'life',
        title: 'Term Life Insurance',
        description: 'Secure your family’s financial future with high coverage at incredibly low premiums. Instant online processing.',
        icon: Shield,
        color: 'from-blue-500/20 to-cyan-500/5',
        iconColor: 'text-blue-500',
        delay: 0.2,
    },
    {
        id: 'motor',
        title: 'Motor Insurance',
        description: 'Instant policies for your car or bike. Zero depreciation, instant claims, and cashless repairs at network garages.',
        icon: Car,
        color: 'from-amber-500/20 to-orange-500/5',
        iconColor: 'text-orange-500',
        delay: 0.3,
    },
    {
        id: 'home',
        title: 'Home Insurance',
        description: 'Protect your biggest asset from natural disasters, theft, and fire. Coverage includes contents and structural damage.',
        icon: Home,
        color: 'from-emerald-500/20 to-teal-500/5',
        iconColor: 'text-emerald-500',
        delay: 0.4,
    },
    {
        id: 'travel',
        title: 'Travel Insurance',
        description: 'Travel the world worry-free. Get covered for flight delays, medical emergencies abroad, and lost baggage.',
        icon: Plane,
        color: 'from-purple-500/20 to-indigo-500/5',
        iconColor: 'text-purple-500',
        delay: 0.5,
    },
    {
        id: 'business',
        title: 'Business Insurance',
        description: 'Safeguard your enterprise against liabilities, property damage, and employee-related risks globally.',
        icon: Briefcase,
        color: 'from-slate-500/20 to-gray-500/5',
        iconColor: 'text-slate-500',
        delay: 0.6,
    },
];

export const InsuranceGrid = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section className="py-24 px-6 lg:px-10 relative overflow-hidden bg-muted/20 pb-40">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                    >
                        Comprehensive Coverage
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        One Platform. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Every Insurance You Need.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        Discover tailor-made policies designed specifically for your lifestyle, budget, and future goals.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {insuranceTypes.map((type) => (
                        <motion.div
                            key={type.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: type.delay }}
                            onHoverStart={() => setHoveredId(type.id)}
                            onHoverEnd={() => setHoveredId(null)}
                            className="group relative"
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${type.color} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />

                            <div className="relative h-full bg-card border border-border/50 hover:border-primary/30 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between">

                                {/* Background Decor */}
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-in-out" />

                                <div className="relative z-10">
                                    <div className={`h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${type.iconColor}`}>
                                        <type.icon className="h-7 w-7" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                        {type.description}
                                    </p>
                                </div>

                                <div className="mt-8 relative z-10">
                                    <Button
                                        variant="ghost"
                                        className="p-0 hover:bg-transparent hover:text-primary group/btn flex items-center gap-2"
                                    >
                                        Explore Plans
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:text-primary transition-transform" />
                                    </Button>
                                </div>

                                {/* Animated Outline on Hover */}
                                {hoveredId === type.id && (
                                    <motion.div
                                        layoutId="outline"
                                        className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
