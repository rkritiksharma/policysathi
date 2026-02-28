'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' as const }
    })
}

export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerChildren({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div variants={fadeInUp} className={className}>
            {children}
        </motion.div>
    )
}

export function ScaleOnHover({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
