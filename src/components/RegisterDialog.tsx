"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onRegisterSuccess: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterDialog({
  open,
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validación en tiempo real de la contraseña
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const hasValidLength = password.length >= 8 && password.length <= 20;

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      hasValidLength,
      isValid:
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        hasValidLength,
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validaciones del frontend
    if (formData.name.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("La contraseña no cumple con todos los requisitos");
      return;
    }

    if (formData.about && formData.about.length < 10) {
      setError("La descripción debe tener al menos 10 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://vivemedellin-backend.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            about: formData.about || undefined,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Usuario registrado exitosamente:", data);

        setSuccess("¡Cuenta creada exitosamente! Redirigiendo...");

        // Limpiar formulario
        setFormData({
          name: "",
          email: "",
          password: "",
          about: "",
        });

        // Esperar 2 segundos y cerrar el modal
        setTimeout(() => {
          onRegisterSuccess();
          onClose();
        }, 2000);
      } else {
        // Manejar errores del servidor
        const errorData = await response.json().catch(() => null);

        if (response.status === 409) {
          setError(errorData?.message || "Este email ya está registrado");
        } else if (response.status === 400) {
          setError(
            errorData?.message || "Datos inválidos. Verifica los campos"
          );
        } else if (response.status === 500) {
          setError("Error del servidor. Intenta de nuevo más tarde");
        } else {
          setError("Error al crear cuenta. Por favor intenta de nuevo");
        }
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("No se pudo conectar con el servidor. Verifica tu conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            Crear Cuenta
          </DialogTitle>
          <DialogDescription className="text-base">
            Únete a ViveMedellín y descubre los mejores eventos de la ciudad
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nombre Completo *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Juan Pérez García"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="h-11"
              required
            />
            {formData.name && formData.name.length < 3 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Mínimo 3 caracteres
              </p>
            )}
          </div>

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
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="h-11"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña *
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="h-11"
              required
            />

            {/* Requisitos de contraseña */}
            {formData.password && (
              <div className="space-y-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-2">
                  Requisitos de contraseña:
                </p>
                <div className="space-y-1">
                  <PasswordRequirement
                    met={passwordValidation.hasValidLength}
                    text="8-20 caracteres"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasUpperCase}
                    text="1 letra mayúscula"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasLowerCase}
                    text="1 letra minúscula"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasNumber}
                    text="1 número"
                  />
                  <PasswordRequirement
                    met={passwordValidation.hasSpecialChar}
                    text="1 carácter especial (@$!%*?&)"
                  />
                </div>
              </div>
            )}
          </div>

          {/* About (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="about" className="text-sm font-medium">
              Sobre ti <span className="text-slate-400">(opcional)</span>
            </Label>
            <Textarea
              id="about"
              name="about"
              placeholder="Cuéntanos un poco sobre ti... (mínimo 10 caracteres)"
              value={formData.about}
              onChange={handleChange}
              disabled={loading}
              className="min-h-[80px] resize-none"
              rows={3}
            />
            {formData.about && formData.about.length < 10 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Mínimo 10 caracteres ({formData.about.length}/10)
              </p>
            )}
          </div>

          {/* Mensajes de error/éxito */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">¡Éxito!</p>
                <p className="text-sm text-green-700">{success}</p>
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
              disabled={loading || !passwordValidation.isValid}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </DialogFooter>

          {/* Link a login */}
          <div className="text-center pt-2 border-t">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLogin?.();
              }}
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
              disabled={loading}
            >
              ¿Ya tienes cuenta?{" "}
              <span className="font-medium text-blue-600 hover:underline">
                Inicia sesión
              </span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar para mostrar requisitos de contraseña
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-slate-400" />
      )}
      <span className={met ? "text-green-700" : "text-slate-600"}>{text}</span>
    </div>
  );
}
