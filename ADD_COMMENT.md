# 💬 Componente AddComment - ViveMedellín

## 🎯 Descripción General

Componente reutilizable para agregar comentarios y respuestas a posts con validaciones, contador de caracteres, y manejo completo de estados.

---

## 🏗️ Arquitectura

### **Componente Creado:**
- **`AddComment.tsx`** - Componente universal para comentarios y respuestas

### **Componentes Actualizados:**
- **`CommentSectionNested.tsx`** - Usa AddComment para comentarios principales
- **`CommentItem.tsx`** - Usa AddComment para respuestas anidadas

---

## 🔌 Endpoints del Backend

### **Comentario Principal:**
```
POST http://localhost:8081/api/posts/{postId}/comments
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "content": "Texto del comentario"
}
```

### **Respuesta a Comentario:**
```
POST http://localhost:8081/api/comments/{commentId}/replies
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "content": "Texto de la respuesta"
}
```

### **Response (201):**
```json
{
  "id": 1,
  "content": "Texto del comentario",
  "createdDate": "2025-11-02T23:25:45.923+00:00",
  "user": {
    "id": 1,
    "name": "Yiyi Lopez",
    "profileImage": null
  },
  "parentCommentId": null,
  "replies": []
}
```

---

## 📋 Props del Componente

```typescript
interface AddCommentProps {
  postId: number                      // ID del post (requerido)
  parentCommentId?: number            // ID del comentario padre (opcional, para respuestas)
  onCommentAdded: (comment) => void   // Callback cuando se agrega comentario
  placeholder?: string                // Placeholder del textarea (opcional)
  buttonText?: string                 // Texto del botón (opcional)
  compact?: boolean                   // Modo compacto para respuestas (opcional)
}
```

### **Valores por Defecto:**
```typescript
placeholder = "Escribe un comentario..."
buttonText = "Comentar"
compact = false
```

---

## ✨ Funcionalidades Implementadas

### **1. Validación de Autenticación**
- ✅ Lee token y usuario de `localStorage`
- ✅ Si NO está logueado: muestra mensaje "Inicia sesión para comentar"
- ✅ Bloquea el textarea si no hay sesión

### **2. Validación de Contenido**
- ✅ No permite comentarios vacíos
- ✅ Máximo 1000 caracteres
- ✅ Trim automático (elimina espacios al inicio/final)

### **3. Contador de Caracteres**
- ✅ Muestra "X / 1000" en la esquina inferior derecha
- ✅ Cambia de color según caracteres restantes:
  - Gris: más de 100 caracteres restantes
  - Amarillo: menos de 100 caracteres restantes
  - Rojo: superó el límite (deshabilita botón)

### **4. Estados del Componente**
- ✅ **Loading**: Spinner animado mientras envía
- ✅ **Error**: Muestra alert rojo con mensaje de error
- ✅ **Success**: Limpia textarea y ejecuta callback
- ✅ **Disabled**: Deshabilita todo mientras carga

### **5. Atajos de Teclado**
- ✅ **Ctrl+Enter** (Windows/Linux) → Envía comentario
- ✅ **Cmd+Enter** (Mac) → Envía comentario

### **6. Indicador de Usuario**
- ✅ Muestra avatar + nombre del usuario actual
- ✅ Solo en modo normal (no en modo `compact`)

### **7. Manejo de Errores**
- ✅ 401: Sesión expirada
- ✅ 403: Sin permisos
- ✅ 404: Post/Comentario no existe
- ✅ Network errors: Error de conexión

---

## 🎨 Diseño del Componente

### **Modo Normal (Comentario Principal):**

```
┌─────────────────────────────────────────────────────┐
│  [Textarea con placeholder]                         │
│                                         452 / 1000  │ ← Contador
├─────────────────────────────────────────────────────┤
│  Presiona Ctrl+Enter para enviar      [Comentar →] │
├─────────────────────────────────────────────────────┤
│  👤 Comentando como Yiyi Lopez                      │
└─────────────────────────────────────────────────────┘
```

### **Modo Compact (Para Respuestas):**

