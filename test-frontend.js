// 🧪 Script de Prueba Rápida
// Copia y pega esto en la consola del navegador (F12 → Console)

console.log(
  "%c🧪 VERIFICACIÓN RÁPIDA DE VIVEMEDELLIN",
  "color: blue; font-size: 20px; font-weight: bold"
);

// 1. Verificar que React está cargado
if (typeof React !== "undefined") {
  console.log("✅ React está cargado");
} else {
  console.log("❌ React NO está cargado");
}

// 2. Verificar localStorage (después de login/registro)
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

console.log("\n%c📦 LocalStorage:", "color: purple; font-weight: bold");
if (token) {
  console.log("✅ Token encontrado:", token.substring(0, 20) + "...");
} else {
  console.log("⚠️  No hay token (normal si no has hecho login)");
}

if (user) {
  console.log("✅ Usuario encontrado:", JSON.parse(user));
} else {
  console.log("⚠️  No hay usuario guardado (normal si no has hecho login)");
}

// 3. Verificar conexión con backend
console.log("\n%c🌐 Probando Backend:", "color: green; font-weight: bold");
fetch("http://localhost:8080/api/users/login", {
  method: "OPTIONS",
})
  .then(() => {
    console.log("✅ Backend está accesible en puerto 8080");
  })
  .catch((error) => {
    console.log("❌ Backend NO está accesible:", error.message);
    console.log("💡 Asegúrate de iniciar el backend en puerto 8080");
  });

// 4. Verificar que los modales existen
console.log("\n%c🪟 Verificando Modales:", "color: orange; font-weight: bold");
setTimeout(() => {
  const buttons = document.querySelectorAll("button");
  let loginBtn = null;
  let registerBtn = null;

  buttons.forEach((btn) => {
    if (btn.textContent.includes("Iniciar Sesión")) loginBtn = btn;
    if (btn.textContent.includes("Registrarse")) registerBtn = btn;
  });

  if (loginBtn) {
    console.log('✅ Botón "Iniciar Sesión" encontrado');
  } else {
    console.log('❌ Botón "Iniciar Sesión" NO encontrado');
  }

  if (registerBtn) {
    console.log('✅ Botón "Registrarse" encontrado');
  } else {
    console.log('❌ Botón "Registrarse" NO encontrado');
  }
}, 1000);

// 5. Mostrar comandos útiles
console.log("\n%c🛠️ Comandos Útiles:", "color: teal; font-weight: bold");
console.log("localStorage.clear()           - Limpiar datos guardados");
console.log("location.reload()              - Recargar página");
console.log('window.location.href = "/"     - Ir al home');

console.log("\n%c📖 Guías Disponibles:", "color: blue; font-weight: bold");
console.log("TESTING_GUIDE.md     - Guía completa de pruebas");
console.log("LOGIN_BACKEND.md     - Documentación del login");
console.log("REGISTRO_BACKEND.md  - Documentación del registro");

console.log("\n" + "=".repeat(60));
