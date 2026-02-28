'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StickyNote, Save, Loader2, Plus, Trash2 } from 'lucide-react'

interface Note {
    id: string
    text: string
    created_at: string
}

interface CustomerNotesProps {
    customerId: string
    initialNotes?: string
}

export function CustomerNotes({ customerId, initialNotes = '' }: CustomerNotesProps) {
    const [notes, setNotes] = useState<Note[]>([])
    const [newNote, setNewNote] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load notes from localStorage (can be replaced with DB later)
        const savedNotes = localStorage.getItem(`customer_notes_${customerId}`)
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes))
        }
        setIsLoading(false)
    }, [customerId])

    const saveNotes = (updatedNotes: Note[]) => {
        localStorage.setItem(`customer_notes_${customerId}`, JSON.stringify(updatedNotes))
        setNotes(updatedNotes)
    }

    const addNote = () => {
        if (!newNote.trim()) return
        setIsSaving(true)

        const note: Note = {
            id: Date.now().toString(),
            text: newNote.trim(),
            created_at: new Date().toISOString()
        }

        setTimeout(() => {
            const updatedNotes = [note, ...notes]
            saveNotes(updatedNotes)
            setNewNote('')
            setIsSaving(false)
        }, 300)
    }

    const deleteNote = (id: string) => {
        const updatedNotes = notes.filter(n => n.id !== id)
        saveNotes(updatedNotes)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-amber-500" />
                    Notes & Remarks
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add New Note */}
                <div className="space-y-2">
                    <Textarea
                        placeholder="Add a note about this customer..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[80px] resize-none bg-amber-50/50 border-amber-200 focus:border-amber-300"
                    />
                    <Button
                        onClick={addNote}
                        disabled={!newNote.trim() || isSaving}
                        size="sm"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Note
                    </Button>
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {notes.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-4">
                            No notes yet. Add your first note above.
                        </p>
                    ) : (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="p-3 bg-gray-50 rounded-lg border border-gray-100 group relative"
                            >
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                <p className="text-sm text-gray-700 pr-6">{note.text}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {formatDate(note.created_at)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
