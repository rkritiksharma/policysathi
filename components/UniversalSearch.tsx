'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, FileText, Car, Phone, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { universalSearch } from '@/app/(dashboard)/dashboard/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

export function UniversalSearch({ className }: { className?: string }) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<{ customers: any[], policies: any[] }>({ customers: [], policies: [] })
    const [activeIndex, setActiveIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const allItems = [...results.customers.map(c => ({ type: 'customer', ...c })), ...results.policies.map(p => ({ type: 'policy', ...p }))]

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults({ customers: [], policies: [] })
            return
        }

        const timer = setTimeout(async () => {
            setIsLoading(true)
            try {
                const data = await universalSearch(query)
                setResults(data)
            } catch (error) {
                console.error('Search error:', error)
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const hasResults = results.customers.length > 0 || results.policies.length > 0

    return (
        <div ref={containerRef} className={`relative w-full ${className || 'max-w-2xl mx-auto'}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by name, phone, policy number, vehicle number..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                        setActiveIndex(-1)
                    }}
                    onKeyDown={(e) => {
                        if (!hasResults) return

                        if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setActiveIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev))
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault()
                            setActiveIndex(prev => (prev > 0 ? prev - 1 : -1))
                        } else if (e.key === 'Enter' && activeIndex >= 0) {
                            e.preventDefault()
                            const item = allItems[activeIndex]
                            if (item.type === 'customer') router.push(`/customers/${item.id}`)
                            else router.push(`/policies/${item.id}`)
                            setIsOpen(false)
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="pl-12 pr-10 h-14 text-base bg-white border-2 border-gray-200 rounded-2xl shadow-lg focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400"
                    suppressHydrationWarning
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('')
                            setResults({ customers: [], policies: [] })
                            inputRef.current?.focus()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                {isLoading && (
                    <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {!hasResults && !isLoading && (
                        <div className="p-6 text-center text-gray-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>No results found for "{query}"</p>
                        </div>
                    )}

                    {/* Customers Section */}
                    {results.customers.length > 0 && (
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <User className="h-3 w-3" /> Customers
                            </div>
                            {results.customers.map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={`/customers/${customer.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${allItems.findIndex(i => i.id === customer.id && i.type === 'customer') === activeIndex
                                            ? 'bg-primary/5 border-primary/20'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                        {customer.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> {customer.phone}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Divider */}
                    {results.customers.length > 0 && results.policies.length > 0 && (
                        <div className="border-t border-gray-100 mx-3" />
                    )}

                    {/* Policies Section */}
                    {results.policies.length > 0 && (
                        <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                <FileText className="h-3 w-3" /> Policies
                            </div>
                            {results.policies.map((policy) => (
                                <Link
                                    key={policy.id}
                                    href={`/policies/${policy.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${allItems.findIndex(i => i.id === policy.id && i.type === 'policy') === activeIndex
                                            ? 'bg-primary/5 border-primary/20'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${policy.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        <Car className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {policy.customers?.name}
                                            <span className="text-xs text-gray-400 ml-2 font-mono">{policy.policy_number}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span className="font-mono uppercase">{policy.vehicle_reg_no}</span>
                                            <span className="text-gray-300">•</span>
                                            <span>{format(new Date(policy.expiry_date), 'dd MMM yy')}</span>
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${policy.status === 'Active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {policy.status}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Quick tip */}
                    {hasResults && (
                        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-xs text-gray-400 text-center">
                            Press Enter or click to view details
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
