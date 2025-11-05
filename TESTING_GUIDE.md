# 🧪 Guía de Pruebas - ViveMedellín

## ✅ Checklist de Funcionamiento

### 1. Verificar que el Servidor Esté Corriendo

```bash
# El servidor debe estar en http://localhost:8080
# Abre el navegador y ve a: http://localhost:8080
```

**✅ Deberías ver:**

- Página de inicio de ViveMedellín con gradientes
- Header con botones "Iniciar Sesión" y "Registrarse"
- Hero section con el título grande
- Sección de eventos destacados (Bad Bunny y Guns N' Roses)

---

## 🔍 Pruebas del Sistema de Registro

### Prueba 1: Abrir el Modal de Registro

**Pasos:**

1. Abre http://localhost:8080
2. Click en el botón **"Registrarse"** (esquina superior derecha)

**✅ Debe aparecer:**

- Modal con título "Crear Cuenta"
- Icono de usuario con gradiente azul-morado
- 4 campos: Nombre Completo, Email, Contraseña, Sobre ti
- Panel de requisitos de contraseña (cuando escribas)

### Prueba 2: Validación de Contraseña en Tiempo Real

**Pasos:**

1. En el campo de contraseña, escribe: `abc123`

**✅ Debe mostrar:**

```
Requisitos de contraseña:
❌ 8-20 caracteres (solo tiene 6)
❌ 1 letra mayúscula (falta)
✅ 1 letra minúscula
✅ 1 número
❌ 1 carácter especial (@$!%*?&) (falta)
```

**Ahora escribe:** `Password123!`

**✅ Debe mostrar:**

```
Requisitos de contraseña:
✅ 8-20 caracteres
✅ 1 letra MAYÚSCULA
✅ 1 letra minúscula
✅ 1 número
✅ 1 carácter especial (@$!%*?&)
```

### Prueba 3: Registro Exitoso (requiere backend)

**Requisito previo:** Backend debe estar corriendo en `http://localhost:8080`

**Pasos:**

1. Llena el formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan.test@example.com"
   - Contraseña: "Password123!"
   - Sobre ti: "Me encantan los eventos en Medellín"
2. Click en "Crear Cuenta"

**✅ Si el backend está corriendo:**

- Botón cambia a "Creando cuenta..." con spinner
- Aparece mensaje verde: "¡Cuenta creada exitosamente! Redirigiendo..."
- Después de 2 segundos, se cierra el registro
- Se abre automáticamente el modal de login

**❌ Si el backend NO está corriendo:**

- Aparece error rojo: "No se pudo conectar con el servidor. Verifica tu conexión"

### Prueba 4: Email Duplicado

**Pasos:**

1. Intenta registrar con el mismo email de la Prueba 3
2. Click en "Crear Cuenta"

**✅ Debe mostrar:**

- Error rojo: "Este email ya está registrado"

---

## 🔐 Pruebas del Sistema de Login

### Prueba 5: Abrir el Modal de Login

**Pasos:**

1. Click en el botón **"Iniciar Sesión"** (esquina superior derecha)

**✅ Debe aparecer:**

- Modal con título "Iniciar Sesión"
- Icono de login con gradiente azul-morado
- 2 campos: Email y Contraseña
- Icono de ojo en el campo de contraseña

### Prueba 6: Mostrar/Ocultar Contraseña

**Pasos:**

1. Escribe cualquier contraseña: `MiPassword123!`
2. Click en el icono de ojo 👁️

**✅ Debe pasar:**

- La contraseña se muestra en texto plano
- El icono cambia a ojo tachado 👁️‍🗨️

3. Click de nuevo en el icono

**✅ Debe pasar:**

- La contraseña se oculta con puntos (••••••)
- El icono vuelve a ser ojo 👁️

### Prueba 7: Validación de Email

**Pasos:**

1. En el campo email, escribe: `usuario` (sin @)
2. Sal del campo (blur)

**✅ Debe mostrar:**

- Advertencia amarilla: "⚠️ Formato de email inválido"

### Prueba 8: Login Exitoso (requiere backend)

**Requisito previo:** Backend debe estar corriendo en `http://localhost:8080`

**Pasos:**

1. Ingresa credenciales válidas:
   - Email: (el que registraste en Prueba 3)
   - Contraseña: (la que usaste en Prueba 3)
2. Click en "Iniciar Sesión"

**✅ Si el backend está corriendo:**

- Botón cambia a "Iniciando..." con spinner
- El modal se cierra
- La página se refresca/redirige a "/"
- Abre DevTools (F12) → Aplicación → Almacenamiento local
- Deberías ver:
  - `token`: "eyJhbGciOiJIUzI1NiJ9..."
  - `user`: {"id":1,"name":"Juan Pérez",...}

**❌ Si el backend NO está corriendo:**

- Error rojo: "No se pudo conectar con el servidor. Verifica tu conexión"

### Prueba 9: Credenciales Incorrectas

**Pasos:**

1. Ingresa credenciales incorrectas:
   - Email: "wrong@email.com"
   - Contraseña: "wrongpassword"
2. Click en "Iniciar Sesión"

**✅ Debe mostrar:**

- Error rojo: "Email o contraseña incorrectos"

---

## 🔄 Pruebas de Navegación entre Modales

### Prueba 10: Registro → Login

**Pasos:**

1. Abre modal de Registro
2. Click en "¿Ya tienes cuenta? Inicia sesión"

**✅ Debe pasar:**

- El modal de registro se cierra
- El modal de login se abre inmediatamente

### Prueba 11: Login → Registro

**Pasos:**

1. Abre modal de Login
2. Click en "¿No tienes cuenta? Regístrate"

**✅ Debe pasar:**

- El modal de login se cierra
- El modal de registro se abre inmediatamente

---

## 🐛 Cómo Verificar Errores

### Abrir DevTools

1. Presiona **F12** (Windows/Linux) o **Cmd+Option+I** (Mac)
2. Ve a la pestaña **Console**
3. Busca errores en rojo

### Errores Comunes

#### Error: "Cannot connect to backend"

```
❌ Causa: Backend no está corriendo
✅ Solución: Inicia el backend en puerto 8080
```

#### Error: "CORS policy"

```
❌ Causa: Backend no permite peticiones desde localhost:8080
✅ Solución: Configura CORS en el backend
```

#### Error: "Unexpected token"

```
❌ Causa: Backend retorna HTML en vez de JSON
✅ Solución: Verifica que el endpoint sea correcto
```

---

## 🔍 Verificar LocalStorage

### Ver lo que se Guardó

**Con DevTools:**

1. F12 → Pestaña **Application** (Chrome) o **Storage** (Firefox)
2. Sidebar izquierdo → **Local Storage** → `http://localhost:8080`
3. Deberías ver:

```
Key: token
Value: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0...

Key: user
Value: {"id":1,"name":"Juan Pérez","email":"juan@example.com",...}
```

### Limpiar LocalStorage

**Desde la Consola:**

```javascript
localStorage.clear();
console.log("✅ LocalStorage limpiado");
```

**O desde DevTools:**

1. Click derecho en cualquier item
2. "Clear All" o "Delete"

---

## 📱 Pruebas Responsive

### Mobile (320px - 480px)

1. F12 → Click en el icono de dispositivo móvil
2. Selecciona "iPhone SE" o "Galaxy S8"

**✅ Debe verse bien:**

- Botones apilados verticalmente
- Modal ocupa casi toda la pantalla
- Campos tienen buen tamaño para tocar

### Tablet (768px - 1024px)

1. Selecciona "iPad" o "iPad Pro"

**✅ Debe verse bien:**

- Layout intermedio
- Botones pueden estar en fila

### Desktop (1280px+)

1. Maximiza la ventana del navegador

**✅ Debe verse bien:**

- Modal centrado con ancho máximo
- Botones en fila
- Espaciado adecuado

---

## 🎯 Checklist Final

Marca cada uno que funcione:

### Frontend

- [ ] Página carga sin errores
- [ ] Modal de Registro se abre
- [ ] Modal de Login se abre
- [ ] Validación de contraseña en tiempo real funciona
- [ ] Icono de mostrar/ocultar contraseña funciona
- [ ] Navegación entre modales funciona
- [ ] Responsive design se ve bien

### Backend (si está disponible)

- [ ] Registro exitoso funciona
- [ ] Login exitoso funciona
- [ ] Token se guarda en localStorage
- [ ] Usuario se guarda en localStorage
- [ ] Redirección después del login funciona
- [ ] Errores 401/409/500 se manejan correctamente

### Integración

- [ ] No hay errores en consola (F12)
- [ ] No hay warnings de React
- [ ] Network tab muestra peticiones correctas
- [ ] Estados de loading se muestran

---

## 🆘 ¿Algo no Funciona?

### Si no aparecen los modales:

```javascript
// Verifica en la consola:
console.log(document.querySelector('[role="dialog"]'));
// Debe retornar el elemento del modal
```

### Si los botones no hacen nada:

```javascript
// Verifica eventos en consola del navegador:
// Al dar click debe aparecer en la consola de DevTools
```

### Si el backend no responde:

```bash
# Verifica que esté corriendo:
curl http://localhost:8080/api/users/login

# Debe retornar algo, no "Connection refused"
```

---

## 📝 Comandos Útiles

```bash
# Reiniciar el servidor frontend
npm run dev

# Ver procesos en puerto 8080
lsof -ti:8080

# Matar proceso en puerto 8080 (si necesitas reiniciar)
kill -9 $(lsof -ti:8080)

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

**¿Todo funciona?** ✅ ¡Perfecto! Tu sistema está listo.

**¿Algo falla?** ❌ Revisa la sección de errores comunes arriba o avísame qué error ves.
