# Guía de Ciberseguridad para Web Apps (Agencia Gnosis)

Estimado equipo / cliente:
Al migrar de modelos estáticos ("Folletos Digitales") a **Sistemas Web Dinámicos con Bases de Datos** (Ej. Dashboards Clínicos, Citas, Usuarios), la **Ciberseguridad** ya no es "opcional", es un requerimiento ético y legal.

Sin las medidas correctas, un atacante básico podría robar tu cartera de clientes, extraer tus credenciales de cobro, o causar cargos económicos gigantes en tu facturación de Google Firebase. 

Como Agencia, blindamos nuestros desarrollos ("Paquetes Titanium") mediante estrictas capas de control:

---

## 1. Reglas Estrictas de Bases de Datos (Firebase Security Rules)
Es el escudo principal. Muchos desarrolladores novatos dejan sus bases "Abiertas". Nosotros configuramos Firebase con "Least-Privilege Mode".

**Políticas que Aplicamos:**
*   **Aislamiento de Expediente:** El `Usuario A` no puede acceder o leer a través de la API los datos del `Usuario B` (Crítico para centros médicos y gimnasios).
    ```javascript
    // Regla Teórica en Firebase
    match /pacientes/{pacienteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.dueñoId;
    }
    ```
*   **Control de Recepción:** Solo cuentas catalogadas con `rol: "admin"` pueden modificar los pagos o estados en la base de datos de socios.

## 2. Protección Contra Bots Financieros (Rate Limiting y Costos Ocultos)
En plataformas como Firebase/AWS, un atacante automatizado (Bot) puede enviar 500,000 peticiones basura a tu base de datos en una noche. Esto agota tu capa gratuita y **te factura miles de pesos sorpresa**.

**¿Cómo lo prevenimos?**
*   Implementamos captchas invisibles (`reCAPTCHA v3`). El cliente normal no los nota, pero los bots son bloqueados automáticamente del servidor.
*   Enrutamiento backend intermedio: Escondemos las llaves maestras en Servidores Seguros o *Cloud Functions*, impidiendo que las `API Keys` de facturación queden expuestas en el código fuente del navegador (`.js`).

## 3. Prevención Inyección XSS (Secuestro de Sesión Administrativa)
En un "Dashboard de Administración", la recepcionista escribe el nombre del nuevo paciente o socio. Si escribe código malicioso y tú abres su archivo, tu propia cuenta de **Admin** roba tus datos a favor del atacante.

**Medida:**
*   **Sanitización Activa:** Eliminamos o codificamos obligatoriamente caracteres como `<, >, script` en todas las entradas del usuario antes de que se alojen en Firebase. El nombre `<script>stealCookie()</script>` se transforma en puras letras seguras que el navegador interpreta textualmente y no como un ejecutable.

## 4. Bloqueo Geográfico y de Dominio (CORS y Referrer Policies)
Protegemos tu dominio y tu inversión digital impidiendo que terceros "clonen" o usen tus interfaces.

**Medidas:**
*   **Restricción DNS:** Configuración estricta en Google Cloud (GCP) para que tus llaves API de Mapas, Firebase, y Pagos, **SÓLO se activen si la solicitud viene de tu dominio exacto** (`www.tuclinica.com`). Si las copian, la API de Google rechazará la conexión, garantizando tu control del sistema.

---
*“Vender software de gestión (Dashboard + DB) garantiza un gran flujo económico para el negocio. Como ingenieros y directores de agencia, entregar software vulnerable sería catastrófico. Implementar esta arquitectura de 4 capas asegura la retención y confianza total del cliente.”*
