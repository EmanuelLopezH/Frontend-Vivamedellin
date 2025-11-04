# 🔖 Componente SaveButton - ViveMedellín

## 🎯 Descripción General

Componente reutilizable de React con Tailwind CSS para guardar y dejar de guardar posts. Incluye estados visuales, tooltips, animaciones y manejo completo de autenticación.

---

## 🏗️ Arquitectura

### **Archivos Creados:**
- **`SaveButton.tsx`** - Componente principal del botón guardar
- **`savedPostService.ts`** - Servicio para operaciones de guardado

### **Archivos Modificados:**
- **`PostCardGrid.tsx`** - Reemplazado botón guardar antiguo con SaveButton
- **`PostDetail.tsx`** - Reemplazado botón guardar antiguo con SaveButton

---

## 🔌 Endpoints del Backend

### **1. Guardar Post:**
```
POST http://localhost:8081/api/saved-posts/{postId}
Headers: 
  - Authorization: Bearer {token}

Response (200):
{
  "message": "Post saved successfully"
}
```

### **2. Dejar de Guardar:**
```
DELETE http://localhost:8081/api/saved-posts/{postId}
Headers: 
  - Authorization: Bearer {token}

Response (200):
{
  "message": "Post unsaved successfully"
}
```

### **3. Verificar si Está Guardado:**
```
GET http://localhost:8081/api/saved-posts/{postId}/check
Headers: 
  - Authorization: Bearer {token}

Response (200):
{
  "saved": true
}
```

---

## 📋 Props del Componente

```typescript
interface SaveButtonProps {
  postId: number                      // ID del post (requerido)
  initialSaved?: boolean              // Estado inicial (opcional, default: false)
  variant?: "default" | "ghost" | "outline" // Variante del botón (opcional, default: "outline")
  size?: "default" | "sm" | "lg" | "icon"   // Tamaño del botón (opcional, default: "sm")
  showLabel?: boolean                 // Mostrar texto "Guardar" (opcional, default: false)
}
```

### **Valores por Defecto:**
```typescript
initialSaved = false
variant = "outline"
size = "sm"
showLabel = false
```

---

## ✨ Funcionalidades Implementadas

### **1. Validación de Autenticación**
- ✅ Lee `token` y `user` de `localStorage`
- ✅ Si NO está logueado: muestra toast "Inicia sesión"
- ✅ Tooltip dice "Inicia sesión para guardar"

### **2. Verificación de Estado Guardado**
- ✅ Al montar, hace GET a `/saved-posts/{postId}/check`
- ✅ Actualiza estado `isSaved` según respuesta
- ✅ Muestra spinner mientras verifica
- ✅ Si falla o no hay sesión → asume `false`

### **3. Toggle Guardar/No Guardar**
- ✅ Click → POST para guardar
- ✅ Click de nuevo → DELETE para quitar
- ✅ Actualiza estado local inmediatamente
- ✅ Muestra toast de confirmación

### **4. Estados Visuales**

#### **No Guardado:**
```
🔖 Bookmark outline (sin relleno)
Border: slate-200
Text: slate-600
```

#### **Guardado:**
```
🔖 Bookmark filled (relleno azul)
Border: blue-300
Text: blue-600
Animación: zoom-in-50
```

#### **Loading (Verificando):**
```
⏳ Spinner animado
Botón deshabilitado
```

#### **Loading (Guardando):**
```
⏳ Spinner animado
Botón deshabilitado
```

### **5. Tooltips**
- ✅ **No logueado**: "Inicia sesión para guardar"
- ✅ **No guardado**: "Guardar"
- ✅ **Guardado**: "Guardado"

### **6. Animaciones**
- ✅ Zoom-in al marcar como guardado
- ✅ Transición suave de colores
- ✅ Spinner animado al cargar

### **7. Toast Notifications**
- ✅ **Guardado**: "Post guardado" (success)
- ✅ **Quitado**: "Post eliminado de guardados" (success)
- ✅ **No logueado**: "Inicia sesión" (destructive)
- ✅ **Error**: Mensaje descriptivo (destructive)

### **8. Manejo de Errores**
- ✅ 401: Sesión expirada
- ✅ 403: Sin permisos
- ✅ 404: Post no existe
- ✅ 500: Error del servidor
- ✅ Network Error: Error de conexión

---

## 🎨 Diseño del Componente

### **Variante: outline + sin label (default en cards):**
```
┌──────────┐
│  🔖      │  ← Outline, sin relleno
└──────────┘
Hover: tooltip "Guardar"
```

### **Variante: outline + con label (en post detail):**
```
┌──────────────────┐
│  🔖  Guardar     │  ← Con texto
└──────────────────┘
```

### **Estado Guardado:**
```
┌──────────────────┐
│  🔖  Guardado    │  ← Relleno azul + border azul
└──────────────────┘
```

### **Estado Loading:**
```
┌──────────────────┐
│  ⏳  ...         │  ← Spinner animado
└──────────────────┘
```

---

## 🔄 Flujo de Datos

