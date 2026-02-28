'use client'

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"
import { useState } from "react"

export function MobileSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 lg:hidden">
                    <Menu className="h-6 w-6 text-gray-600" />
                    <span className="sr-only">Toggle menu</span>
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-gray-100 w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar className="border-none w-full h-full" />
            </SheetContent>
        </Sheet>
    )
}
