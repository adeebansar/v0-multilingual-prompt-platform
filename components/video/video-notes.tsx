"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Plus, Edit, Trash2, Clock, Save, X } from "lucide-react"

interface VideoNote {
  id: string
  timestamp: number
  content: string
  createdAt: Date
  tags: string[]
}

interface VideoNotesProps {
  videoId: string
  currentTime: number
  onSeekTo: (time: number) => void
}

export function VideoNotes({ videoId, currentTime, onSeekTo }: VideoNotesProps) {
  const [notes, setNotes] = useState<VideoNote[]>([
    {
      id: "1",
      timestamp: 120,
      content: "Key point: Always be specific about what you want the AI to do. Vague prompts lead to vague results.",
      createdAt: new Date("2024-01-15"),
      tags: ["key-point", "specificity"],
    },
    {
      id: "2",
      timestamp: 245,
      content: "Example of good role assignment: 'You are an experienced teacher explaining to a 10-year-old student.'",
      createdAt: new Date("2024-01-15"),
      tags: ["example", "role-assignment"],
    },
  ])

  const [newNote, setNewNote] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: VideoNote = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content: newNote.trim(),
      createdAt: new Date(),
      tags: [],
    }

    setNotes([...notes, note].sort((a, b) => a.timestamp - b.timestamp))
    setNewNote("")
  }

  const startEdit = (note: VideoNote) => {
    setEditingNote(note.id)
    setEditContent(note.content)
  }

  const saveEdit = () => {
    if (!editingNote || !editContent.trim()) return

    setNotes(notes.map((note) => (note.id === editingNote ? { ...note, content: editContent.trim() } : note)))
    setEditingNote(null)
    setEditContent("")
  }

  const cancelEdit = () => {
    setEditingNote(null)
    setEditContent("")
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Video Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Current time: {formatTime(currentTime)}
          </div>
          <Textarea
            placeholder="Add a note at the current timestamp..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={addNote} disabled={!newNote.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        <Separator />

        {/* Notes List */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Your Notes ({notes.length})</h4>

          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notes yet. Start taking notes while watching the video!
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => onSeekTo(note.timestamp)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Clock className="h-3 w-3" />
                        {formatTime(note.timestamp)}
                      </button>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(note)} className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {editingNote === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit}>
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm mb-2">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
