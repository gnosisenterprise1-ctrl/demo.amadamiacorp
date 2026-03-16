# Guía: Cómo Subir tu Primera Página Web a Internet (Gratis)

Subir una página web a internet hoy en día ya no requiere comprar servidores caros ni usar programas complicados como _FileZilla_. Usaremos **Netlify** o **Vercel**, que son plataformas de despliegue modernas, rapidísimas y gratuitas para páginas estáticas (HTML/CSS/JS).

**Aclaración sobre la funcionalidad:**
Sí, una vez que subes el `index.html` a Netlify o Vercel, **TODO es funcional**.
- Si un usuario le da a un botón de WhatsApp, se le abrirá la app.
- Si le da a un teléfono, su celular intentará marcar.
- Las animaciones y estilos se verán exactamente igual que como las ves en tu computadora.

---

## 🚀 Método 1: Netlify Drop (El más fácil y rápido para iniciar)

Si solo tienes una carpeta con un archivo `index.html` (como el del Consultorio o Ferretería) y quieres que ya esté en internet en 2 minutos para mostrársela al cliente en tu celular:

1.  Crea una cuenta gratuita en **[Netlify (https://app.netlify.com/)](https://app.netlify.com/)**. Puedes usar tu correo de Google o GitHub.
2.  Una vez dentro de tu Panel de Control (Dashboard), busca la sección que dice **"Sites"** (o "Add new site").
3.  Selecciona la opción **"Deploy manually"** (Desplegar manualmente).
4.  Verás un círculo grande punteado que dice "Drag and drop your site output folder here" (Arrastra y suelta tu carpeta aquí).
5.  Abre tu Explorador de Archivos en Windows.
6.  Toma **toda la carpeta** (por ejemplo `D:\Manager-paginas.web-antigravity\Consultorios_Medicos`) y arrástrala hacia ese círculo en el navegador.
7.  ¡Listo! En segundos, Netlify te dará un enlace público temporal (algo como `https://cheerful-unicorn-12345.netlify.app`).
8.  **OPCIONAL:** En Netlify, puedes ir a "Domain Management" y cambiar ese nombre feo por algo como `https://clinica-cmyb.netlify.app`, lo que ya se ve mucho más profesional para enviar en tu mensaje de prospección.

---

## 👩‍💻 Método 2: Vercel (El más profesional a largo plazo)

Si decides hacer aplicaciones más complejas (React, Next.js), Vercel es el rey. Pero también sirve para páginas sencillas.

1.  Crea tu cuenta gratuita en **[Vercel (https://vercel.com/)](https://vercel.com/)**.
2.  Si estás trabajando con carpetas simples de HTML, puedes descargar la herramienta de línea de comandos de Vercel (`npm i -g vercel`) o usar Github.
3.  **La manera más recomendada (Git/GitHub):**
    *   Sube el código de tu proyecto a un repositorio en **GitHub**.
    *   En Vercel, dale a "Add New Project".
    *   Vincula tu cuenta de GitHub y elige el repositorio de tu página.
    *   Dale clic a "Deploy".
    *   En menos de un minuto, tendrás una URL pública y gratuita (ej: `https://ferreteria-iris.vercel.app`).
4.  Igual que Netlify, si el cliente te paga los $4,500 MXN del paquete, tú les compras el "Dominio" (ej `www.ferreteriairis.com` en plataformas como Namecheap o GoDaddy por $10 USD) y en Vercel simplemente conectas ese dominio a tu proyecto en la pestaña "Domains". ¡Magia pura!

---

### ¿Cuál es mi recomendación para tu agencia?
1. **Para Prospectar en Frío:** Usa Netlify Drop con la carpeta que te generé, cámbiale el nombre al link (ej, `https://demo-clinica.netlify.app`) y mándaselo por WhatsApp al doctor junto con los guiones. Le va a encantar ver la página funcionando directo en su celular.
2. **Para Entregas Finales:** Cuando el cliente ya te pague, compra su dominio `.com` y conéctalo a esa misma página en Netlify/Vercel.
