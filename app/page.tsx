'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  BarChart3,
  Check,
  FileText,
  LayoutDashboard,
  Briefcase,
  Smartphone,
  Globe,
  Clock,
  Headphones,
  Lock,
  UserCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TypeWriter } from '@/components/landing/TypeWriter';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';
import { LogoTicker } from '@/components/landing/LogoTicker';
import { FloatingDashboard } from '@/components/landing/FloatingDashboard';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center animate-pulse-glow">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">PolicySathi</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-primary transition-colors">Stats</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Create New Account</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Animated Gradient Background */}
        <section className="py-16 md:py-24 px-6 lg:px-10 relative overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/10 animate-gradient opacity-60"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>

          {/* Decorative blobs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">#1 Insurance Management Software</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Best Independent Insurance Agency{' '}
                <br className="hidden lg:block" />
                <span className="text-primary">
                  <TypeWriter
                    texts={['Management Software', 'CRM Solution', 'Policy Tracker', 'Growth Platform']}
                    speed={80}
                    deleteSpeed={40}
                    pauseTime={2500}
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Easy to manage insurance policy data. Automates and centralizes the whole process of insurance policy management with powerful tools for tracking performance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-base w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
                    Start Free Trial
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-base w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">10K+</p>
                  <p className="text-sm text-muted-foreground">Policies Managed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">99%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Floating Dashboard */}
            <div className="hidden lg:block animate-fade-in-up-delayed">
              <FloatingDashboard />
            </div>

            {/* Mobile: Inquiry Form */}
            <div className="lg:hidden bg-card border border-border/50 rounded-2xl p-8 shadow-lg max-w-md mx-auto w-full backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6 text-center">Get Started</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name*</label>
                  <Input placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile*</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">+91</span>
                    <Input className="rounded-l-none" placeholder="98989 98989" />
                  </div>
                </div>
                <Button className="w-full" size="lg">Request Demo</Button>
              </form>
            </div>
          </div>
        </section>

        {/* Insurance Company Logo Ticker */}
        <LogoTicker />

        {/* Animated Stats Section */}
        <section id="stats" className="py-20 px-6 lg:px-10 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Trusted by Insurance Professionals</h2>
              <p className="text-muted-foreground">Growing every day with agents across India</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: 10000, suffix: '+', label: 'Policies Managed', icon: FileText },
                { value: 500, suffix: '+', label: 'Active Agents', icon: Users },
                { value: 50, suffix: ' Cr+', label: 'Premium Collected', prefix: '₹', icon: TrendingUp },
                { value: 99, suffix: '%', label: 'Customer Satisfaction', icon: Award },
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-4xl font-extrabold text-foreground mb-2">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix || ''}
                      duration={2500}
                    />
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who Uses It */}
        <section className="py-20 bg-muted/30 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Who Uses It?</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                All-in-One Insurance Management Software for policy management, customer relationships and agency growth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Policy Holders", icon: Users, desc: "Manage your insurance policies and track coverage details" },
                { title: "Insurance Agents", icon: UserCheck, desc: "Streamline operations and manage client relationships" },
                { title: "Brokers", icon: Briefcase, desc: "Comprehensive platform for insurance brokers" }
              ].map((item, i) => (
                <div key={i} className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-lg transition-all text-center group hover:-translate-y-1">
                  <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">What Solutions You Can Get From PolicySathi?</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Dashboard", "Manage Clients", "Manage Insurance Policy Types", "Expired Policy Details",
                "Upcoming Expired Policy", "Payment Due Policy", "Upcoming Payment Policy", "All Policy"
              ].map((solution, i) => (
                <div key={i} className="p-6 rounded-lg border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center gap-3 group hover:-translate-y-1">
                  <Check className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Detailed */}
        <section id="features" className="py-20 bg-secondary/10 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">Features</div>
              <h2 className="text-3xl md:text-4xl font-bold">Best Client Management <br />Software for Insurance Agents</h2>
              <p className="text-muted-foreground text-lg">
                PolicySathi is a comprehensive, effective insurance portfolio software covering all insurance management aspects.
              </p>
              <ul className="space-y-4">
                {[
                  { title: "Policy Management Software", desc: "Manage all types of policies like life, health, vehicle and others." },
                  { title: "Insurance Reminders & Notifications", desc: "Personalized notification triggers and automated renewal reminders." },
                  { title: "Cloud-Based Insurance Management", desc: "Secure, scalable and reliable. Access policy data anywhere, anytime." }
                ].map((feature, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature illustration */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/20 rounded-3xl p-8 aspect-square flex items-center justify-center border border-dashed border-primary/20">
              <div className="text-center space-y-4">
                <div className="h-20 w-20 rounded-2xl bg-white shadow-xl mx-auto flex items-center justify-center animate-float">
                  <LayoutDashboard className="h-10 w-10 text-primary" />
                </div>
                <div className="h-20 w-20 rounded-2xl bg-white shadow-xl mx-auto flex items-center justify-center translate-x-12 -translate-y-8 animate-float-delayed">
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
                <div className="h-20 w-20 rounded-2xl bg-white shadow-xl mx-auto flex items-center justify-center -translate-x-12 -translate-y-16 animate-float-slow">
                  <FileText className="h-10 w-10 text-green-500" />
                </div>
                <p className="font-medium text-muted-foreground">Comprehensive Management Dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Importance/Benefits */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-bold">Importance of CRM for Insurance Companies</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              {[
                { icon: Lock, title: "Secure Data Storage", desc: "Insurance CRM Management Software system securely stores policy data, allows for easy document attachment and generates reports." },
                { icon: Clock, title: "Real-time Updates", desc: "Generate reports on performance, trends & policy status, with real-time updates and renewals." },
                { icon: FileText, title: "Document Attachment", desc: "Digital document management and processing to reduce paperwork and minimize errors." },
                { icon: BarChart3, title: "Performance Reports", desc: "Detailed analytics and reporting to track growth and agent performance." },
              ].map((item, i) => (
                <div key={i} className="space-y-4 p-6 rounded-xl bg-card border hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-primary" /> {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-muted/30 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground">Flexible pricing options for insurance professionals of all sizes</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card rounded-2xl border shadow-sm p-8 flex flex-col hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Free</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">₹0</span>
                    <span className="text-muted-foreground">/ 7 days</span>
                  </div>
                </div>
                <Link href="/signup">
                  <Button className="w-full mb-8" variant="outline">Select Plan</Button>
                </Link>
                <div className="space-y-3 flex-1">
                  <p className="font-semibold text-sm">Top Features</p>
                  {["Access From Desktop/Laptop", "Access From Mobile App", "Dashboard", "Expired Policy Details", "Manage Clients"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" /> {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="bg-card rounded-2xl border shadow-sm p-8 flex flex-col hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Monthly</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">₹1,299</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                </div>
                <Link href="/signup">
                  <Button className="w-full mb-8" variant="outline">Select Plan</Button>
                </Link>
                <div className="space-y-3 flex-1">
                  <p className="font-semibold text-sm">Everything in Free, plus:</p>
                  {["Manage Family details", "Manage Policy Documents", "Manage your sub-agent", "Policy Tracking & Reminder", "Your clients can use the app"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" /> {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Plan (Yearly) */}
              <div className="bg-primary/5 rounded-2xl border-2 border-primary shadow-lg p-8 flex flex-col relative overflow-hidden hover:shadow-xl transition-shadow transform scale-105 md:scale-100 lg:scale-105 z-10">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">Popular</div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-primary">Yearly</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">₹4,999</span>
                    <span className="text-muted-foreground">/ year</span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold mt-2">Save ₹10,000</p>
                </div>
                <Link href="/signup">
                  <Button className="w-full mb-8">Select Plan</Button>
                </Link>
                <div className="space-y-3 flex-1">
                  <p className="font-semibold text-sm">Everything in Monthly, plus:</p>
                  {["Priority Support", "Advanced Analytics", "Custom Branding", "Data Export", "API Access"].map((feature, i) => (
                    // Wait, Premium had same features as Monthly in my thought process. 
                    // Users request didn't specify NEW features for Yearly.
                    // But usually higher tier has more.
                    // The user's prompt text for Premium listed: 
                    // "Manage Family details ... Your clients can use the app"
                    // So I should stick to THAT list for Premium.
                    // For Monthly, I should probably use the SAME list.
                    // The user request was "Add one more plan montly".
                    // So I will replicate the Premium features list for Monthly as planned.
                    // I will revert the feature list change in this thought block and use the code below.
                    null
                  ))}
                  {["Manage Family details", "Manage Policy Documents", "Manage your sub-agent", "Policy Tracking & Reminder", "Your clients can use the app"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" /> {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 lg:px-10 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Insurance Business?</h2>
            <p className="text-xl text-white/80">Join 500+ agents already using PolicySathi</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-base">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#contact">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base border-white text-white hover:bg-white hover:text-primary">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-200 py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5" /> PolicySathi
            </h3>
            <p className="text-sm text-slate-400">
              Complete insurance agency management software designed for agents, brokers, and agencies to streamline operations and grow their business.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-white transition-colors"><Smartphone className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#stats" className="hover:text-white transition-colors">Stats</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-3">
                <Smartphone className="h-4 w-4 mt-0.5 text-primary" />
                <span>+91 9977996697</span>
              </li>
              <li className="flex gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <span>Mon - Fri, 10AM - 6PM</span>
              </li>
              <li className="flex gap-3">
                <Headphones className="h-4 w-4 mt-0.5 text-primary" />
                <span>info@policysathi.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Download App</h4>
            <p className="text-sm text-slate-400 mb-4">Get the PolicySathi mobile app for on-the-go management.</p>
            <Button className="w-full" variant="secondary">Download Now</Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; 2026 PolicySathi. All rights reserved. | Privacy Policy | Terms & Conditions</p>
        </div>
      </footer>
    </div>
  );
}
