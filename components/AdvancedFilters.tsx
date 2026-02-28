"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { Badge } from "@/components/ui/badge"
import { X, Save, RotateCcw } from "lucide-react"
import { DateRange } from "react-day-picker"
import { toast } from "@/lib/toast"

interface FilterConfig {
    search?: string
    statuses?: string[]
    companies?: string[]
    dateRange?: DateRange
}

interface AdvancedFiltersProps {
    onFilterChange: (filters: FilterConfig) => void
    savedPresets?: Array<{ name: string; filters: FilterConfig }>
    onSavePreset?: (name: string, filters: FilterConfig) => void
}

export function AdvancedFilters({
    onFilterChange,
    savedPresets = [],
    onSavePreset,
}: AdvancedFiltersProps) {
    const [filters, setFilters] = React.useState<FilterConfig>({})
    const [presetName, setPresetName] = React.useState("")

    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Expired", value: "expired" },
    ]

    const companyOptions = [
        { label: "LIC", value: "lic" },
        { label: "HDFC Life", value: "hdfc" },
        { label: "ICICI Prudential", value: "icici" },
        { label: "SBI Life", value: "sbi" },
        { label: "Max Life", value: "max" },
    ]

    const handleFilterChange = (key: keyof FilterConfig, value: any) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleReset = () => {
        setFilters({})
        onFilterChange({})
        toast.info("Filters reset")
    }

    const handleSavePreset = () => {
        if (!presetName.trim()) {
            toast.error("Error", "Please enter a preset name")
            return
        }
        if (onSavePreset) {
            onSavePreset(presetName, filters)
            toast.success("Saved!", `Preset "${presetName}" saved`)
            setPresetName("")
        }
    }

    const handleLoadPreset = (preset: { name: string; filters: FilterConfig }) => {
        setFilters(preset.filters)
        onFilterChange(preset.filters)
        toast.success("Loaded", `Preset "${preset.name}" loaded`)
    }

    const activeFilterCount = Object.values(filters).filter((v) =>
        Array.isArray(v) ? v.length > 0 : v
    ).length

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Advanced Filters</CardTitle>
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary">{activeFilterCount} active</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search */}
                <div className="space-y-2">
                    <Label>Search</Label>
                    <Input
                        placeholder="Search by name, policy number..."
                        value={filters.search || ""}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label>Status</Label>
                    <MultiSelect
                        options={statusOptions}
                        selected={filters.statuses || []}
                        onChange={(selected) => handleFilterChange("statuses", selected)}
                        placeholder="Select statuses..."
                    />
                </div>

                {/* Company Filter */}
                <div className="space-y-2">
                    <Label>Company</Label>
                    <MultiSelect
                        options={companyOptions}
                        selected={filters.companies || []}
                        onChange={(selected) => handleFilterChange("companies", selected)}
                        placeholder="Select companies..."
                    />
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <Label>Date Range</Label>
                    <DatePickerWithRange
                        date={filters.dateRange}
                        onDateChange={(range) => handleFilterChange("dateRange", range)}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>

                {/* Save Preset */}
                {onSavePreset && (
                    <div className="pt-4 border-t space-y-2">
                        <Label>Save as Preset</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Preset name..."
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                            />
                            <Button onClick={handleSavePreset}>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                        </div>
                    </div>
                )}

                {/* Saved Presets */}
                {savedPresets.length > 0 && (
                    <div className="pt-4 border-t space-y-2">
                        <Label>Saved Presets</Label>
                        <div className="flex flex-wrap gap-2">
                            {savedPresets.map((preset, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleLoadPreset(preset)}
                                >
                                    {preset.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
