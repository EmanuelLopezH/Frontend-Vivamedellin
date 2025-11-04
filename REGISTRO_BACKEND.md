# 🔐 Sistema de Registro con Backend

## 📋 Resumen de Cambios

Se ha actualizado el componente `RegisterDialog` para conectarse con el backend real y cumplir con todas las especificaciones del API.

## 🔗 Configuración del Backend

### Endpoint de Registro
```
URL: http://localhost:8081/api/users/register
Método: POST
Content-Type: application/json
```

### Request Body
```json
{
  "name": "string (requerido, mínimo 3 caracteres)",
  "email": "string (requerido, formato email válido)",
  "password": "string (requerido, 8-20 caracteres)",
  "about": "string (opcional, mínimo 10 caracteres)"
}
```

### Requisitos de Contraseña
La contraseña debe cumplir con TODOS estos requisitos:
- ✅ 8-20 caracteres
- ✅ 1 letra mayúscula (A-Z)
- ✅ 1 letra minúscula (a-z)
- ✅ 1 número (0-9)
- ✅ 1 carácter especial (@$!%*?&)

### Response Exitoso (201 Created)
```json
{
  "id": 1,
  "name": "Usuario Ejemplo",
  "email": "email@ejemplo.com",
  "about": "Descripción del usuario",
  "profileImage": null,
  "roles": ["ROLE_USER"]
}
```

### Errores Posibles
| Código | Descripción | Mensaje Frontend |
|--------|-------------|------------------|
| 409 | Email ya existe | "Este email ya está registrado" |
| 400 | Validación fallida | Mensaje del servidor o "Datos inválidos" |
| 500 | Error del servidor | "Error del servidor. Intenta de nuevo más tarde" |
| Network | Sin conexión | "No se pudo conectar con el servidor" |

## 🎨 Características del Formulario

### 1. Campos del Formulario
```tsx
✅ Nombre Completo (name) - mínimo 3 caracteres
✅ Email (email) - formato válido
✅ Contraseña (password) - requisitos especiales
✅ Sobre ti (about) - opcional, mínimo 10 caracteres
```

### 2. Validación en Tiempo Real
- **Indicador visual** de cada requisito de contraseña
- **Colores dinámicos**: verde ✅ cuando se cumple, gris ⭕ cuando no
- **Alertas tempranas**: muestra advertencias si los campos no cumplen requisitos
- **Contador de caracteres** en el campo "about"

### 3. Estados de la UI

#### Estado Normal
```tsx
- Todos los campos habilitados
- Botón "Crear Cuenta" habilitado solo si la contraseña es válida
- Sin mensajes de error/éxito
```

#### Estado Cargando
```tsx
- Campos deshabilitados
- Botón muestra "Creando cuenta..." con spinner animado
- Botón de cancelar deshabilitado
```

#### Estado de Error
```tsx
- Alert rojo con icono X
- Mensaje de error específico
- Campos habilitados para corrección
```

#### Estado de Éxito
```tsx
- Alert verde con icono de check
- Mensaje: "¡Cuenta creada exitosamente! Redirigiendo..."
- Cierre automático después de 2 segundos
- Abre modal de login automáticamente
```

## 🎯 Flujo de Usuario

### Registro Exitoso
```
1. Usuario llena el formulario
2. Valida contraseña en tiempo real
3. Click en "Crear Cuenta"
4. Muestra spinner "Creando cuenta..."
5. Envía POST al backend
6. Backend retorna 201
7. Muestra mensaje de éxito verde
8. Espera 2 segundos
9. Cierra modal de registro
10. Abre modal de login automáticamente
```

### Registro Fallido (Email Duplicado)
```
1. Usuario llena el formulario
2. Click en "Crear Cuenta"
3. Envía POST al backend
4. Backend retorna 409
5. Muestra error: "Este email ya está registrado"
6. Usuario puede corregir el email
```

### Cambio a Login
```
1. Usuario click en "¿Ya tienes cuenta?"
2. Cierra modal de registro
3. Abre modal de login
```

## 💅 Estilos con Tailwind

### Gradientes
```tsx
// Header del modal
bg-gradient-to-br from-blue-600 to-purple-600

// Botón de submit
bg-gradient-to-r from-blue-600 to-purple-600
hover:from-blue-700 hover:to-purple-700
```

### Alertas
```tsx
// Error
bg-red-50 border border-red-200 text-red-900

// Éxito
bg-green-50 border border-green-200 text-green-900

// Advertencia
bg-amber-50 text-amber-600
```

### Requisitos de Contraseña
```tsx
// Cumplido
text-green-700 + CheckCircle2 icon (green-600)

// No cumplido
text-slate-600 + XCircle icon (slate-400)
```

## 🔧 Componentes Utilizados

### De Shadcn UI
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `DialogDescription`
- `Button` (con variantes: default, outline)
- `Input` (type: text, email, password)
- `Textarea` (para el campo "about")
- `Label`

### Iconos de Lucide React
- `User` - Header del modal
- `CheckCircle2` - Requisitos cumplidos, éxito
- `XCircle` - Requisitos no cumplidos, error
- `AlertCircle` - Advertencias

## 📝 Código Ejemplo de Uso

### En la página principal (Index.tsx)
```tsx
const [registerOpen, setRegisterOpen] = useState(false)
const [loginOpen, setLoginOpen] = useState(false)

<RegisterDialog 
  open={registerOpen}
  onClose={() => setRegisterOpen(false)}
  onRegisterSuccess={() => {
    console.log("✅ Registro exitoso")
    // Se abre automáticamente el login
  }}
  onSwitchToLogin={() => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }}
/>
```

## 🧪 Testing Manual

### Test 1: Registro Exitoso
```
1. Abrir modal de registro
2. Llenar:
   - Nombre: "Juan Pérez"
   - Email: "juan.perez@example.com"
   - Password: "Password123!"
   - About: "Amante de los eventos en Medellín"
3. Verificar que todos los requisitos de password estén en verde
4. Click en "Crear Cuenta"
5. ✅ Debe mostrar éxito y abrir login
```

### Test 2: Email Duplicado
```
1. Intentar registrar con email existente
2. ✅ Debe mostrar error: "Este email ya está registrado"
```

### Test 3: Validación de Contraseña
```
1. Escribir "abc123" en password
2. ✅ Debe mostrar que faltan mayúscula y carácter especial
3. Botón "Crear Cuenta" debe estar deshabilitado
```

### Test 4: Campo Opcional
```
1. Llenar solo los campos requeridos (sin "about")
2. ✅ Debe permitir crear cuenta sin problemas
```

### Test 5: Error de Conexión
```
1. Apagar el backend
2. Intentar registrar
3. ✅ Debe mostrar: "No se pudo conectar con el servidor"
```

## 🚀 Próximos Pasos

1. **Integrar con Login**: Después del registro exitoso, pre-llenar el email en el login
2. **Verificación de Email**: Enviar código de verificación al email
3. **Google OAuth**: Botón de "Registrarse con Google"
4. **Foto de Perfil**: Subir imagen durante el registro
5. **Progress Bar**: Mostrar progreso del registro en varios pasos

## 📊 Métricas de UX

- ✅ Validación en tiempo real
- ✅ Feedback inmediato
- ✅ Mensajes de error claros
- ✅ Estados de carga visibles
- ✅ Responsive design
- ✅ Accesibilidad (labels, required fields)
- ✅ Flujo intuitivo entre modales

---

**Última actualización**: Noviembre 4, 2025
**Versión Backend**: 1.0
**Compatible con**: React 18 + TypeScript + Tailwind CSS
