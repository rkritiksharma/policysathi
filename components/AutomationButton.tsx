'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { checkExpiringPoliciesManual } from '@/app/(dashboard)/reminders/actions'
import { toast } from 'sonner'

export function AutomationButton() {
    const [loading, setLoading] = useState(false)

    const handleRun = async () => {
        setLoading(true)
        try {
            const result = await checkExpiringPoliciesManual()
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
            }
        } catch (error) {
            toast.error('Failed to run automation')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={loading}
            className="h-8 gap-2"
        >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Check Renewals'}
        </Button>
    )
}
