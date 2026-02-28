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
                <Button variant="ghost" size="icon" className="lg:hidden" suppressHydrationWarning>
                    <Menu className="h-6 w-6 text-gray-600" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-gray-100 w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar className="border-none w-full h-full" />
            </SheetContent>
        </Sheet>
    )
}
