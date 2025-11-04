# 🧭 Navbar Permanente - ViveMedellín

## 🎯 Descripción General

Navbar sticky completa con logo, búsqueda, autenticación, dropdown de usuario, notificaciones y responsive menu móvil. Aparece en todas las páginas después del login.

---

## 🏗️ Arquitectura

### **Archivos Creados:**
- **`Navbar.tsx`** - Componente principal de la barra de navegación
- **`Layout.tsx`** - Wrapper que incluye Navbar + Outlet para páginas
- **`/public/logo.svg`** - Logo completo de ViveMedellín
- **`/public/logo-icon.svg`** - Solo el icono (para mobile)

### **Archivos Modificados:**
- **`App.tsx`** - Envueltas todas las rutas con `<Layout />`

---

## 📐 Estructura de la Navbar

### **Desktop (≥768px):**
```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] ViveMedellín   [🔍 Buscar...]   [➕ Crear] [🔔] [Avatar▼]│
└──────────────────────────────────────────────────────────────────┘
```

### **Mobile (<768px):**
```
┌────────────────────────────────┐
│ [Logo Icon]           [☰ Menu] │
└────────────────────────────────┘
```

---

## ✨ Funcionalidades Implementadas

### **1. Logo (Izquierda)**
- ✅ Imagen desde `/public/logo-icon.svg` (icono)
- ✅ Texto "ViveMedellín" con gradiente azul-púrpura
- ✅ Click → redirecciona a `/` (home)
- ✅ Hover → opacity 80%
- ✅ Responsive: en mobile solo muestra icono

### **2. Barra de Búsqueda (Centro)**
- ✅ Input con icono de lupa
- ✅ Placeholder: "Buscar eventos en Medellín..."
- ✅ Submit → navigate a `/search?q={query}`
- ✅ Solo visible en desktop (≥768px)
- ✅ En mobile aparece dentro del Sheet

### **3. Botones - NO Logueado**
- ✅ **Iniciar sesión** (ghost button) → `/`
- ✅ **Registrarse** (gradient button) → `/`
- ✅ Responsive en mobile

### **4. Botones - Logueado**

#### **Desktop:**
```
[➕ Crear evento] [🔔 3] [Avatar▼]
```

#### **Botón Crear Evento:**
- ✅ Gradient azul-púrpura
- ✅ Icono Plus + texto "Crear evento"
- ✅ Click → `/create-post`
- ✅ En pantallas pequeñas solo muestra icono

#### **Botón Notificaciones:**
- ✅ Icono Bell
- ✅ Badge rojo con número si hay notificaciones
- ✅ Badge muestra "9+" si > 9
- ✅ Click → `/notifications`

#### **Avatar + Dropdown:**
- ✅ Avatar circular con iniciales del usuario
- ✅ Si tiene `profileImage` → muestra la imagen
- ✅ Si NO → gradiente azul-púrpura con iniciales
- ✅ Nombre del usuario
- ✅ Badge "Admin" si `roles` incluye `ROLE_ADMIN`

### **5. Dropdown del Usuario**

```
┌────────────────────────┐
│ Yiyi Lopez            │
│ yiyi@example.com      │
├────────────────────────┤
│ 👤 Mi perfil          │
│ 📅 Mis eventos         │
│ 🔖 Eventos guardados   │
├────────────────────────┤
│ 🛡️ Panel Admin        │ ← Solo si es Admin
├────────────────────────┤
│ ⚙️ Configuración       │
├────────────────────────┤
│ 🚪 Cerrar sesión      │
└────────────────────────┘
```

#### **Opciones del Dropdown:**
1. **Mi perfil** → `/profile`
2. **Mis eventos** → `/my-posts`
3. **Eventos guardados** → `/saved-posts`
4. **Panel Admin** → `/admin` (solo si `ROLE_ADMIN`)
5. **Configuración** → `/settings`
6. **Cerrar sesión** → `handleLogout()`

### **6. Función Logout**
```typescript
handleLogout():
  - localStorage.removeItem("token")
  - localStorage.removeItem("user")
  - setIsLoggedIn(false)
  - setUser(null)
  - navigate("/")
```

### **7. Responsive - Mobile Menu (Sheet)**

#### **Trigger:** Icono hamburger `☰`

#### **Contenido del Sheet:**
```
┌────────────────────────────────┐
│  [Logo] ViveMedellín          │
├────────────────────────────────┤
│  [🔍 Buscar...]               │
├────────────────────────────────┤
│  [Avatar] Yiyi Lopez           │
│           yiyi@example.com     │
│           [Badge Admin]        │
├────────────────────────────────┤
│  [➕ Crear evento]            │
├────────────────────────────────┤
│  🔔 Notificaciones [Badge 3]  │
│  👤 Mi perfil                 │
│  📅 Mis eventos                │
│  🔖 Eventos guardados          │
│  🛡️ Panel Admin               │
│  ⚙️ Configuración              │
├────────────────────────────────┤
│  [🚪 Cerrar sesión]           │
└────────────────────────────────┘
```

