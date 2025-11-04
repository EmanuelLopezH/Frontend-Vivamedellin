"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Eye, EyeOff, XCircle, AlertCircle } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onLoginSuccess: () => void
  onSwitchToRegister?: () => void
}

export function LoginDialog({ open, onClose, onLoginSuccess, onSwitchToRegister }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validación básica del email
    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor ingresa un email válido")
      return
    }

    if (password.length < 1) {
      setError("Por favor ingresa tu contraseña")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Login exitoso:", data)

        // Guardar token en localStorage
        localStorage.setItem("token", data.token)

        // Guardar usuario completo en localStorage
        localStorage.setItem("user", JSON.stringify(data.user))

        // Mostrar en consola para debugging
        console.log("🔑 Token guardado:", data.token)
        console.log("👤 Usuario guardado:", data.user)

        // Limpiar formulario
        setEmail("")
        setPassword("")

        // Cerrar modal
        onClose()
        onLoginSuccess()

        // Redireccionar a la página de posts
        setTimeout(() => {
          window.location.href = "/posts"
        }, 100)

      } else {
        // Manejar errores del servidor
        const errorData = await response.json().catch(() => null)

        if (response.status === 401) {
          setError("Email o contraseña incorrectos")
        } else if (response.status === 400) {
          setError(errorData?.message || "Datos inválidos. Verifica los campos")
        } else if (response.status === 500) {
          setError("Error de conexión con el servidor")
        } else {
          setError("Error al iniciar sesión. Intenta de nuevo")
        }
      }
    } catch (err) {
      console.error("Error en el login:", err)
      setError("No se pudo conectar con el servidor. Verifica tu conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            Iniciar Sesión
          </DialogTitle>
          <DialogDescription className="text-base">
            Ingresa tus credenciales para acceder a tu cuenta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              disabled={loading}
              className="h-11"
              required
            />
            {email && (!email.includes("@") || !email.includes(".")) && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Formato de email inválido
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña *
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                className="h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <DialogFooter className="gap-3 sm:gap-3 flex-col sm:flex-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Iniciando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </DialogFooter>

          {/* Link a registro */}
          <div className="text-center pt-2 border-t">
            <button
              type="button"
              onClick={() => {
                onClose()
                onSwitchToRegister?.()
              }}
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
              disabled={loading}
            >
              ¿No tienes cuenta?{" "}
              <span className="font-medium text-blue-600 hover:underline">
                Regístrate
              </span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}