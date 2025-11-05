"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Image as ImageIcon, Send, X } from "lucide-react"
import { postService } from "@/services/postService"

interface CreatePostProps {
  onPostCreated: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Obtener usuario del localStorage
  const getUserInfo = () => {
    const userString = localStorage.getItem("user")
    if (userString) {
      const user = JSON.parse(userString)
      return { id: user.id, name: user.name }
    }
    return null
  }

  const handleSubmit = async () => {
    if (!content.trim()) return

    const user = getUserInfo()
    if (!user) {
      alert("Debes iniciar sesión para crear un post")
      return
    }

    setLoading(true)
    try {
      await postService.createPost(content, user.id, user.name)
      setContent("")
      setIsExpanded(false)
      onPostCreated()
    } catch (error) {
      console.error("Error al crear post:", error)
      alert("Error al crear el post")
    } finally {
      setLoading(false)
    }
  }

  const user = getUserInfo()

  return (
    <Card className="p-4 mb-6 bg-white shadow-md">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>

        {/* Input area */}
        <div className="flex-1">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
            >
              ¿Qué está pasando en Medellín?
            </button>
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="Comparte tu experiencia, pregunta algo o habla sobre eventos..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] resize-none border-slate-200 focus:border-blue-500"
                autoFocus
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50"
                    disabled
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Imagen
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false)
                      setContent("")
                    }}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!content.trim() || loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Publicar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