### **1. Montaje del Componente:**
```
SaveButton monta
  ↓
useEffect #1: Verifica localStorage
  ↓
¿Hay token + user?
  → SÍ → setIsLoggedIn(true) + setToken
  → NO → setIsLoggedIn(false) + setIsChecking(false)
  ↓
useEffect #2: Verifica si está guardado
  ↓
¿Está logueado?
  → NO → setIsChecking(false)
  → SÍ → fetch GET /saved-posts/{postId}/check
    ↓
    Response: { saved: true/false }
    ↓
    setIsSaved(saved)
    setIsChecking(false)
```

### **2. Usuario Click en Botón:**
```
handleToggleSave()
  ↓
¿Está logueado?
  → NO → toast "Inicia sesión"
  → SÍ → continuar
  ↓
setIsLoading(true)
  ↓
¿Está guardado actualmente?
  → SÍ → DELETE /saved-posts/{postId}
    ↓
    setIsSaved(false)
    toast "Post eliminado de guardados"
  → NO → POST /saved-posts/{postId}
    ↓
    setIsSaved(true)
    toast "Post guardado"
  ↓
setIsLoading(false)
```

---

## 🎯 Uso del Componente

### **1. En PostCardGrid (tarjeta de post):**
```tsx
<SaveButton
  postId={post.id}
  initialSaved={post.isSaved}
  variant="ghost"
  size="sm"
  showLabel
/>
```

### **2. En PostDetail (página de detalle):**
```tsx
<SaveButton
  postId={post.id}
  initialSaved={post.isSaved}
  variant="outline"
  size="sm"
  showLabel
/>
```

### **3. Botón Solo Icono:**
```tsx
<SaveButton
  postId={5}
  variant="outline"
  size="icon"
/>
```

### **4. Con Estado Inicial:**
```tsx
<SaveButton
  postId={10}
  initialSaved={true}
  variant="default"
  size="lg"
  showLabel
/>
```

---

## 🔐 Validaciones Implementadas

### **Validación de Login:**
```typescript
const token = localStorage.getItem("token")
const userString = localStorage.getItem("user")

if (!token || !userString) {
  toast({
    variant: "destructive",
    title: "Inicia sesión",
    description: "Debes iniciar sesión para guardar posts."
  })
  return
}
```

### **Validación de Respuesta del Backend:**
```typescript
// En savePost
if (response.status === 401) {
  throw new Error("Tu sesión ha expirado...")
} else if (response.status === 403) {
  throw new Error("No tienes permisos...")
} else if (response.status === 404) {
  throw new Error("El post no existe...")
}

// En checkIfSaved
if (response.status === 401) {
  // Sesión expirada, asume no guardado
  return false
}
```

---

## 🐛 Manejo de Errores

### **Errores HTTP:**
```typescript
401 Unauthorized → "Tu sesión ha expirado. Inicia sesión nuevamente."
403 Forbidden → "No tienes permisos para guardar posts." / "No tienes permisos."
404 Not Found → "El post no existe."
500+ Server Error → "Error al guardar el post. Intenta de nuevo."
Network Error → Muestra error original
```

### **Errores en Verificación:**
```typescript
checkIfSaved() falla → Asume false (no guardado)
No muestra error al usuario (silencioso)
Log en consola para debugging
```

---

## 🧪 Cómo Probar

### **1. Guardar Post (Con Login):**
```
1. Login
2. Ve a /posts
3. Busca una tarjeta de post
4. Click en botón "🔖 Guardar"
5. Icono se llena de azul
6. Toast: "Post guardado"
7. Border se pone azul
```

### **2. Quitar de Guardados:**
```
1. En un post guardado (🔖 azul)
2. Click de nuevo
3. Icono vuelve a outline
4. Toast: "Post eliminado de guardados"
5. Border vuelve a gris
```

### **3. Guardar Post (Sin Login):**
```
1. Logout si estás logueado
2. Ve a /posts
3. Hover sobre botón guardar
4. Tooltip: "Inicia sesión para guardar"
5. Click en botón
6. Toast rojo: "Inicia sesión"
```

### **4. Estado Inicial Guardado:**
```
1. Login
2. Guarda un post
3. Recarga la página
4. El botón debería aparecer azul (guardado)
5. Verificación automática en background
```

### **5. Animación al Guardar:**
```
1. Click en botón guardar (no guardado)
2. Icono hace zoom-in
3. Transición suave de gris a azul
4. Botón se deshabilita durante la operación
```

### **6. Manejo de Errores:**
```
TEST 1: Sesión expirada
1. Login
2. Espera 1 hora (o borra token manualmente)
3. Intenta guardar post
4. Toast: "Tu sesión ha expirado..."

TEST 2: Post no existe
1. Cambia postId a 99999
2. Intenta guardar
3. Toast: "El post no existe."

TEST 3: Sin conexión
1. Desconecta internet
2. Intenta guardar
3. Toast con error de red
```

---

## 📦 Dependencias

### **UI Components:**
```typescript
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
```

### **Hooks:**
```typescript
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
```

### **Icons:**
```typescript
import { Bookmark, Loader2 } from "lucide-react"
```

### **Services:**
```typescript
import { savedPostService } from "@/services/savedPostService"
```

