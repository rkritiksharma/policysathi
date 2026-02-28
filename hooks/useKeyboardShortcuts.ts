"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/toast"

export function useKeyboardShortcuts() {
    const router = useRouter()

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            // Ctrl+N - New Customer
            if (event.ctrlKey && event.key === "n") {
                event.preventDefault()
                router.push("/customers/new")
                toast.info("Opening new customer form")
            }

            // Ctrl+S - Save (prevent default browser save)
            if (event.ctrlKey && event.key === "s") {
                event.preventDefault()
                // This will be handled by individual forms
                const saveEvent = new CustomEvent("keyboard-save")
                document.dispatchEvent(saveEvent)
            }

            // Escape - Close modals/dialogs
            if (event.key === "Escape") {
                const escapeEvent = new CustomEvent("keyboard-escape")
                document.dispatchEvent(escapeEvent)
            }

            // Ctrl+/ - Show keyboard shortcuts help
            if (event.ctrlKey && event.key === "/") {
                event.preventDefault()
                toast.info("Keyboard Shortcuts", "Ctrl+K: Command Menu • Ctrl+N: New Customer • Ctrl+S: Save • Esc: Close")
            }
        },
        [router]
    )

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress)
        return () => {
            document.removeEventListener("keydown", handleKeyPress)
        }
    }, [handleKeyPress])
}
