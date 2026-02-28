"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { Keyboard } from "lucide-react"

export default function KeyboardDemo() {
    useKeyboardShortcuts()

    const shortcuts = [
        {
            keys: ["Ctrl", "K"],
            description: "Open command menu",
            category: "Navigation",
        },
        {
            keys: ["Ctrl", "N"],
            description: "New customer",
            category: "Actions",
        },
        {
            keys: ["Ctrl", "S"],
            description: "Save (in forms)",
            category: "Actions",
        },
        {
            keys: ["Esc"],
            description: "Close modals/dialogs",
            category: "General",
        },
        {
            keys: ["Ctrl", "/"],
            description: "Show keyboard shortcuts help",
            category: "Help",
        },
    ]

    const categories = Array.from(new Set(shortcuts.map((s) => s.category)))

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex items-center gap-3">
                <Keyboard className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Keyboard Shortcuts</h1>
                    <p className="text-gray-500">Boost your productivity with keyboard shortcuts</p>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Try It Now!</span>
                    </CardTitle>
                    <CardDescription>
                        Press <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Ctrl+K</kbd> to open the command menu
                    </CardDescription>
                </CardHeader>
            </Card>

            {categories.map((category) => (
                <Card key={category}>
                    <CardHeader>
                        <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {shortcuts
                                .filter((s) => s.category === category)
                                .map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-sm font-medium">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, i) => (
                                                <span key={i} className="flex items-center gap-1">
                                                    <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono shadow-sm">
                                                        {key}
                                                    </kbd>
                                                    {i < shortcut.keys.length - 1 && (
                                                        <span className="text-gray-400 text-xs">+</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardHeader>
                    <CardTitle>Command Menu Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Quick Navigation:</strong> Jump to any page instantly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Search:</strong> Type to filter commands</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Actions:</strong> Create new customers, policies, etc.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span><strong>Keyboard Navigation:</strong> Use arrow keys to navigate, Enter to select</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
