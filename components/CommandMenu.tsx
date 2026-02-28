"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import {
    Search,
    Home,
    Users,
    FileText,
    BarChart3,
    Settings,
    Plus,
    LogOut,
    Moon,
    Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden p-0 shadow-lg">
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                        <Command.Empty className="py-6 text-center text-sm">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/dashboard"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <Home className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/customers"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <Users className="h-4 w-4" />
                                <span>Customers</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/policies"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <FileText className="h-4 w-4" />
                                <span>Policies</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/reports"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <BarChart3 className="h-4 w-4" />
                                <span>Reports</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/settings"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Separator className="h-px bg-border" />

                        <Command.Group heading="Actions">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/customers/new"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Customer</span>
                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">Ctrl+N</span>
                                </kbd>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/policies/new"))}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Policy</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                    <div className="border-t px-4 py-2 text-xs text-muted-foreground">
                        Tip: Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">Ctrl+K</kbd> to toggle
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    )
}
