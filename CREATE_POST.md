# ✍️ Componente Crear Post - ViveMedellín

## 🎯 Descripción General

Página completa para crear nuevos posts con título, contenido, categoría e imagen opcional. Incluye validación en tiempo real, vista previa de imagen y redirección al post creado.

---

## 🏗️ Arquitectura

### **Archivos Creados:**
- **`CreatePost.tsx`** - Página principal con formulario
- **`categoryService.ts`** - Servicio para obtener categorías
- **`createPostService.ts`** - Servicio para crear posts con multipart/form-data

### **Archivos Modificados:**
- **`App.tsx`** - Agregada ruta `/create-post`
- **`PostsFeed.tsx`** - Botón "Crear Post" ya redirecciona correctamente

---

## 🔌 Endpoints del Backend

### **1. Obtener Categorías:**
```
GET http://localhost:8081/api/categories/
Content-Type: application/json

Response (200):
[
  {
    "categoryId": 1,
    "categoryTitle": "Música",
    "categoryDescription": "Conciertos, festivales..."
  },
  {
    "categoryId": 2,
    "categoryTitle": "Gastronomía",
    "categoryDescription": "Restaurantes, ferias..."
  }
]
```

### **2. Crear Post:**
```
POST http://localhost:8081/api/user/{userId}/category/{categoryId}/posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  - postTitle: string (max 100 caracteres)
  - content: string (min 10 caracteres)
  - image: File (opcional, max 10MB)

Response (201):
{
  "postId": 123,
  "postTitle": "Festival de Rock en Parque Lleras",
  "content": "Gran evento este fin de semana...",
  "imageName": "festival-rock-123456.jpg",
  "addedDate": "2025-11-04T12:30:00.000+00:00",
  "category": {
    "categoryId": 1,
    "categoryTitle": "Música"
  },
  "user": {
    "id": 5,
    "name": "Yiyi Lopez",
    "profileImage": null
  }
}
```

---

## ✨ Funcionalidades Implementadas

### **1. Validación de Autenticación**
- ✅ Lee `token` y `user` de `localStorage`
- ✅ Si NO está logueado → redirecciona a `/` (home)
- ✅ Solo usuarios autenticados pueden acceder

### **2. Carga de Categorías Dinámica**
- ✅ Carga categorías desde backend al montar
- ✅ Select desplegable con todas las categorías
- ✅ Loading state mientras carga
- ✅ Manejo de errores si falla la carga

### **3. Validación en Tiempo Real**

#### **Título:**
- ✅ Requerido (no puede estar vacío)
- ✅ Máximo 100 caracteres
- ✅ Contador de caracteres con colores:
  - Gris: normal
  - Amarillo: < 10 caracteres restantes
  - Rojo: superó el límite
- ✅ Border rojo si tiene error

#### **Contenido:**
- ✅ Requerido (no puede estar vacío)
- ✅ Mínimo 10 caracteres
- ✅ Textarea expandible
- ✅ Border rojo si tiene error

#### **Categoría:**
- ✅ Requerida (debe seleccionar una)
- ✅ Mensaje de error si intenta enviar sin categoría