- ✅ Se cierra automáticamente al cambiar de ruta
- ✅ Todos los items son botones full-width
- ✅ Badge de notificaciones aparece a la derecha
- ✅ Botón logout con texto rojo

### **8. Sticky Behavior**
- ✅ `position: sticky`
- ✅ `top: 0`
- ✅ `z-index: 50`
- ✅ Background semi-transparente con blur
- ✅ Border bottom + shadow

---

## 🔐 Validación de Autenticación

```typescript
useEffect(() => {
  const token = localStorage.getItem("token")
  const userString = localStorage.getItem("user")

  if (token && userString) {
    const userData: UserData = JSON.parse(userString)
    setUser(userData)
    setIsLoggedIn(true)
  }
}, [])
```

### **Estructura UserData:**
```typescript
interface UserData {
  id: number
  name: string
  email: string
  roles?: string[]            // ["ROLE_USER", "ROLE_ADMIN"]
  profileImage?: string | null
}
```

---

## 🎨 Estilos y Diseño

### **Navbar Container:**
```css
sticky top-0 z-50
bg-white/95 backdrop-blur-md
border-b border-slate-200
shadow-sm
h-16
```

### **Logo:**
```css
cursor-pointer hover:opacity-80
transition-opacity
```

### **Search Bar:**
```css
max-w-md mx-8           /* Centrado con máximo ancho */
relative
pl-10 pr-4              /* Espacio para icono */
```

### **Botón Crear Evento:**
```css
bg-gradient-to-r from-blue-600 to-purple-600
hover:from-blue-700 hover:to-purple-700
```

### **Avatar:**
```css
h-8 w-8 rounded-full
bg-gradient-to-br from-blue-500 to-purple-500
```

### **Badge Notificaciones:**
```css
absolute -top-1 -right-1
h-5 w-5 text-xs
bg-red-600
```

### **Sheet (Mobile):**
```css
w-80                    /* Ancho fijo 320px */
side="right"            /* Desde la derecha */
```

---

## 🔄 Flujo de Datos

### **1. Montaje de Navbar:**
```
Navbar monta
  ↓
useEffect: Verificar localStorage
  ↓
¿Hay token + user?
  → SÍ → setUser(userData) + setIsLoggedIn(true)
  → NO → mostrar botones login/register
```

### **2. Búsqueda:**
```
Usuario escribe en input
  ↓
onChange → setSearchQuery(value)
  ↓
Usuario presiona Enter
  ↓
handleSearch(e)
  ↓
e.preventDefault()
navigate(`/search?q=${query}`)
```

### **3. Logout:**
```
Usuario click "Cerrar sesión"
  ↓
handleLogout()
  ↓
localStorage.removeItem("token")
localStorage.removeItem("user")
  ↓
setIsLoggedIn(false)
setUser(null)
  ↓
navigate("/")
```

### **4. Mobile Menu:**
```
Usuario click [☰]
  ↓
setIsMobileMenuOpen(true)
  ↓
Sheet se abre
  ↓
Usuario click en cualquier opción
  ↓
navigate(ruta)
  ↓
useEffect detecta cambio de location.pathname
  ↓
setIsMobileMenuOpen(false) → Sheet se cierra
```

---

## 🎯 Uso del Layout

### **En App.tsx:**
```tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Index />} />
    <Route path="/posts" element={<PostsFeed />} />
    <Route path="/post/:postId" element={<PostDetail />} />
    {/* ... todas las demás rutas ... */}
  </Route>
</Routes>
```

### **Layout.tsx:**
```tsx
export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      <main>
        <Outlet />  {/* Aquí se renderizan las páginas */}
      </main>
    </div>
  )
}
```

---

## 📱 Responsive Breakpoints

```css
< 768px (mobile):
  - Logo solo icono (sin texto)
  - Sin barra de búsqueda
  - Hamburger menu
  - Sheet desde la derecha

≥ 768px (tablet):
  - Logo completo
  - Barra de búsqueda visible
  - Todos los botones

≥ 1024px (desktop):
  - Texto "Crear evento" visible
  - Nombre de usuario visible
```

---

## 🧪 Cómo Probar

### **1. Sin Login:**
```
1. Ve a http://localhost:8080/
2. Navbar muestra:
   - Logo
   - Barra búsqueda (desktop)
   - Botón "Iniciar sesión"
   - Botón "Registrarse"
```

