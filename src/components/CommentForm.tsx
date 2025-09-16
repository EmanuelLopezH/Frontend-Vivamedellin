"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onAddComment: (content: string) => void
  isLoggedIn: boolean
  onLogin?: () => void // opcional, para luego conectar un flujo de login
}

export function CommentForm({ onAddComment, isLoggedIn, onLogin }: CommentFormProps) {
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    onAddComment(comment)
    setComment("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder={isLoggedIn ? "Write a comment..." : "You must log in to comment"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={!isLoggedIn}
      />

      {isLoggedIn ? (
        <Button type="submit">Add Comment</Button>
      ) : (
        <Button type="button" variant="outline" onClick={onLogin}>
          Login
        </Button>
      )}
    </form>
  )
}