---

## 🎨 Clases de Tailwind Utilizadas

### **Botón No Guardado:**
```css
variant="outline" → border-slate-200 text-slate-600
hover:border-slate-300 hover:text-slate-700
```

### **Botón Guardado:**
```css
text-blue-600 hover:text-blue-700
border-blue-300 hover:border-blue-400
```

### **Icono Guardado:**
```css
fill-blue-600
animate-in zoom-in-50 duration-200
```

### **Spinner Loading:**
```css
animate-spin
h-4 w-4
```

---

## 🔜 Mejoras Futuras

- [ ] Contador de posts guardados
- [ ] Página /saved-posts con lista de guardados
- [ ] Sincronización real-time (WebSockets)
- [ ] Colecciones/carpetas de posts guardados
- [ ] Compartir colección de guardados
- [ ] Exportar posts guardados (PDF, CSV)
- [ ] Búsqueda en posts guardados
- [ ] Tags personalizados para posts guardados
- [ ] Recordatorios para posts guardados
- [ ] Archivado automático (después de X días)

---

## ✅ Checklist de Funcionalidades

**Autenticación:**
- ✅ Verifica token + user en localStorage
- ✅ Toast si no está logueado
- ✅ Tooltip diferente si no está logueado

**Verificación de Estado:**
- ✅ GET /saved-posts/{postId}/check al montar
- ✅ Actualiza isSaved según respuesta
- ✅ Loading state mientras verifica
- ✅ Manejo silencioso de errores

**Toggle Guardar:**
- ✅ POST para guardar
- ✅ DELETE para quitar
- ✅ Actualiza estado local
- ✅ Toast de confirmación

**Estados Visuales:**
- ✅ Icono outline vs filled
- ✅ Colores diferentes (gris vs azul)
- ✅ Animación zoom-in al guardar
- ✅ Spinner mientras carga
- ✅ Botón disabled durante operaciones

**Tooltips:**
- ✅ "Inicia sesión para guardar" si no hay sesión
- ✅ "Guardar" si no está guardado
- ✅ "Guardado" si está guardado

**Toasts:**
- ✅ Success al guardar
- ✅ Success al quitar
- ✅ Error si no está logueado
- ✅ Error descriptivo en fallos

**Manejo de Errores:**
- ✅ 401, 403, 404, 500
- ✅ Network errors
- ✅ Mensajes descriptivos

**Props:**
- ✅ postId (requerido)
- ✅ initialSaved (opcional)
- ✅ variant (opcional)
- ✅ size (opcional)
- ✅ showLabel (opcional)

---

## 📚 Servicio savedPostService

### **Métodos Disponibles:**

```typescript
// Guardar post
await savedPostService.savePost(postId, token)
// Returns: { message: "Post saved successfully" }

// Dejar de guardar
await savedPostService.unsavePost(postId, token)
// Returns: { message: "Post unsaved successfully" }

// Verificar si está guardado
const isSaved = await savedPostService.checkIfSaved(postId, token)
// Returns: boolean
```

### **Interfaces:**

```typescript
interface SavePostResponse {
  message: string
}

interface CheckSavedResponse {
  saved: boolean
}
```

---

## 🎨 Variantes del Botón

### **1. Outline (Default):**
```tsx
<SaveButton postId={1} variant="outline" />
// Border visible, fondo transparente
```

### **2. Ghost:**
```tsx
<SaveButton postId={1} variant="ghost" />
// Sin border, hover muestra fondo
```

### **3. Default:**
```tsx
<SaveButton postId={1} variant="default" />
// Fondo sólido con gradiente
```

---

## 🔗 Integración en Componentes Existentes

### **PostCardGrid.tsx:**
```tsx
// ANTES:
<Button onClick={handleSave} disabled={!isLoggedIn || isSaving}>
  <Bookmark className={post.isSaved ? "fill-current" : ""} />
  Guardar
</Button>

// AHORA:
<SaveButton
  postId={post.id}
  initialSaved={post.isSaved}
  variant="ghost"
  size="sm"
  showLabel
/>
```

### **PostDetail.tsx:**
```tsx
// ANTES:
<Button onClick={handleSave} disabled={!user || isSaving}>
  <Bookmark className={post.isSaved ? "fill-current" : ""} />
  Guardar
</Button>

// AHORA:
<SaveButton
  postId={post.id}
  initialSaved={post.isSaved}
  variant="outline"
  size="sm"
  showLabel
/>
```

---

## 📋 Resumen

El componente `SaveButton`:
- ✅ **Reutilizable** en cards y páginas de detalle
- ✅ **Verificación automática** del estado guardado
- ✅ **Tooltips informativos** según contexto
- ✅ **Animaciones suaves** al cambiar estado
- ✅ **Toasts de confirmación** para feedback
- ✅ **Manejo de errores** robusto
- ✅ **Validación de autenticación** completa
- ✅ **Estados visuales claros** (outline vs filled)
- ✅ **Loading states** durante operaciones
- ✅ **Backend real** con JWT

¡Componente completo y listo para guardar posts! 🔖