#### **Imagen:**
- ✅ Opcional (puede crear post sin imagen)
- ✅ Solo acepta archivos de imagen (image/*)
- ✅ Máximo 10MB
- ✅ Vista previa en tiempo real
- ✅ Botón para eliminar imagen
- ✅ Muestra nombre y tamaño del archivo

### **4. Vista Previa de Imagen**
- ✅ Preview instantáneo al seleccionar archivo
- ✅ Muestra imagen en contenedor de 256px altura
- ✅ Botón "Eliminar" en esquina superior derecha
- ✅ Info del archivo (nombre + tamaño) en overlay inferior

### **5. Estados del Formulario**
- ✅ **Loading**: Spinner mientras carga categorías
- ✅ **Submitting**: Deshabilita todo y muestra "Publicando..."
- ✅ **Error**: Alert rojo con mensaje descriptivo
- ✅ **Success**: Redirecciona al post creado

### **6. Manejo de Errores HTTP**
- ✅ 401: Sesión expirada
- ✅ 403: Sin permisos
- ✅ 404: Usuario/Categoría no existe
- ✅ 500: Error del servidor
- ✅ Network Error: Error de conexión

### **7. Envío con FormData**
- ✅ Usa `multipart/form-data` para enviar imagen
- ✅ NO establece `Content-Type` manualmente (boundary automático)
- ✅ Trim automático de título y contenido
- ✅ Headers con `Authorization: Bearer {token}`

### **8. Redirección Post-Creación**
- ✅ Después de crear → `navigate(/post/${postId})`
- ✅ Usuario ve su post recién creado inmediatamente

---

## 🎨 Diseño de la Página

### **Header:**
```
┌──────────────────────────────────────────────────────┐
│  [← Volver]     Crear Nuevo Post                     │
└──────────────────────────────────────────────────────┘
```

### **Formulario:**
```
┌──────────────────────────────────────────────────────┐
│  Comparte algo con la comunidad                      │
│  Cuéntanos sobre un evento, lugar o experiencia...   │
├──────────────────────────────────────────────────────┤
│  Categoría *                                         │
│  [Selecciona una categoría ▼]                        │
├──────────────────────────────────────────────────────┤
│  Título *                                  45 / 100  │
│  [Festival de Rock en Parque Lleras_____]            │
│  Un título claro y descriptivo                       │
├──────────────────────────────────────────────────────┤
│  Contenido *                                         │
│  [Describe el evento, comparte detalles...____]      │
│  Mínimo 10 caracteres. Sé descriptivo y útil.        │
├──────────────────────────────────────────────────────┤
│  Imagen (opcional)                                   │
│  ┌────────────────────────────────────────────────┐ │
│  │         📤  Click para subir una imagen        │ │
│  │      PNG, JPG, WEBP hasta 10MB                 │ │
│  └────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────┤
│  [Cancelar]              [Publicar Post →]           │
└──────────────────────────────────────────────────────┘
```

### **Con Imagen Subida:**
```
┌──────────────────────────────────────────────────────┐
│  Imagen (opcional)                                   │
│  ┌────────────────────────────────────────────────┐ │
│  │  [× Eliminar]                                  │ │
│  │  [        IMAGEN PREVIEW AQUÍ        ]         │ │
│  │  📷 festival.jpg (2.5 MB)                      │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### **1. Montaje de Página:**
```
CreatePost monta
  ↓
useEffect #1: Verifica autenticación
  ↓
¿Hay token + user en localStorage?
  → NO → navigate("/")
  → SÍ → setUser + setToken
  ↓
useEffect #2: Carga categorías
  ↓
fetch GET /api/categories/
  ↓
setCategories(data)
setLoadingCategories(false)
```

### **2. Usuario Llena Formulario:**
```
Selecciona categoría → setSelectedCategoryId
Escribe título → setTitle + validación en tiempo real
Escribe contenido → setContent + validación en tiempo real
Sube imagen → FileReader → setImagePreview + validación
```

### **3. Validación en Tiempo Real:**
```
useEffect con dependencies [title]
  ↓
Si title.length > MAX_TITLE_LENGTH → setTitleError
Si title.length === 0 → setTitleError(null)
  ↓
useEffect con dependencies [content]
  ↓
Si content.length < MIN_CONTENT_LENGTH → setContentError
```

### **4. Envío del Formulario:**
```
Usuario click "Publicar Post"
  ↓
handleSubmit(e)
  ↓
e.preventDefault()
validateForm()
  - ¿Título vacío? → error
  - ¿Título > 100? → error
  - ¿Contenido < 10? → error
  - ¿Sin categoría? → error
  - ¿Imagen > 10MB? → error
  ↓
Todas las validaciones OK
  ↓
setIsSubmitting(true)
  ↓
Crear FormData:
  formData.append("postTitle", title.trim())
  formData.append("content", content.trim())
  formData.append("image", image) // si existe
  ↓
fetch POST /api/user/{userId}/category/{categoryId}/posts
  Headers: Authorization: Bearer {token}
  Body: formData
  ↓
Si OK (201):
  - Parsear response → { postId, ... }
  - navigate(`/post/${postId}`)
Si ERROR:
  - Mostrar mensaje de error
  ↓
setIsSubmitting(false)
```

---

## 🎯 Uso de Servicios

### **categoryService.ts:**
```typescript
import { categoryService } from "@/services/categoryService"

const categories = await categoryService.getCategories()
// Returns: Category[]
```

### **createPostService.ts:**
```typescript
import { createPostService } from "@/services/createPostService"

const result = await createPostService.createPost(
  userId: 5,
  categoryId: 1,
  {
    postTitle: "Mi Post",
    content: "Contenido del post...",
    image: fileObject // File | undefined
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
)
// Returns: CreatePostResponse
```

---

## 🔐 Validaciones Detalladas

### **1. Validación de Autenticación:**
```typescript
useEffect(() => {
  const token = localStorage.getItem("token")
  const userString = localStorage.getItem("user")

  if (!token || !userString) {
    navigate("/") // Redirigir a home
    return
  }

  const userData = JSON.parse(userString)
  setUser(userData)
  setToken(token)
}, [navigate])
```

### **2. Validación de Título:**
```typescript
// En tiempo real
if (title.length > MAX_TITLE_LENGTH) {
  setTitleError(`El título no puede superar ${MAX_TITLE_LENGTH} caracteres`)
}

// Al enviar
if (!title.trim()) {
  setTitleError("El título es requerido")
  return false
}
```

### **3. Validación de Contenido:**
```typescript
// En tiempo real
if (content.length > 0 && content.length < MIN_CONTENT_LENGTH) {
  setContentError(`El contenido debe tener al menos ${MIN_CONTENT_LENGTH} caracteres`)
}

// Al enviar
if (!content.trim()) {
  setContentError("El contenido es requerido")
  return false
}
```

### **4. Validación de Imagen:**
```typescript
const file = e.target.files?.[0]

// Tipo
if (!file.type.startsWith("image/")) {
  setImageError("El archivo debe ser una imagen")
  return
}

// Tamaño
if (file.size > MAX_IMAGE_SIZE) {
  setImageError("La imagen no puede superar 10MB")
  return
}
```

### **5. Validación de Categoría:**
```typescript
if (!selectedCategoryId) {
  setError("Debes seleccionar una categoría")
  return false
}
```

---

## 🐛 Manejo de Errores

### **Errores de Carga de Categorías:**
```typescript
try {
  const data = await categoryService.getCategories()
  setCategories(data)
} catch (error) {
  setError("Error al cargar las categorías. Intenta recargar la página.")
}
```

### **Errores HTTP al Crear Post:**
```typescript
if (response.status === 401) {
  throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
} else if (response.status === 403) {
  throw new Error("No tienes permisos para crear posts.")
} else if (response.status === 404) {
  throw new Error("Usuario o categoría no encontrados.")
} else if (!response.ok) {
  throw new Error("Error al crear el post. Intenta de nuevo.")
}
```

### **Errores de Red:**
```typescript
catch (error) {
  if (error instanceof Error) {
    setError(error.message)
  } else {
    setError("Error al crear el post. Intenta de nuevo.")
  }
}
```

---

## 🧪 Cómo Probar

### **1. Acceso a la Página:**
```
✅ CON LOGIN:
1. Login en /
2. Ve a /posts
3. Click botón "Crear Post" → /create-post
4. Formulario carga correctamente

❌ SIN LOGIN:
1. Ve directamente a /create-post
2. Debería redirigir a /
```

### **2. Crear Post SIN Imagen:**
```
1. Selecciona categoría: "Música"
2. Título: "Festival de Rock en Parque Lleras"
3. Contenido: "Gran evento este sábado con bandas locales..."
4. NO subir imagen
5. Click "Publicar Post"
6. Debería redirigir a /post/{id}
```

### **3. Crear Post CON Imagen:**
```
1. Llena formulario como antes
2. Click área de upload
3. Selecciona imagen (< 10MB)
4. Ver preview de imagen
5. Click "Publicar Post"
6. Debería redirigir a /post/{id} con imagen
```

### **4. Validación de Título:**
```
1. Escribe más de 100 caracteres en título
2. Contador se pone rojo
3. Border del input se pone rojo
4. Botón "Publicar" se deshabilita
5. Mensaje de error aparece
```

### **5. Validación de Contenido:**
```
1. Escribe menos de 10 caracteres
2. Mensaje "Mínimo 10 caracteres" aparece
3. Intenta enviar → mensaje de error
```

### **6. Validación de Imagen:**
```
TEST 1: Archivo muy grande
1. Intenta subir imagen > 10MB
2. Mensaje "La imagen no puede superar 10MB"

TEST 2: Archivo no válido
1. Intenta subir PDF o TXT
2. Mensaje "El archivo debe ser una imagen"
```

### **7. Eliminar Imagen:**
```
1. Sube imagen
2. Ver preview
3. Click "× Eliminar"
4. Preview desaparece
5. Input file se resetea
6. Puede subir otra imagen
```

### **8. Cancelar Creación:**
```
1. Llena formulario (mitad)
2. Click "Cancelar"
3. Debería volver a /posts
4. NO se crea el post
```

### **9. Error de Red:**
```
1. Desconecta internet
2. Llena formulario
3. Click "Publicar"
4. Alert rojo con mensaje de error
5. Formulario NO se limpia
6. Usuario puede intentar de nuevo
```

---

## 📦 Dependencias

### **UI Components (Shadcn):**
```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
```

### **Icons (Lucide):**
```typescript
import { ArrowLeft, Upload, X, AlertCircle, Loader2, Send, Image as ImageIcon } from "lucide-react"
```

### **React:**
```typescript
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
```

---

## 🔜 Mejoras Futuras

- [ ] Guardado automático en localStorage (drafts)
- [ ] Editor de texto enriquecido (markdown/WYSIWYG)
- [ ] Múltiples imágenes
- [ ] Drag & drop para imágenes
- [ ] Crop/resize de imágenes antes de subir
- [ ] Preview del post antes de publicar
- [ ] Programar publicación (fecha futura)
- [ ] Etiquetas/tags adicionales
- [ ] Ubicación geográfica (mapa)
- [ ] Compartir en redes sociales al crear
- [ ] Límite de posts por día (rate limiting)
- [ ] Detección de contenido duplicado

---

## 🚀 Ruta de Acceso

### **URL:**
```
http://localhost:8080/create-post
```

### **Navegación:**
```
/posts → Click botón "Crear Post" → /create-post
```

### **Protección:**
```
✅ Requiere autenticación
✅ Redirige a "/" si no está logueado
✅ Lee userId de localStorage
```

---

## 📚 Constantes de Validación

```typescript
const MAX_TITLE_LENGTH = 100          // Máximo de caracteres para título
const MIN_CONTENT_LENGTH = 10         // Mínimo de caracteres para contenido
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB en bytes
```

---

## ✅ Checklist de Funcionalidades

**Autenticación:**
- ✅ Verifica token + user en localStorage
- ✅ Redirige a "/" si no está logueado
- ✅ Carga datos del usuario

**Categorías:**
- ✅ Carga desde backend (GET /api/categories/)
- ✅ Select desplegable dinámico
- ✅ Loading state mientras carga
- ✅ Manejo de errores

**Validaciones:**
- ✅ Título requerido + max 100 chars
- ✅ Contenido requerido + min 10 chars
- ✅ Categoría requerida
- ✅ Imagen opcional + max 10MB
- ✅ Validación en tiempo real
- ✅ Mensajes de error descriptivos

**Imagen:**
- ✅ Input tipo file
- ✅ Vista previa
- ✅ Botón eliminar
- ✅ Info del archivo (nombre + tamaño)
- ✅ Validación de tipo (solo imágenes)
- ✅ Validación de tamaño (max 10MB)

**UI/UX:**
- ✅ Contador de caracteres para título
- ✅ Cambio de colores según límite
- ✅ Placeholder descriptivos
- ✅ Loading spinner al cargar categorías
- ✅ Loading spinner al publicar
- ✅ Alert de errores
- ✅ Botón cancelar
- ✅ Deshabilita botón si hay errores

**Backend:**
- ✅ POST con FormData (multipart/form-data)
- ✅ Headers con Authorization
- ✅ Trim automático
- ✅ Manejo de errores HTTP
- ✅ Parse response

**Post-Creación:**
- ✅ Redirecciona a /post/{postId}
- ✅ Usuario ve su post inmediatamente

---

## 🎨 Paleta de Colores

```css
Gradiente principal: from-blue-600 to-purple-600
Background: from-slate-50 via-blue-50 to-purple-50
Errores: red-600, border-red-300
Warnings: amber-600
Texto normal: slate-600, slate-700
Bordes: slate-200
```

---

## 📋 Resumen

El componente `CreatePost`:
- ✅ **Página completa** con formulario profesional
- ✅ **Validación en tiempo real** de todos los campos
- ✅ **Upload de imágenes** con preview y validación
- ✅ **Carga dinámica** de categorías desde backend
- ✅ **FormData** con multipart/form-data
- ✅ **Protegido** solo para usuarios autenticados
- ✅ **Redirección** al post creado
- ✅ **Manejo de errores** robusto
- ✅ **Estados visuales** claros
- ✅ **Backend real** integrado

¡Componente completo y listo para crear posts! 🎉
