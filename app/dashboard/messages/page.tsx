"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Eye, Trash2, Mail } from "lucide-react"
import { toast } from "sonner"

type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMessages = async () => {
    const res = await fetch("/api/contact")
    if (!res.ok) {
      toast.error("Failed to load messages")
      setLoading(false)
      return
    }

    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleToggleRead = async (message: ContactMessage) => {
    const res = await fetch(`/api/contact/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !message.read }),
    })

    if (res.ok) {
      fetchMessages()
    } else {
      toast.error("Failed to update message")
    }
  }

  const handleExpand = async (message: ContactMessage) => {
    const isExpanding = expandedId !== message.id
    setExpandedId(isExpanding ? message.id : null)

    if (isExpanding && !message.read) {
      await fetch(`/api/contact/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
      fetchMessages()
    }
  }

  const handleDelete = async (message: ContactMessage) => {
    if (!confirm(`Delete message from ${message.name}? This cannot be undone.`)) return

    const res = await fetch(`/api/contact/${message.id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Message deleted")
      if (expandedId === message.id) setExpandedId(null)
      fetchMessages()
    } else {
      toast.error("Failed to delete message")
    }
  }

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {messages.length} messages total
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No messages found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((message) => (
            <Card key={message.id} className={`overflow-hidden ${!message.read ? "border-primary/40" : ""}`}>
              <div className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{message.name}</p>
                        {!message.read && <Badge>New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                      <p className="text-sm font-medium mt-1">{message.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRead(message)}
                    >
                      {message.read ? "Mark unread" : "Mark read"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExpand(message)}
                      className="gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {expandedId === message.id ? "Hide" : "View"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(message)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {expandedId === message.id && (
                <div className="border-t border-border p-4 bg-muted/30">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-semibold mb-1">From</p>
                      <p className="text-muted-foreground">
                        {message.name} &lt;{message.email}&gt;
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Subject</p>
                      <p className="text-muted-foreground">{message.subject}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Message</p>
                      <p className="text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <div>
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Reply via email
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
