/**
 * Módulo de Seguridad Institucional y Conexión Firebase (Simulación)
 * Agencia GNOSIS
 * 
 * Este archivo establece tres escudos:
 * 1. Sanitización Anti-XSS (Evita inyección de scripts).
 * 2. Protección de API mediante ocultamiento (No en hardcode publico).
 * 3. Restricción de Autenticación (Bloquea la UI si no hay sesión).
 */

// 1. ESCUDO ANTI-XSS (Cross-Site Scripting)
// Esta función debe llamarse CADA VEZ que el usuario escriba algo en la plataforma
// antes de que se envíe a Firebase o se pinte en la pantalla.
function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[^\w. @-]/gi, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}

// Ejemplo de uso: Un atacante intenta agregar un nombre malicioso
const nombreAtacante = "<script>alert('Hacked!');</script>";
const nombreLimpio = sanitizeInput(nombreAtacante);
// Resultado: &#60;script&#62;alert&#40;&#39;Hacked!&#39;&#41;&#59;&#60;&#47;script&#62; (Inofensivo)


// 2. CONFIGURACIÓN FIREBASE (Protección de Credenciales)
// NUNCA subir este archivo a un repositorio público (GitHub).
// En producción, estas variables se manejan con .env de Vercel/Cloudflare Pages.
const firebaseConfig = {
    apiKey: "AIzaSy_AQUÍ_IRÍA_LA_API_KEY_PROTEGIDA_DESDE_GOOGLE_CLOUD",
    authDomain: "vetcare-premium.firebaseapp.com",
    projectId: "vetcare-premium",
    storageBucket: "vetcare-premium.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcd1234efgh5678"
};

console.log("🔒 [Ciberseguridad V1] Módulos de Protección Cargados Exitosamente.");
console.log(`🔒 El dato malicioso se transformó en seguro: ${nombreLimpio}`);

// 3. ESCUDO DE SESIÓN (Protección de Rutas del Dashboard)
function requireAuth(user) {
    // Si no hay sesión válida, borramos el contenido de la pantalla y forzamos reinicio.
    if (!user || user.role !== 'admin') {
        document.querySelector('.main-wrapper').innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column; background: #FEE2E2;">
                <h1 style="color: #991B1B;">⚠️ ACCESO DENEGADO</h1>
                <p>No tienes una sesión autorizada o tu rol no es válido. La Base de Datos no enviará información.</p>
                <button onclick="location.reload()" style="margin-top:20px; padding: 10px 20px; background: #991B1B; color:white; border:none; border-radius:5px; cursor:pointer;">Volver a Cargar Sesión</button>
            </div>
        `;
        // Destruir barra lateral
        document.querySelector('.sidebar').style.display = 'none';
        return false;
    }
    return true;
}

// SIMULADOR DE INGRESO (Demo para demostración al cliente final)
window.onload = () => {
    // Para motivos de la demo, preguntamos al usuario si desea visualizar la versión segura o simular el ataque.
    const modoSeguro = confirm("SIMULADOR DE CIBERSEGURIDAD:\n\n¿Quieres simular que iniciaste sesión correctamente como Recepcionista?\n(Presiona 'Cancelar' para ver qué pasaría si un hacker intenta entrar sin sesión)");
    
    const usuarioMock = modoSeguro ? { uid: "12345", role: "admin" } : null;
    
    // Al intentar cargar la página, la barrera actúa de inmediato
    requireAuth(usuarioMock);
};
