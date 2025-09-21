"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, setCurrentUser } from "@/mocks/mockUsers"

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const [name, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí va la lógica real de autenticación (API o mock)
    try {
      const user = await login(name, password)   // 🔑 validar usuario
      setCurrentUser(user)                           // ✅ guardar usuario logueado
      onLoginSuccess()                               // notificar al padre
      onClose()                                      // cerrar modal
    } catch (err) {
      setError("Usuario o contraseña incorrectos")   // mensaje de error
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="submit">Login</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}