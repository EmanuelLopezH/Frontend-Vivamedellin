"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, setCurrentUser } from "@/mocks/mockUsers"
import { LogIn } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const [name, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const user = await login(name, password)
      setCurrentUser(user)
      onLoginSuccess()
      onClose()
      
      setUsername("")
      setPassword("")
    } catch (err) {
      setError("Usuario o contraseña incorrectos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Usuario</Label>
            <Input
              id="name"
              type="text"
              placeholder="tu_usuario"
              value={name}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(null)
              }}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              disabled={loading}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}