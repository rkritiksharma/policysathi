'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Globe, Clock, Headphones } from 'lucide-react';
import { LogoTicker } from '@/components/landing/LogoTicker';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';
import { AnimatedHero } from '@/components/landing/AnimatedHero';
import { InsuranceGrid } from '@/components/landing/InsuranceGrid';
import { FileText, Users, TrendingUp, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden selection:bg-primary/30">

      {/* Floating Header */}
      <header className="px-6 lg:px-10 py-4 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50 bg-background/70 border-b border-border/30 transition-all duration-300">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            PolicySathi
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          {['Home', 'Insurances', 'Process', 'Testimonials', 'Contact'].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-primary transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-semibold hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="rounded-full px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* The New Custom Animated Hero */}
        <div id="home">
          <AnimatedHero />
        </div>

        {/* Global Truster Ticker */}
        <div className="border-y border-border/40 bg-muted/10 relative z-20 shadow-[-10px_-10px_30px_rgba(0,0,0,0.02)]">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none"></div>
          <LogoTicker />
        </div>

        {/* The New Interactive "All Insurance Types" Grid */}
        <div id="insurances" className="relative z-10">
          <InsuranceGrid />
        </div>

        {/* Animated Stats Section (Retained & Enhanced) */}
        <section id="process" className="py-24 px-6 lg:px-10 bg-background relative overflow-hidden">
          {/* subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Numbers that speak <span className="text-primary italic">volumes</span>.</h2>
              <p className="text-lg text-muted-foreground">Growing every day to protect what matters most across India.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: 15000, suffix: '+', label: 'Policies Sold', icon: FileText, color: 'text-blue-500' },
                { value: 50, suffix: 'Cr+', label: 'Claims Settled', prefix: '₹', icon: TrendingUp, color: 'text-emerald-500' },
                { value: 99, suffix: '%', label: 'CSAT Score', icon: Award, color: 'text-amber-500' },
                { value: 1200, suffix: '+', label: 'Partner Agents', icon: Users, color: 'text-purple-500' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-8 rounded-3xl bg-card border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className={`h-16 w-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 ${stat.color}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <p className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} duration={2500} />
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* High-Contrast CTA Section */}
        <section className="py-32 px-6 lg:px-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10 bg-card/60 backdrop-blur-2xl p-12 md:p-20 rounded-[3rem] border border-white/20 shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Transform</span> Your Coverage?</h2>
            <p className="text-xl text-muted-foreground">Join 10,000+ smart Indians managing their future digitally.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/signup">
                <Button size="lg" className="h-16 px-12 text-lg rounded-full shadow-[0_0_40px_rgba(var(--primary),0.5)] hover:scale-105 hover:shadow-[0_0_60px_rgba(var(--primary),0.8)] transition-all">
                  Get Your Free Quote Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-200 py-20 px-6 lg:px-10 rounded-t-[3rem] mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6 md:col-span-1">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              PolicySathi
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's first completely transparent, digital-first insurance management ecosystem.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"><Smartphone className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {['Home', 'About Us', 'Find Policy', 'Careers', 'Blog'].map(link => (
                <li key={link}><Link href="#" className="hover:text-white transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3 items-center">
                <Smartphone className="h-5 w-5 text-primary" />
                <span>+91 9977996697</span>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="h-5 w-5 text-primary" />
                <span>Mon - Fri, 10AM - 6PM</span>
              </li>
              <li className="flex gap-3 items-center">
                <Headphones className="h-5 w-5 text-primary" />
                <span>info@policysathi.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Mobile App</h4>
            <p className="text-sm text-slate-400 mb-6">Manage all policies in your pocket. Coming soon to iOS and Android.</p>
            <div className="flex flex-col gap-3">
              <Button className="w-full justify-start gap-3 bg-slate-800 hover:bg-slate-700 text-white border-none h-12">
                <Smartphone className="h-5 w-5" /> App Store
              </Button>
              <Button className="w-full justify-start gap-3 bg-slate-800 hover:bg-slate-700 text-white border-none h-12">
                <Globe className="h-5 w-5" /> Google Play
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; 2026 PolicySathi. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
