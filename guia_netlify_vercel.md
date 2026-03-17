# Guía: Cómo Subir tu Primera Página Web a Internet (Gratis y sin límites)

Subir los "Demos Web" que generamos (`index.html`) a internet es clave para enviarlos por WhatsApp y que el cliente los vea en su celular. 

Si **Netlify o Vercel te están pidiendo créditos o llegaste a tu límite gratuito**, ¡no te preocupes! Sitios web estáticos (simples HTML/CSS como nuestros demos) se pueden alojar de forma **100% gratuita** y prácticamente ilimitada en otras plataformas de primer nivel.

Aquí te dejo las mejores alternativas actuales, ordenadas de la más fácil a la más profesional:

---

## ⚡ Método 1: Surge.sh (La más rápida y sin límites de "créditos")

Surge es una herramienta increíble para publicar demos web en literal *segundos* usando la terminal de tu computadora. Es 100% gratuita para páginas estáticas y no te va a bloquear por ancho de banda en tus prospecciones.

**Cómo usarla:**
1. Abre tu terminal (PowerShell o CMD) en Windows.
2. Si no tienes Node.js, instálalo desde [nodejs.org](https://nodejs.org/).
3. Instala Surge escribiendo: `npm install --global surge`
4. Navega en la terminal a la carpeta de tu demo. Ejemplo:
   `cd D:\Manager-paginas.web-antigravity\Restaurantes`
5. Escribe el comando: `surge`
6. Te pedirá crear una cuenta (correo y contraseña) directamente ahí en la terminal, solo por primera vez.
7. Te sugerirá un dominio aleatorio (ej. `grumpy-cat.surge.sh`). Puedes borrarlo y escribir el tuyo propio (ej. `demo-restaurante-merida.surge.sh`).
8. Presiona Enter. ¡En 3 segundos tu página está en vivo!

---

## 🐙 Método 2: GitHub Pages (Totalmente Gratis y de por vida)

GitHub Pages es la opción favorita de los programadores. Es completamente **gratis para siempre**, no tiene "límites de créditos mensuales" que te corten el servicio, y da muchísima confianza.

**Cómo usarla:**
1. Crea una cuenta en [GitHub.com](https://github.com/).
2. Dale al botón verde **"New"** para crear un nuevo "Repository" (Repositorio).
3. Ponle un nombre, por ejemplo: `demo-clinica`. Asegúrate de que esté en **"Public"**.
4. Haz clic en "Create repository".
5. En la siguiente pantalla, verás que puedes subir archivos. Busca el botón **"uploading an existing file"** (subir un archivo existente).
6. Arrastra tu archivo `index.html` (o `demo_website_talleres.html` renombrado a `index.html`) y sube todo. Dale click a "Commit changes" (Guardar).
7. Arriba a la derecha, ve a **Settings** (Configuración) del repositorio.
8. En el menú izquierdo, busca la sección **"Pages"**.
9. Donde dice "Source", cambia la opción de "None" a **"main"** (o "master") y dale a "Save" (Guardar).
10. ¡Listo! En 2-3 minutos aparecerá tu link permanente y gratuito ahí mismo. (Será parecido a: `https://tu-usuario.github.io/demo-clinica/`).

---

## ☁️ Método 3: Cloudflare Pages (Grado Premium, 100% Gratis)

Cloudflare maneja casi el 20% del internet global. Su servicio "Pages" tiene un plan gratuito colosal, tan grande que **jamás te lo vas a terminar** (hasta 500 subidas al mes y ancho de banda infinito).

**Cómo usarla:**
1. Crea una cuenta en [Cloudflare (dash.cloudflare.com)](https://dash.cloudflare.com/sign-up).
2. En el menú de la izquierda, haz clic en **"Workers & Pages"**.
3. Haz clic en el botón azul **"Create application"** y selecciona la pestaña **"Pages"**.
4. Selecciona la opción **"Upload assets"** (Subir directamente, en vez de conectar Git).
5. Ponle un nombre a tu proyecto (ej: `demo-gimnasio-merida`).
6. Arrastra tu carpeta entera (que contenga el archivo HTML que debes nombrar `index.html`) hacia el recuadro que te aparece en pantalla.
7. Haz clic en **Deploy site**.
8. ¡Y ya está! Tienes un enlace gratuito súper profesional y rapidísimo (básicamente indestructible) que terminará en `.pages.dev` (ej: `https://demo-gimnasio-merida.pages.dev`).

---

### ¿Cuál es mi recomendación para evitar pagar Netlify en esta fase?

Si estás prospectando **100 negocios** y solo quieres enviarlos rápido sin que Netlify te amenace con cobrarte o pararte la cuenta:
- **Para impresionar:** Usa **GitHub Pages** poniéndole al repositorio un nombre interesante como `demo-app-restaurante`. 
- **Para velocidad extrema (arrastrar y soltar sin límites de Netlify):** Usa **Cloudflare Pages**. Es lo mismo que Netlify Drop pero con una gran empresa detrás que no restringe el ancho de banda a las agencias que van empezando.
