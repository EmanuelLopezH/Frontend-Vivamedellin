# 🔐 Sistema de Login con Backend

## 📋 Resumen de Cambios

Se ha actualizado el componente `LoginDialog` para conectarse con el backend REST API y manejar la autenticación JWT.

## 🔗 Configuración del Backend

### Endpoint de Login
```
URL: http://localhost:8081/api/users/login
Método: POST
Content-Type: application/json
```

### Request Body
```json
{
  "email": "string (requerido, formato email válido)",
  "password": "string (requerido)"
}
```

### Response Exitoso (200 OK)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "Nombre Usuario",
    "email": "email@ejemplo.com",
    "about": "Descripción del usuario",
    "profileImage": null,
    "roles": ["ROLE_USER"]
  }
}
```

### Errores Posibles
| Código | Descripción | Mensaje Frontend |
|--------|-------------|------------------|
| 401 | Credenciales inválidas | "Email o contraseña incorrectos" |
| 400 | Datos inválidos | Mensaje del servidor o "Datos inválidos" |
| 500 | Error del servidor | "Error de conexión con el servidor" |
| Network | Sin conexión | "No se pudo conectar con el servidor" |

## 🎨 Características del Formulario

### 1. Campos del Formulario
```tsx
✅ Email - con validación de formato en tiempo real
✅ Contraseña - con botón de mostrar/ocultar
```

### 2. Funcionalidad de Mostrar/Ocultar Contraseña
- **Icono de ojo** 👁️ para mostrar
- **Icono de ojo tachado** 👁️‍🗨️ para ocultar
- Toggle con un solo click
- Estado independiente del formulario

### 3. Validación en Tiempo Real
- **Email**: Muestra advertencia si no contiene @ o .
- **Validación frontend** antes de enviar al backend

### 4. Estados de la UI

#### Estado Normal
```tsx
- Campos habilitados
- Botón "Iniciar Sesión" habilitado
- Sin mensajes de error
```

#### Estado Cargando
```tsx
- Campos deshabilitados
- Botón muestra "Iniciando..." con spinner animado
- Botón de cancelar deshabilitado
- Toggle de contraseña deshabilitado
```

#### Estado de Error
```tsx
- Alert rojo con icono X
- Mensaje de error específico
- Campos habilitados para corrección
```

## 🎯 Flujo de Usuario

### Login Exitoso
```
1. Usuario ingresa email y contraseña
2. Click en "Iniciar Sesión"
3. Muestra spinner "Iniciando..."
4. Envía POST al backend
5. Backend retorna 200 OK con token y datos de usuario
6. Guarda token en localStorage como 'token'
7. Guarda usuario en localStorage como 'user' (JSON stringified)
8. Cierra el modal
9. Redirecciona a "/" (home)
```

### Login Fallido (Credenciales Incorrectas)
```
1. Usuario ingresa credenciales incorrectas
2. Click en "Iniciar Sesión"
3. Envía POST al backend
4. Backend retorna 401
5. Muestra error: "Email o contraseña incorrectos"
6. Usuario puede corregir los datos
```

### Cambio a Registro
```
1. Usuario click en "¿No tienes cuenta? Regístrate"
2. Cierra modal de login
3. Abre modal de registro
```

## 💾 Almacenamiento Local

### Token JWT
```javascript
localStorage.setItem('token', data.token)
// Ejemplo: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0..."
```

### Datos del Usuario
```javascript
localStorage.setItem('user', JSON.stringify(data.user))
// Ejemplo:
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "about": "Amante de eventos",
  "profileImage": null,
  "roles": ["ROLE_USER"]
}
```

### Recuperar Datos (para usar en otros componentes)
```javascript
// Obtener token
const token = localStorage.getItem('token')

// Obtener usuario
const userString = localStorage.getItem('user')
const user = userString ? JSON.parse(userString) : null

// Verificar si está logueado
const isLoggedIn = !!token && !!user

// Obtener rol del usuario
const isAdmin = user?.roles?.includes('ROLE_ADMIN')
```

## 🔒 Seguridad

### Token JWT
- Se guarda en localStorage (accesible solo desde el mismo dominio)
- Se debe incluir en todas las peticiones autenticadas
- Header: `Authorization: Bearer ${token}`

### Logout
Para cerrar sesión, simplemente limpiar el localStorage:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
window.location.href = '/'  // Redireccionar al home
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

// Advertencia (email inválido)
text-amber-600
```

### Input con Icono
```tsx
// Input de contraseña con botón de toggle
<div className="relative">
  <Input className="pr-10" />  // Padding derecho para el icono
  <button className="absolute right-3 top-1/2 -translate-y-1/2" />
</div>
```