```
┌─────────────────────────────────────────────────────┐
│  [Textarea más pequeño]                             │
│                                         123 / 1000  │
├─────────────────────────────────────────────────────┤
│  Presiona Ctrl+Enter...              [Responder →] │
└─────────────────────────────────────────────────────┘
```

### **Si NO está logueado:**

```
┌─────────────────────────────────────────────────────┐
│  🔓 Inicia sesión para comentar y participar        │
│     en la conversación.                             │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### **1. Montaje del Componente:**
```
AddComment monta
  ↓
useEffect verifica localStorage
  ↓
Si hay token + user → setIsLoggedIn(true)
Si NO → muestra mensaje "Inicia sesión"
```

### **2. Usuario Escribe Comentario:**
```
Usuario escribe en textarea
  ↓
onChange → setContent(value)
  ↓
Contador actualiza (MAX_CHARACTERS - content.length)
  ↓
Si > límite → texto rojo + botón disabled
```

### **3. Envío de Comentario:**
```
Usuario click "Comentar" o Ctrl+Enter
  ↓
Validaciones:
  - ¿Está vacío? → error
  - ¿Supera 1000? → error
  - ¿Está logueado? → error
  ↓
setIsSubmitting(true)
  ↓
Determina endpoint:
  - Si parentCommentId → POST /comments/{id}/replies
  - Si NO → POST /posts/{postId}/comments
  ↓
fetch con Authorization header
  ↓
Si OK:
  - Limpia textarea
  - Ejecuta onCommentAdded(newComment)
  - Parent component recarga lista
Si ERROR:
  - Muestra mensaje de error
  ↓
setIsSubmitting(false)
```

---

## 🎯 Uso del Componente

### **1. Comentario Principal:**
```tsx
<AddComment
  postId={5}
  onCommentAdded={(comment) => {
    console.log("Nuevo comentario:", comment)
    reloadComments()
  }}
  placeholder="¿Qué opinas sobre este evento?"
  buttonText="Publicar comentario"
/>
```

### **2. Respuesta a Comentario:**
```tsx
<AddComment
  postId={5}
  parentCommentId={12}
  onCommentAdded={(reply) => {
    console.log("Nueva respuesta:", reply)
    reloadComments()
  }}
  placeholder="Escribe tu respuesta..."
  buttonText="Responder"
  compact
/>
```

---

## 🔐 Validaciones Implementadas

### **Validación de Login:**
```typescript
const token = localStorage.getItem("token")
const userString = localStorage.getItem("user")

if (!token || !userString) {
  return <Alert>"Inicia sesión para comentar"</Alert>
}
```

### **Validación de Contenido:**
```typescript
if (!content.trim()) {
  setError("El comentario no puede estar vacío")
  return
}

