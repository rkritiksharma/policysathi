'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to avoid hydration issues with browser extensions
const PolicyForm = dynamic(() => import('@/components/PolicyForm').then(mod => mod.PolicyForm), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
})

interface PolicyFormWrapperProps {
    customers: any[]
    companies: any[]
    initialData?: any
}

export function PolicyFormWrapper({ customers, companies, initialData }: PolicyFormWrapperProps) {
    // @ts-ignore - dynamic import props issue
    return <PolicyForm customers={customers} companies={companies} initialData={initialData} />
}
