"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

interface RegisterDialogProps {
  open: boolean
  onClose: () => void
  onRegisterSuccess: () => void
}

export function RegisterDialog({ open, onClose, onRegisterSuccess }: RegisterDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres")
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor ingresa un email válido")
      return
    }

    setLoading(true)

    try {
      // Aquí iría la llamada a la API de registro
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("✅ Usuario registrado:", formData)
      onRegisterSuccess()
      onClose()
      
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
    } catch (err) {
      setError("Error al registrar usuario. Por favor intenta de nuevo.")
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
            <User className="h-5 w-5" />
            Crear Cuenta
          </DialogTitle>
          <DialogDescription>
            Únete a ViveMedellín y descubre los mejores eventos de la ciudad
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="tu_usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