if (content.length > MAX_CHARACTERS) {
  setError(`El comentario no puede superar ${MAX_CHARACTERS} caracteres`)
  return
}
```

### **Validación de Respuesta del Backend:**
```typescript
if (response.status === 401) {
  throw new Error("Tu sesión ha expirado...")
} else if (response.status === 403) {
  throw new Error("No tienes permisos...")
} else if (response.status === 404) {
  throw new Error("El post/comentario no existe...")
}
```

---

## 🎨 Estados Visuales

### **Contador de Caracteres:**
```css
Más de 100 restantes: text-slate-400 (gris)
Menos de 100 restantes: text-amber-600 (amarillo)
Superó límite: text-red-600 (rojo) + border-red-300
```

### **Botón Comentar:**
```css
Normal: bg-gradient-to-r from-blue-600 to-purple-600
Hover: from-blue-700 to-purple-700
Disabled: opacity-50 cursor-not-allowed
Loading: spinner animado + "Enviando..."
```

### **Textarea:**
```css
Normal: border-slate-200
Focus: border-blue-500
Error: border-red-300 focus:border-red-500
Disabled: opacity-50
```

---

## 🐛 Manejo de Errores

### **Errores HTTP:**
```typescript
401 Unauthorized → "Tu sesión ha expirado. Inicia sesión nuevamente."
403 Forbidden → "No tienes permisos para comentar."
404 Not Found → "El post/comentario no existe."
500 Server Error → "Error al enviar el comentario. Intenta de nuevo."
Network Error → "Error de conexión. Verifica tu internet."
```

### **Errores de Validación:**
```typescript
Vacío → "El comentario no puede estar vacío"
Muy largo → "El comentario no puede superar 1000 caracteres"
No logueado → "Debes iniciar sesión para comentar"
```

---

## 🧪 Cómo Probar

### **1. Comentario Principal (Con Login):**
```
1. Ve a /post/{id}
2. Scroll hasta la sección de comentarios
3. Escribe un comentario
4. Observa el contador de caracteres
5. Click "Publicar comentario" o Ctrl+Enter
6. El comentario debería aparecer arriba
```

### **2. Comentario Principal (Sin Login):**
```
1. Logout si estás logueado
2. Ve a /post/{id}
3. Deberías ver mensaje "Inicia sesión para comentar"
4. No hay textarea, solo el mensaje
```

### **3. Respuesta a Comentario:**
```
1. Login
2. Ve a cualquier post con comentarios
3. Click "Responder" en un comentario
4. Se abre textarea compacto debajo
5. Escribe respuesta
6. Click "Responder"
7. La respuesta aparece indentada
```

### **4. Validación de Caracteres:**
```
1. Escribe más de 1000 caracteres
2. El contador se pone rojo
3. El botón se deshabilita
4. El borde del textarea se pone rojo
5. Borra caracteres hasta < 1000
6. Todo vuelve a normal
```

### **5. Atajos de Teclado:**
```
1. Escribe un comentario
2. Presiona Ctrl+Enter (o Cmd+Enter en Mac)
3. El comentario se envía sin hacer click
```

### **6. Manejo de Errores:**
```
1. Desconecta internet
2. Intenta enviar comentario
3. Debería mostrar error de conexión
4. Reconecta internet
5. Intenta de nuevo → debería funcionar
```

---

## 📦 Dependencias

### **UI Components:**
```typescript
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
```

### **Icons:**
```typescript
import { Send, AlertCircle, LogIn } from "lucide-react"
```

### **React:**
```typescript
import { useState, useEffect } from "react"
```

---

## 🔜 Mejoras Futuras

- [ ] Rich text editor (markdown, bold, italic)
- [ ] Previsualización antes de enviar
- [ ] Upload de imágenes
- [ ] Menciones de usuarios (@usuario)
- [ ] Emojis picker
- [ ] Auto-guardado en localStorage (drafts)
- [ ] Límite de velocidad (rate limiting)
- [ ] Detección de spam
- [ ] Formato de código (```code```)
- [ ] GIFs y stickers

---

## ✅ Checklist de Funcionalidades

**Validaciones:**
- ✅ Verifica autenticación (token + user)
- ✅ Valida contenido vacío
- ✅ Valida longitud máxima (1000)
- ✅ Trim automático

**UI/UX:**
- ✅ Contador de caracteres dinámico
- ✅ Cambio de colores según límite
- ✅ Placeholder personalizable
- ✅ Botón personalizable
- ✅ Modo compacto para respuestas
- ✅ Indicador de usuario actual
- ✅ Loading spinner
- ✅ Alert de errores

**Funcionalidades:**
- ✅ Envío con Ctrl+Enter
- ✅ Limpia textarea después de enviar
- ✅ Callback para actualizar lista
- ✅ Endpoint dinámico (comentario/respuesta)
- ✅ Headers con Authorization

**Manejo de Errores:**
- ✅ 401, 403, 404, 500
- ✅ Network errors
- ✅ Mensajes descriptivos

**Estados:**
- ✅ Loading state
- ✅ Error state
- ✅ Disabled state
- ✅ Success state

---

## 📚 Resumen

El componente `AddComment`:
- ✅ **Reutilizable** para comentarios y respuestas
- ✅ **Validaciones completas** (auth, longitud, vacío)
- ✅ **Contador de caracteres** con colores dinámicos
- ✅ **Atajos de teclado** (Ctrl+Enter)
- ✅ **Manejo de errores** robusto
- ✅ **Estados visuales** claros
- ✅ **Modo compacto** para respuestas
- ✅ **Backend real** con JWT

¡Componente completo y listo para producción! 🎉
