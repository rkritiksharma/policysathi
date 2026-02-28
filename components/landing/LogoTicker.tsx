'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

const insuranceLogos = [
    { name: 'LIC', logo: '/logos/lic.svg' },
    { name: 'HDFC Life', logo: '/logos/hdfc-life.svg' },
    { name: 'ICICI Prudential', logo: '/logos/icici-prudential.svg' },
    { name: 'SBI Life', logo: '/logos/sbi-life.svg' },
    { name: 'United India', logo: '/logos/united-india.svg' },
    { name: 'National Insurance', logo: '/logos/national-insurance.svg' },
    { name: 'AIG', logo: '/logos/aig.svg' },
    { name: 'Liberty Mutual', logo: '/logos/liberty-mutual.svg' },
    { name: 'Max Life', logo: '/logos/max-life.svg' },
    { name: 'Bajaj Allianz', logo: '/logos/bajaj-allianz.svg' },
    { name: 'Tata AIA', logo: '/logos/tata-aia.svg' },
    { name: 'Star Health', logo: '/logos/star-health.svg' },
]

export function LogoTicker() {
    const [isHovered, setIsHovered] = useState(false)

    // Duplicate the array to create a seamless loop
    const duplicatedLogos = [...insuranceLogos, ...insuranceLogos, ...insuranceLogos]

    return (
        <div className="w-full overflow-hidden bg-background py-16 relative">
            {/* Subtle glowing abstract background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-primary/5 blur-3xl rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>
                    <p className="text-center text-sm text-primary font-bold uppercase tracking-[0.2em]">
                        Trusted By Top Indian Insurers
                    </p>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>
                </div>
            </div>

            <div
                className="relative flex overflow-hidden group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Gradient overlays for smooth fade effect at the edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>

                {/* Animated scrolling container using Framer Motion */}
                <motion.div
                    className="flex shrink-0 gap-6 px-3"
                    animate={{
                        x: ['0%', '-33.33%'] // -33.33% because we triple duplicated the content
                    }}
                    transition={{
                        duration: 30, // Adjust speed
                        ease: "linear",
                        repeat: Infinity,
                        // Pause the animation when hovered
                        repeatType: "loop"
                    }}
                    style={{
                        // Manually overriding the animation play state via the hover hook
                        animationPlayState: isHovered ? 'paused' : 'running'
                    }}
                >
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 flex items-center justify-center relative w-44 h-24 rounded-2xl bg-card border border-primary/10 shadow-sm hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:border-primary/50 transition-all duration-300 group/logo overflow-hidden cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 dark:from-white/5 dark:to-transparent pointer-events-none z-10"></div>
                            <Image
                                src={logo.logo}
                                alt={logo.name}
                                width={120}
                                height={40}
                                className="object-contain filter grayscale group-hover/logo:grayscale-0 opacity-60 group-hover/logo:opacity-100 group-hover/logo:scale-110 transition-all duration-500 z-20"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
