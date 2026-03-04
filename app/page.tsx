'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useInView } from 'framer-motion';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Globe, Clock, Headphones, CheckCircle, Star, Gift, MessageSquare, PieChart, FileText, Users, TrendingUp, Award, ArrowRight, Zap, BarChart3, Bell, Menu, X, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { LogoTicker } from '@/components/landing/LogoTicker';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';
import { TypeWriter } from '@/components/landing/TypeWriter';

/* â”€â”€â”€ animation variants â”€â”€â”€ */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

/* â”€â”€â”€ reusable scroll-reveal wrapper â”€â”€â”€ */
function RevealOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, ease: 'easeOut' as const, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const nextTestimonial = () => {
    setDirection(1);
    setActiveTestimonial((prev) => (prev + 1) % 4);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveTestimonial((prev) => (prev - 1 + 4) % 4);
  };

  // Auto-rotate testimonials every 6s
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: 'Anil Dhangar',
      role: 'Insurance Advisor, Anjad',
      text: 'Pehle Excel mein policy track karta tha, bahut gadbad hoti thi. Jab se PolicySathi use kar raha hoon, ek bhi renewal miss nahi hua. WhatsApp pe ek click mein reminder chala jaata hai â€” customer bhi khush, main bhi khush!',
      avatar: 'AD',
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      name: 'Kundan Sagore',
      role: 'Agency Manager, Sendhwa',
      text: 'Birthday wishes automatically bhejne ka feature mera favourite hai. Mere clients bolte hain "Kundan ji, aap toh yaad rakhti ho!" Aur renewal reminder se mera business 40% badh gaya hai. Best investment for any agent.',
      avatar: 'KS',
      gradient: 'from-rose-500 to-pink-400',
    },
    {
      name: 'Pratik Mandloi',
      role: 'LIC Professional, Khargone',
      text: 'Dashboard pe sab kuch dikhta hai â€” kitni policies active hain, kitni expire hone waali hain, payment kitna aaya. Reports bhi ek click mein. Meri team ke 5 agents bhi ab PolicySathi use karte hain!',
      avatar: 'PM',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      name: 'Ritik Sharma',
      role: 'Digital Agent, Indore',
      text: 'PolicySathi ne mera kaam digital kar diya hai. Documents vault feature se ab mujhe file dhoondhne ki zaroorat nahi padti. Bas mobile nikalo aur policy share kar do. Bahut hi useful tool hai.',
      avatar: 'RS',
      gradient: 'from-purple-500 to-indigo-400',
    },
  ];

  const menuItems = ['Home', 'Features', 'How It Works', 'Pricing', 'Testimonials'];

  // Parallax for hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">

      {/* ============ CLEAN MINIMAL HEADER ============ */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${isScrolled || isMobileMenuOpen
          ? 'py-4 bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40'
          : 'py-6 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-6 lg:px-10">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer z-50">
            <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-sm border border-border/50">
              <Image src="/logo.png" alt="PolicySathi Logo" fill className="object-cover p-1.5" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              PolicySathi
            </span>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative py-2 px-1"
                onMouseEnter={() => setHoveredNav(item)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {item}
                {hoveredNav === item && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Buttons & Mobile Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="px-5 font-semibold hover:bg-transparent hover:text-primary transition-colors text-sm md:text-base">
                Login
              </Button>
            </Link>

            <Link href="/signup" className="hidden md:block">
              <Button className="rounded-full px-7 py-5 h-auto bg-foreground text-background hover:bg-foreground/90 transition-all font-bold text-sm shadow-lg shadow-foreground/10 flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 lg:hidden rounded-xl bg-muted/30 border border-border/50 text-foreground z-50 transition-all hover:bg-muted/50 active:scale-95"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />

              {/* Floating Menu Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-24 left-4 right-4 z-50 lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col p-8 gap-8"
              >
                {/* Subtle mobile background */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--primary-color)_0.1,transparent_0.6)] opacity-10"></div>

                <nav className="flex flex-col items-center gap-6 w-full">
                  {menuItems.map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="w-full text-center"
                    >
                      <Link
                        href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-bold text-foreground/90 hover:text-primary transition-colors block py-2"
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="flex flex-col gap-4 w-full mt-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-2">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                      Signup Free <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">
        {/* ============ HERO SECTION ============ */}
        <section ref={heroRef} id="home" className="relative pt-24 pb-20 lg:pt-28 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center">
          {/* Animated gradient blobs */}
          <div className="absolute inset-0 -z-10 bg-background">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[150px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-16 lg:gap-8 min-h-[600px]">
            {/* Left Content with parallax */}
            <motion.div
              style={{ y: heroTextY }}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6 z-10"
            >
              <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md self-center lg:self-start">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold text-primary tracking-wide uppercase">Sabse Smart Insurance CRM</span>
              </motion.div>

              <motion.h1 variants={staggerItem} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Your Digital <br />
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-[length:200%_200%]"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                >
                  Insurance Office.
                </motion.span>
              </motion.h1>

              <motion.div variants={staggerItem} className="text-base md:text-xl text-muted-foreground w-full max-w-xl leading-relaxed font-medium">
                PolicySathi helps you {' '}
                <span className="text-foreground font-bold">
                  <TypeWriter
                    texts={['Manage Leads Effortlessly.', 'Automate Policy Renewals.', 'Secure Digital Vault for Files.', 'Grow your Sales 2X.']}
                    speed={60}
                    deleteSpeed={30}
                    pauseTime={2500}
                  />
                </span>
              </motion.div>

              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 text-lg rounded-full shadow-[0_0_40px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_rgba(var(--primary),0.8)] transition-all group">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="h-14 md:h-16 px-8 md:px-10 text-lg rounded-full border-2 bg-background/50 backdrop-blur-sm">
                      Live Demo
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>15 Days FREE Trial</span>
                </div>
                <div className="hidden sm:block h-1 w-1 rounded-full bg-border"></div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No Credit Card Required</span>
                </div>
              </motion.div>
              {/* Social Proof */}
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 300 }}
                      className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm"
                    >
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="User" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground font-medium mt-0.5">Trusted by <span className="text-foreground font-bold">1,200+</span> agents</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image - Floating animation + parallax */}
            <motion.div
              style={{ y: heroImageY }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, type: 'spring', stiffness: 100 }}
              className="relative w-full h-[500px] lg:h-full flex items-center justify-center z-10"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full"
              >
                <div className="relative w-full h-full max-w-[800px] flex justify-center items-center">
                  <motion.div
                    animate={{ y: [-15, 15, -15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src="/landing/hero-insurance.png"
                      alt="PolicySathi Hero Illustration"
                      fill
                      className="object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.2)] z-10"
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============ TRUSTED LOGOS ============ */}
        <RevealOnScroll>
          <div className="border-y border-border/40 bg-muted/10 relative z-20 shadow-sm py-8 text-center">
            <LogoTicker />
          </div>
        </RevealOnScroll>

        {/* ============ FEATURES (HINDI) ============ */}
        <section id="features" className="py-20 lg:py-24 px-6 lg:px-10 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <RevealOnScroll className="text-center mb-20 space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Kyun Chunein <span className="text-primary">PolicySathi</span>?</h2>
              <p className="text-lg text-muted-foreground">Woh sab kuch jo ek aadhunik insurance agent ko chahiye, ek hi jagah par.</p>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'WhatsApp Reminders',
                  desc: 'Policy renewal ki date aane se pehle clients ko automatically WhatsApp par reminder bhejein. Ek bhi policy lapse nahi hogi.',
                  icon: MessageSquare,
                  color: 'text-green-500',
                  bg: 'bg-green-500/10',
                  image: '/landing/health-insurance.png',
                },
                {
                  title: 'Auto Birthday Wishes',
                  desc: 'Clients ko unke janmdin, anniversary par auto-greetings jayein. Personal touch se customer loyalty badhayein.',
                  icon: Gift,
                  color: 'text-rose-500',
                  bg: 'bg-rose-500/10',
                  image: '/landing/assets-insurance.png',
                },
                {
                  title: 'Smart Dashboard',
                  desc: 'Kitni policy aayi, kitna commission bana, aur kon se renewals baaki hain â€” sab kuch clear aur aasan dashboard par.',
                  icon: PieChart,
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10',
                  image: '/landing/vehicle-insurance.png',
                }
              ].map((feature, idx) => (
                <RevealOnScroll key={idx} delay={idx * 0.15}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-card border shadow-sm rounded-3xl p-6 md:p-8 hover:shadow-xl group overflow-hidden h-full"
                  >
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.15 }}
                      className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-transform`}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{feature.desc}</p>
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-muted/30">
                      <Image src={feature.image} alt={feature.title} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
        {/* ============ COMPARISON SECTION: EXCEL vs POLICYSATHI ============ */}
        <section id="comparison" className="py-16 lg:py-20 px-6 lg:px-10 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll className="text-center mb-12 md:mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Excel <span className="text-red-500 line-through decoration-4">Ab Purana Hua</span>, <br className="md:hidden" /> Ab Chalein <span className="text-primary italic">Smart Raste</span> Par</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Dekhiye kyun 1,200+ agents ne Excel chhod kar PolicySathi ko chuna.</p>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              {/* Excel Side */}
              <RevealOnScroll delay={0.1}>
                <div className="bg-card/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-12 h-full opacity-80 md:opacity-70 grayscale-[0.3] md:grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6 md:mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <FileText className="h-5 w-5 md:h-6 md:w-6 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="text-slate-500 uppercase tracking-widest text-[10px] md:text-sm font-bold">Old Method</h3>
                      <p className="text-xl md:text-2xl font-bold text-foreground">Excel / Register</p>
                    </div>
                  </div>

                  <ul className="space-y-4 md:space-y-6">
                    {[
                      'Data search karne mein hours lagte hain',
                      'Staff ko sikhao, phir wo kaam chhod ke bhag jata hai',
                      'Hamesha staff par dependent rehna padta hai',
                      'Policy copy dhoondhne aur bhejne ki manual mehnat',
                      'WhatsApp Reminder manually bhejna padta hai'
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <X className="h-3 w-3 text-red-500" />
                        </div>
                        <span className="text-sm md:text-base text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 md:mt-12 p-5 md:p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                    <p className="text-red-600 dark:text-red-400 font-bold italic text-center text-sm md:text-base">Outcome: Limited Growth & Tired Agent</p>
                  </div>
                </div>
              </RevealOnScroll>

              {/* PolicySathi Side */}
              <RevealOnScroll delay={0.2}>
                <div className="bg-primary/5 border-2 border-primary rounded-[2rem] p-6 md:p-12 h-full relative overflow-hidden shadow-2xl shadow-primary/10 transition-transform hover:scale-[1.02] duration-500">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                    The Winner
                  </div>

                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                      <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-primary uppercase tracking-widest text-[10px] md:text-sm font-bold">Smart Method</h3>
                      <p className="text-xl md:text-2xl font-bold text-foreground font-extrabold group">PolicySathi <span className="text-primary italic">Power</span></p>
                    </div>
                  </div>

                  <ul className="space-y-4 md:space-y-6">
                    {[
                      'Single Tap par koi bhi policy dhoondhein',
                      'Aapka software hi aapka manager hai (No Staff)',
                      'Policy issue hote hi customer ko WhatsApp Par Auto-Send',
                      'Aap akele 10X business aaram se manage karein',
                      '100% Automatic WhatsApp Reminders'
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        </div>
                        <span className="font-medium text-foreground text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 md:mt-12 p-5 md:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                    <p className="text-emerald-600 dark:text-emerald-400 font-extrabold italic text-center">Outcome: 2X Business & Happy Smart Agent text-sm md:text-base</p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ============ POLICY SATHI ADVANTAGE (HOW IT WORKS) ============ */}
        <section id="how-it-works" className="py-20 lg:py-24 px-6 lg:px-10 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-15"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <RevealOnScroll className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Apni Agency Ko <span className="text-primary italic">Next Level</span> Par Le Jayein</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Sirf software nahi, yeh aapke business ko grow karne ka ek digital engine hai.</p>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {[
                {
                  title: '100% Digital Office',
                  desc: 'File-Folder ki jhanjhat khatam. Sabhi policies aur documents ab aapke mobile mein, kahin bhi aur kabhi bhi.',
                  icon: Smartphone,
                  color: 'from-blue-600 to-cyan-500',
                  badge: 'Modern Agent'
                },
                {
                  title: 'Automated Retention',
                  desc: 'Ek baar setup karein, phir PolicySathi apne aap WhatsApp par reminders aur wishes bhejega. Clients ka bharosa hamesha bana rahega.',
                  icon: Repeat,
                  color: 'from-primary to-emerald-500',
                  badge: 'Smart System'
                },
                {
                  title: 'Zero-Lapse Business',
                  desc: 'Ek bhi renewal miss nahi hoga. Analytics dashboard dikhayega ki kahan Paisa hai aur kahan mehnat karni hai. Business grow karein 2X raftar se.',
                  icon: TrendingUp,
                  color: 'from-amber-500 to-orange-600',
                  badge: 'Highest Growth'
                },
              ].map((item, idx) => (
                <RevealOnScroll key={idx} delay={idx * 0.2}>
                  <motion.div
                    whileHover={{ y: -12 }}
                    className="relative group bg-card/50 backdrop-blur-sm border border-border/50 p-7 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 h-full"
                  >
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-950 px-4 md:px-6 py-1.5 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-all duration-300 border border-border z-30 shadow-md whitespace-nowrap">
                      {item.badge}
                    </div>

                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-black/5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                      <item.icon className="h-10 w-10 text-white" />
                    </div>

                    <h3 className="text-2xl font-extrabold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{item.desc}</p>

                    <div className="mt-8 flex items-center gap-2 text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PRICING SECTION ============ */}
        <section id="pricing" className="py-20 lg:py-24 px-6 lg:px-10 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <RevealOnScroll className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Behtareen <span className="text-primary italic">Pricing</span> Plans</h2>
              <p className="text-lg text-muted-foreground">Sahi plan chunein aur apne business ko digital banayein.</p>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                <Zap className="h-4 w-4" /> 15 DIN KA FREE DEMO - SABHI PLANS PAR!
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Monthly Plan */}
              <RevealOnScroll delay={0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-card/80 backdrop-blur-xl border border-border shadow-sm rounded-[2.5rem] p-6 md:p-6 md:p-8 h-full flex flex-col hover:shadow-2xl transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-2">Monthly Plan</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-foreground">₹999</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {[
                      'Unlimited Policies',
                      'Auto WhatsApp Reminders',
                      'Birthday & Anniversary Auto-Wishes',
                      'Advanced PDF Reports',
                      'Standard Analytics',
                      'Priority Email Support'
                    ].map((feat, i) => (
                      <li key={i} className="flex gap-3 items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="mt-auto">
                    <Button variant="outline" className="w-full rounded-full h-12 border-primary/20 hover:bg-primary/5 text-primary">
                      Monthly Shuru Karein
                    </Button>
                  </Link>
                </motion.div>
              </RevealOnScroll>

              {/* Yearly Plan */}
              <RevealOnScroll delay={0.2}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-card border-2 border-primary rounded-[2.5rem] p-6 md:p-6 md:p-8 h-full flex flex-col shadow-2xl relative overflow-hidden transform md:scale-105 z-20 animate-shimmer"
                >
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-bl-3xl uppercase tracking-widest shadow-lg shadow-primary/20 z-10">
                    Best Plan
                  </div>
                  <h3 className="text-xl font-bold mb-2">Yearly Plan</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-foreground">₹7,999</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <p className="text-xs text-primary font-bold mb-6 italic bg-primary/5 py-1 px-3 rounded-full inline-block">
                    Save 33% (4 Months FREE!)
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {[
                      'Sab kuch Monthly wala',
                      'Upto 3 Staff Accounts',
                      'Custom Logo on PDF Reports',
                      'Advance CRM Tools',
                      'Priority Support',
                      'Ad-free Experience'
                    ].map((feat, i) => (
                      <li key={i} className="flex gap-3 items-center text-sm text-foreground">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="mt-auto">
                    <Button className="w-full rounded-full h-12 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                      Yearly Shuru Karein
                    </Button>
                  </Link>
                </motion.div>
              </RevealOnScroll>

              {/* 2-Year Plan */}
              <RevealOnScroll delay={0.3}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-card/80 backdrop-blur-xl border border-border shadow-sm rounded-[2.5rem] p-6 md:p-6 md:p-8 h-full flex flex-col hover:shadow-2xl transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-2">2-Year Plan</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-foreground">₹13,999</span>
                    <span className="text-muted-foreground">/2 years</span>
                  </div>
                  <p className="text-xs text-primary font-bold mb-6 italic bg-primary/5 py-1 px-3 rounded-full inline-block">
                    Best Value: Save 42%
                  </p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {[
                      'Sab kuch Yearly wala',
                      'Dedicated Account Manager',
                      'Custom Domain Support',
                      'API Access (Upcoming)',
                      'Personalized Onboarding',
                      'Lifetime Digital Vault'
                    ].map((feat, i) => (
                      <li key={i} className="flex gap-3 items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="mt-auto">
                    <Button variant="outline" className="w-full rounded-full h-12 border-primary/20 hover:bg-primary/5 text-primary">
                      2-Year Savings
                    </Button>
                  </Link>
                </motion.div>
              </RevealOnScroll>
            </div>
          </div>
        </section >

        {/* ============ TESTIMONIALS ============ */}
        < section id="testimonials" className="py-24 lg:py-24 px-6 lg:px-10 bg-background overflow-hidden relative" >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <RevealOnScroll className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Hamare agents kya <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">kehte hain</span></h2>
              <p className="text-lg text-muted-foreground">1,200+ agents ne apne business ko PolicySathi ke saath grow kiya hai.</p>
            </RevealOnScroll>

            <div className="relative max-w-5xl mx-auto">
              <div className="flex items-center justify-center min-h-[450px] relative mt-10">
                {/* Navigation Buttons - Hidden on Mobile */}
                <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between items-center pointer-events-none z-20">
                  <button
                    onClick={prevTestimonial}
                    className="w-14 h-14 rounded-2xl bg-white shadow-2xl border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 pointer-events-auto -translate-x-20 group"
                  >
                    <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-14 h-14 rounded-2xl bg-white shadow-2xl border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 pointer-events-auto translate-x-20 group"
                  >
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction > 0 ? -100 : 100, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = velocity.x * offset.x;
                      if (swipe < -1000) nextTestimonial();
                      else if (swipe > 1000) prevTestimonial();
                    }}
                    className="w-full max-w-4xl px-4 cursor-grab active:cursor-grabbing"
                  >
                    <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-white/10 relative text-center flex flex-col items-center">
                      {/* Quote marks */}
                      <div className="absolute top-8 left-10 text-8xl font-serif text-primary/10 select-none">&ldquo;</div>

                      <div className="flex gap-1 mb-6 md:mb-8">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-6 w-6 text-amber-500 fill-amber-500" />
                        ))}
                      </div>

                      <p className="text-xl md:text-3xl font-medium text-foreground leading-relaxed mb-12 max-w-3xl italic">
                        &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                      </p>

                      <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonials[activeTestimonial].gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                          {testimonials[activeTestimonial].avatar}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-xl text-foreground">{testimonials[activeTestimonial].name}</p>
                          <p className="text-primary font-medium tracking-wider uppercase text-sm">{testimonials[activeTestimonial].role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Indicators */}
              <div className="flex items-center justify-center gap-3 mt-12">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > activeTestimonial ? 1 : -1);
                      setActiveTestimonial(idx);
                    }}
                    className="relative rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: activeTestimonial === idx ? 48 : 12, height: 12 }}
                  >
                    <div className={`absolute inset-0 rounded-full ${activeTestimonial === idx ? 'bg-primary/20' : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'}`} />
                    {activeTestimonial === idx && (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 6, ease: 'linear' }}
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section >

        {/* ============ PREMIUM CTA SECTION ============ */}
        <RevealOnScroll>
          <section className="py-24 md:py-32 px-6 lg:px-10 relative overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-[20%] -right-[10%] w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[140px]"
              />
              <div className="absolute inset-0 bg-background/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#000_100%)] opacity-80" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-b from-white/80 to-slate-50/90 backdrop-blur-3xl border border-border/50 rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] group"
              >
                {/* Decorative Inner elements */}
                <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-32 h-32 md:w-48 md:h-48 text-primary" strokeWidth={1} />
                </div>
                <div className="absolute bottom-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp className="w-24 h-24 text-emerald-500" strokeWidth={1} />
                </div>

                <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 max-w-3xl mx-auto">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase italic">Limited Time: 15-Day Free Access</span>
                  </motion.div>

                  <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight text-foreground italic">
                    Ab Banayein Apni Agency Ko{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-blue-600 bg-[length:200%_200%] animate-gradient">
                      Digital Force!
                    </span>
                  </h2>

                  <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">
                    Excel chhodne ka sahi waqt yahi hai. Joining <span className="text-foreground font-bold underline decoration-primary decoration-4 underline-offset-4">1,200+ Smart Agents</span> who are growing 2X every year.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 w-full sm:w-auto">
                    <Link href="/signup" className="w-full sm:w-auto">
                      <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="lg" className="h-16 md:h-20 px-10 md:px-16 text-xl md:text-2xl rounded-2xl md:rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_20px_40px_rgba(5,150,105,0.25)] hover:shadow-[0_25px_50px_rgba(5,150,105,0.35)] transition-all font-black flex items-center gap-3 w-full sm:w-auto border-none">
                          START FREE NOW
                          <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                        </Button>
                      </motion.div>
                    </Link>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center overflow-hidden shadow-md transition-transform hover:scale-110 hover:z-10"
                          >
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 25}&backgroundColor=f1f5f9`} alt="User" />
                          </div>
                        ))}
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-md backdrop-blur-sm">
                          +1.2k
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-8 w-full border-t border-border/50 opacity-80">
                    {[
                      { label: 'Setup', val: '2 Min' },
                      { label: 'Retention', val: '+40%' },
                      { label: 'Effort', val: '-80%' },
                      { label: 'Growth', val: '2X' }
                    ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-lg md:text-2xl font-black text-foreground">{stat.val}</span>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </RevealOnScroll>
      </main >

      {/* ============ FOOTER ============ */}
      < footer id="contact" className="relative bg-[#020617] text-slate-300 py-24 px-6 lg:px-10 overflow-hidden" >
        {/* Decorative Background Elements */}
        < div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
            {/* Brand Column */}
            <div className="space-y-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-2xl bg-white p-2 shadow-xl shadow-white/5 group-hover:scale-110 transition-transform duration-300">
                  <Image src="/logo.png" alt="PolicySathi Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">PolicySathi</span>
              </Link>
              <p className="text-base text-slate-400 leading-relaxed max-w-xs">
                Empowering insurance agents with India's most advanced digital-first management ecosystem.
              </p>
              <div className="flex gap-4 pt-4">
                {[
                  { icon: Globe, label: 'Website' },
                  { icon: Smartphone, label: 'App' },
                  { icon: MessageSquare, label: 'Support' }
                ].map((social, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -4, backgroundColor: 'rgba(var(--primary), 1)' }}
                    className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-300 shadow-lg"
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 md:mb-8 uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'How it Works', 'Features', 'Pricing', 'Blog'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-slate-400 hover:text-primary flex items-center group transition-colors duration-300">
                      <span className="h-1.5 w-0 group-hover:w-2 bg-primary rounded-full mr-0 group-hover:mr-3 transition-all duration-300"></span>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 md:mb-8 uppercase tracking-widest text-sm">Contact Support</h4>
              <ul className="space-y-4 md:space-y-6">
                <li className="flex gap-4 items-start group">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">Call Us</p>
                    <p className="text-slate-200 font-medium">+91 9977996697</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start group">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Headphones className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter mb-1">Email</p>
                    <p className="text-slate-200 font-medium">hello@policysathi.in</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* App Download */}
            <div className="space-y-8">
              <h4 className="text-white font-bold text-lg mb-6 md:mb-8 uppercase tracking-widest text-sm">Download App</h4>
              <p className="text-sm text-slate-400">Manage your entire policy portfolio on the go. Available soon.</p>
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black border border-slate-800 text-white shadow-xl group transition-all"
                >
                  <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Coming soon on</p>
                    <p className="text-lg font-bold">App Store</p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black border border-slate-800 text-white shadow-xl group transition-all"
                >
                  <svg className="w-8 h-8" viewBox="0 0 512 512">
                    <path fill="#00f2ff" d="M12.9 20.3c-4.3 4.5-6.9 11.2-6.9 19.8v431.8c0 8.6 2.6 15.3 6.9 19.8l2.2 2.2L255.1 254v-4.1L15.1 18.1l-2.2 2.2z" />
                    <path fill="#00e676" d="M335.1 334.1l-80-80.1v-4.1l80-80.1 2.2 1.3 94.6 53.8c27.1 15.4 27.1 40.7 0 56.1l-94.6 53.8-2.2-0.8z" />
                    <path fill="#ffd600" d="M257.3 254L12.9 498.1c8.9 9.4 23.5 10.5 39.8 1.3l282.4-161.4-77.8-84z" />
                    <path fill="#ff1744" d="M257.3 250l77.8-84L52.7 4.6C36.4-4.6 21.8-3.5 12.9 5.9L257.3 250z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Coming soon on</p>
                    <p className="text-lg font-bold">Google Play</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-24 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500">&copy; 2026 PolicySathi. Digitally crafted for winners.</p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Security'].map(item => (
                <Link key={item} href="#" className="text-sm text-slate-500 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer >

      {/* ============ FLOATING WHATSAPP BUTTON ============ */}
      < motion.div
        initial={{ scale: 0, opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8 z-[100]"
      >
        <a
          href="https://wa.me/919977996697?text=Hello%20PolicySathi%2C%20I%20want%20to%20know%20more%20about%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="relative group block"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity animate-pulse"></div>
          <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300">
            <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-foreground px-4 py-2 rounded-xl shadow-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border">
            Chat with Support
          </div>
        </a>
      </motion.div >
    </div >
  );
}