## 🔧 Componentes Utilizados

### De Shadcn UI
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `DialogDescription`
- `Button` (con variantes: default, outline)
- `Input` (type: email, password, text)
- `Label`

### Iconos de Lucide React
- `LogIn` - Header del modal
- `Eye` - Mostrar contraseña
- `EyeOff` - Ocultar contraseña
- `XCircle` - Mensajes de error
- `AlertCircle` - Advertencias de validación

## 📝 Código Ejemplo de Uso

### En la página principal (Index.tsx)
```tsx
const [loginOpen, setLoginOpen] = useState(false)
const [registerOpen, setRegisterOpen] = useState(false)

const handleLoginSuccess = () => {
  console.log("✅ Login exitoso")
  // La redirección se hace automáticamente
}

<LoginDialog 
  open={loginOpen}
  onClose={() => setLoginOpen(false)}
  onLoginSuccess={handleLoginSuccess}
  onSwitchToRegister={() => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }}
/>
```

## 🧪 Testing Manual

### Test 1: Login Exitoso
```
1. Abrir modal de login
2. Ingresar:
   - Email: "user@example.com"
   - Password: "userpassword"
3. Click en "Iniciar Sesión"
4. ✅ Debe mostrar spinner
5. ✅ Debe guardar token y user en localStorage
6. ✅ Debe redireccionar a "/"
```

### Test 2: Credenciales Incorrectas
```
1. Ingresar email/password incorrectos
2. Click en "Iniciar Sesión"
3. ✅ Debe mostrar: "Email o contraseña incorrectos"
```

### Test 3: Validación de Email
```
1. Escribir "usuario" (sin @)
2. ✅ Debe mostrar advertencia: "Formato de email inválido"
3. Botón sigue habilitado pero el backend rechazará
```

### Test 4: Mostrar/Ocultar Contraseña
```
1. Escribir contraseña
2. Click en icono de ojo
3. ✅ Debe mostrar la contraseña en texto plano
4. Click de nuevo
5. ✅ Debe volver a ocultar con puntos
```

### Test 5: Error de Conexión
```
1. Apagar el backend
2. Intentar hacer login
3. ✅ Debe mostrar: "No se pudo conectar con el servidor"
```

### Test 6: Cambio a Registro
```
1. Click en "¿No tienes cuenta? Regístrate"
2. ✅ Debe cerrar login
3. ✅ Debe abrir registro
```

## 🔄 Integración con Otros Componentes

### Verificar si el usuario está logueado
```tsx
import { useEffect, useState } from 'react'

function MyComponent() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userString = localStorage.getItem('user')
    
    if (token && userString) {
      setUser(JSON.parse(userString))
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div>
      {isLoggedIn ? (
        <p>Bienvenido, {user.name}!</p>
      ) : (
        <p>Por favor inicia sesión</p>
      )}
    </div>
  )
}
```

### Hacer peticiones autenticadas
```tsx
const token = localStorage.getItem('token')

fetch('http://localhost:8081/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Componente de Logout
```tsx
function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <Button onClick={handleLogout} variant="outline">
      Cerrar Sesión
    </Button>
  )
}
```

## 🚀 Próximos Pasos

1. **Protected Routes**: Crear rutas que requieran autenticación
2. **Refresh Token**: Implementar renovación automática del token
3. **Remember Me**: Checkbox para mantener sesión activa
4. **Recuperar Contraseña**: Link de "¿Olvidaste tu contraseña?"
5. **OAuth**: Login con Google/Facebook
6. **Session Timeout**: Cerrar sesión automáticamente después de inactividad
7. **Navbar Dinámica**: Mostrar nombre del usuario cuando esté logueado

## 📊 Diferencias con el Sistema Anterior

### Antes (Mock)
```tsx
❌ Usaba usuarios hardcodeados
❌ No había token JWT
❌ No había roles
❌ Solo guardaba en memoria
```

### Ahora (Backend Real)
```tsx
✅ Conecta con API REST
✅ Token JWT para autenticación
✅ Sistema de roles (USER/ADMIN)
✅ Persistencia en localStorage
✅ Manejo de errores HTTP
✅ Redirección automática
```

## 📱 Responsive Design

El modal es completamente responsive:
- **Mobile**: Modal ocupa casi toda la pantalla
- **Desktop**: Modal centrado con ancho máximo
- Botones se apilan verticalmente en móvil
- Inputs con altura adecuada para touch

---

**Última actualización**: Noviembre 4, 2025
**Versión Backend**: 1.0
**Compatible con**: React 18 + TypeScript + Tailwind CSS