### **2. Con Login:**
```
1. Login con usuario normal
2. Navbar muestra:
   - Logo
   - Barra búsqueda
   - Botón "➕ Crear evento"
   - Icono 🔔 (notificaciones)
   - Avatar con nombre
3. Click en avatar → dropdown se abre
4. NO debería ver "Panel Admin"
```

### **3. Con Login Admin:**
```
1. Login con usuario admin (roles: ["ROLE_ADMIN"])
2. Avatar muestra badge "Admin"
3. Click en avatar → dropdown
4. DEBE ver "🛡️ Panel Admin" en el menú
```

### **4. Búsqueda:**
```
1. Escribe "música" en la barra
2. Presiona Enter
3. Debería navegar a /search?q=música
```

### **5. Notificaciones:**
```
1. (En código) Cambia notificationsCount a 5
2. Badge rojo aparece con "5"
3. Click → navega a /notifications
```

### **6. Logout:**
```
1. Click en avatar → dropdown
2. Click "Cerrar sesión"
3. localStorage se limpia
4. Navbar vuelve a mostrar login/register
5. Redirige a "/"
```

### **7. Mobile Menu:**
```
1. Reduce ventana a < 768px
2. Aparece icono ☰
3. Click → Sheet se abre desde derecha
4. Click en "Mi perfil"
5. Navega a /profile
6. Sheet se cierra automáticamente
```

### **8. Sticky Behavior:**
```
1. Ve a /posts (página con scroll)
2. Scroll hacia abajo
3. Navbar permanece visible arriba
4. Background semi-transparente con blur
```

---

## 📦 Dependencias

### **UI Components (Shadcn):**
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

### **Icons (Lucide):**
```typescript
import {
  Search, Plus, Bell, User, BookMarked,
  Settings, LogOut, Shield, Menu, Calendar
} from "lucide-react"
```

### **React Router:**
```typescript
import { useNavigate, useLocation } from "react-router-dom"
```

---

## 🔜 Mejoras Futuras

- [ ] Notificaciones real-time (WebSockets)
- [ ] Autocompletado en búsqueda
- [ ] Historial de búsquedas
- [ ] Tema oscuro toggle
- [ ] Idioma selector (ES/EN)
- [ ] Shortcuts de teclado (Cmd+K para búsqueda)
- [ ] Preview de notificaciones en dropdown
- [ ] Contador de eventos guardados
- [ ] Status online/offline
- [ ] Animaciones de entrada

---

## ✅ Checklist de Funcionalidades

**Logo:**
- ✅ Imagen SVG desde /public/
- ✅ Click → navega a "/"
- ✅ Responsive (icon only en mobile)

**Búsqueda:**
- ✅ Input con icono
- ✅ Submit → navigate /search
- ✅ Solo desktop (Sheet en mobile)

**Sin Login:**
- ✅ Botón "Iniciar sesión"
- ✅ Botón "Registrarse"

**Con Login:**
- ✅ Botón "Crear evento"
- ✅ Icono notificaciones + badge
- ✅ Avatar con iniciales o imagen
- ✅ Nombre + email
- ✅ Badge "Admin" si corresponde

**Dropdown:**
- ✅ Mi perfil
- ✅ Mis eventos
- ✅ Eventos guardados
- ✅ Panel Admin (solo admin)
- ✅ Configuración
- ✅ Cerrar sesión

**Mobile:**
- ✅ Hamburger menu
- ✅ Sheet desde derecha
- ✅ Búsqueda en Sheet
- ✅ Info de usuario
- ✅ Todos los links
- ✅ Cierre automático al navegar

**Comportamiento:**
- ✅ Sticky al scroll
- ✅ Background blur
- ✅ Logout limpia localStorage
- ✅ Verificación de admin
- ✅ Responsive completo

---

## 📊 Estados del Componente

```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [user, setUser] = useState<UserData | null>(null)
const [searchQuery, setSearchQuery] = useState("")
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
const [notificationsCount] = useState(0) // TODO: backend
```

---

## 🎨 Paleta de Colores

```css
Logo text: gradient blue-600 → purple-600
Background: white/95 backdrop-blur
Border: slate-200
Buttons: blue-600 → purple-600
Avatar: blue-500 → purple-500
Badge Admin: secondary
Badge Notifications: red-600
Logout: red-600
```

---

## 📋 Resumen

La **Navbar Permanente**:
- ✅ **Sticky** en todas las páginas
- ✅ **Logo dinámico** con click a home
- ✅ **Búsqueda centralizada** de eventos
- ✅ **Autenticación visual** (login/register vs avatar)
- ✅ **Dropdown completo** con todas las opciones
- ✅ **Notificaciones** con badge
- ✅ **Panel Admin** solo para admins
- ✅ **Logout funcional** con limpieza de sesión
- ✅ **Responsive total** con Sheet mobile
- ✅ **Cierre automático** del menú móvil

¡Navbar completa y lista para producción! 🧭
