import os

html_template = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Premium | {niche_name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        :root {{
            --bg-dark: {bg_dark};
            --bg-surface: {bg_surface};
            --text-main: {text_main};
            --text-muted: {text_muted};
            --accent: {accent_color};
            --accent-glow: {accent_glow};
            --font-heading: 'Playfair Display', serif;
            --font-body: 'Plus Jakarta Sans', sans-serif;
            --transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }}

        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: var(--font-body); background-color: var(--bg-surface); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }}
        
        .container {{ max-width: 1200px; margin: 0 auto; padding: 0 5%; }}
        
        /* Navbar */
        .navbar {{ position: fixed; top: 0; width: 100%; z-index: 100; padding: 20px 0; background: {bg_dark}; backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }}
        .nav-content {{ display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 5%; }}
        .logo {{ font-family: var(--font-heading); font-size: 1.5rem; font-weight: 600; letter-spacing: 1px; color: var(--text-main); }}
        .nav-links a {{ color: var(--text-muted); text-decoration: none; margin-left: 30px; font-size: 0.95rem; transition: var(--transition); }}
        .nav-links a:hover {{ color: var(--accent); }}

        /* Hero */
        .hero {{ min-height: 100vh; display: flex; align-items: center; background: var(--bg-dark); position: relative; overflow: hidden; padding-top: 80px; }}
        .hero-bg {{ position: absolute; top: -20%; right: -10%; width: 600px; height: 600px; background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%); border-radius: 50%; z-index: 0; filter: blur(80px); opacity: 0.4; }}
        .hero-content {{ flex: 1; position: relative; z-index: 1; max-width: 600px; }}
        .hero-visual {{ flex: 1; position: relative; z-index: 1; display: flex; justify-content: flex-end; }}
        
        h1 {{ font-family: var(--font-heading); font-size: 4rem; line-height: 1.1; margin-bottom: 24px; font-weight: 600; }}
        h1 span {{ font-family: var(--font-heading); color: var(--accent); font-style: italic; }}
        p.subtitle {{ font-size: 1.2rem; color: var(--text-muted); margin-bottom: 40px; font-weight: 300; max-width: 500px; }}
        
        /* Buttons */
        .btn {{ display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; border-radius: 4px; font-weight: 500; text-decoration: none; transition: var(--transition); cursor: pointer; border: none; }}
        .btn-primary {{ background: var(--accent); color: {button_text}; box-shadow: 0 4px 20px var(--accent-glow); }}
        .btn-primary:hover {{ transform: translateY(-3px); box-shadow: 0 8px 30px var(--accent-glow); }}
        
        /* Glass Mockup */
        .glass-card {{ background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 16px; padding: 30px; width: 400px; box-shadow: 0 30px 60px rgba(0,0,0,0.3); transform: rotateY(-5deg) rotateX(2deg); transition: transform 0.5s ease; }}
        .glass-card:hover {{ transform: rotateY(0) rotateX(0) translateY(-10px); }}
        .glass-card h3 {{ font-size: 1.2rem; margin-bottom: 20px; color: var(--accent); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }}
        
        .mockup-item {{ display: flex; align-items: center; gap: 16px; margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.02); }}
        .mockup-item i {{ color: var(--accent); width: 24px; height: 24px; }}
        .mockup-item p {{ font-size: 0.95rem; margin-bottom: 2px; color: var(--text-main); }}
        .mockup-item span {{ font-size: 0.8rem; color: var(--text-muted); }}

        /* Problem Section */
        .section {{ padding: 120px 0; background-color: var(--bg-surface); }}
        .section-header {{ text-align: center; margin-bottom: 60px; max-width: 700px; margin-left: auto; margin-right: auto; }}
        .section-header h2 {{ font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 20px; color: var(--text-main); }}
        
        .grid-3 {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }}
        .feature-card {{ background: var(--bg-dark); padding: 40px 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }}
        .feature-card i {{ color: var(--accent); width: 32px; height: 32px; margin-bottom: 20px; }}
        .feature-card h4 {{ font-size: 1.2rem; margin-bottom: 10px; color: var(--text-main); }}
        .feature-card p {{ color: var(--text-muted); font-size: 0.95rem; }}

        /* Action */
        .cta-section {{ background: var(--bg-dark); padding: 100px 0; text-align: center; position: relative; border-top: 1px solid rgba(255,255,255,0.05); }}
        .cta-section::before {{ content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 300px; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }}
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-content">
            <div class="logo">Demo {niche_name}</div>
            <div class="nav-links">
                <a href="#">Servicios</a>
                <a href="#">Nosotros</a>
                <a href="#" class="btn btn-primary" style="padding: 10px 20px;">{nav_cta}</a>
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="hero-bg"></div>
        <div class="container" style="display: flex; align-items: center; justify-content: space-between;">
            <div class="hero-content">
                <h1>{headline_part1} <span>{headline_italic}</span></h1>
                <p class="subtitle">{subheadline}</p>
                <a href="#" class="btn btn-primary"><i data-lucide="message-square"></i> {main_cta}</a>
            </div>
            <div class="hero-visual">
                <div class="glass-card">
                    <h3>{mockup_title}</h3>
                    <div class="mockup-item">
                        <i data-lucide="{icon_1}"></i>
                        <div>
                            <p><strong>{mockup_item1_title}</strong></p>
                            <span>{mockup_item1_desc}</span>
                        </div>
                    </div>
                    <div class="mockup-item">
                        <i data-lucide="{icon_2}"></i>
                        <div>
                            <p><strong>{mockup_item2_title}</strong></p>
                            <span>{mockup_item2_desc}</span>
                        </div>
                    </div>
                    <div class="mockup-item">
                        <i data-lucide="{icon_3}"></i>
                        <div>
                            <p><strong>{mockup_item3_title}</strong></p>
                            <span>{mockup_item3_desc}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section class="section">
        <div class="container">
            <div class="section-header">
                <h2>El Estándar Premium.</h2>
                <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto;">Todo negocio del mercado {niche_name} necesita un Ecosistema Digital que atienda prospectos 24/7 sin sumar personal administrativo.</p>
            </div>
            <div class="grid-3">
                <div class="feature-card">
                    <i data-lucide="smartphone"></i>
                    <h4>Punto de Contacto 24/7</h4>
                    <p>Captamos a tus clientes ideales sin importar la hora, guiándolos directo a tu WhatsApp listos para comprar con la decisión tomada.</p>
                </div>
                <div class="feature-card">
                    <i data-lucide="shield-check"></i>
                    <h4>Autoridad Indiscutible</h4>
                    <p>Un diseño completamente alineado y sobrio que transmite confianza al instante, justificando tu exclusividad y precio de mercado.</p>
                </div>
                <div class="feature-card">
                    <i data-lucide="zap"></i>
                    <h4>Velocidad Incomparable</h4>
                    <p>Carga instantánea en cualquier celular o plataforma para que no pierdas a ningún prospecto que se frustra con pantallas en blanco.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: 20px;">¿Listo para escalar la operativa en tu negocio?</h2>
            <p style="color: var(--text-muted); margin-bottom: 40px;">Tu negocio en Mérida merece una presencia digital que cierre ventas incluso mientras duermes.</p>
            <a href="#" class="btn btn-primary"><i data-lucide="arrow-right"></i> Solicitar Ecosistema Digital</a>
        </div>
    </section>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
"""

niches = [
    {
        "id": "restaurantes", "niche_name": "Restaurante Formal",
        "bg_dark": "#0a0a0a", "bg_surface": "#121212", "text_main": "#f5f5f5", "text_muted": "#a3a3a3",
        "accent_color": "#D4AF37", "accent_glow": "rgba(212, 175, 55, 0.15)", "button_text": "#000",
        "nav_cta": "Reservar Mesa", "headline_part1": "Eleva la experiencia", "headline_italic": "gastronómica.",
        "subheadline": "Evita perder comensales o ceder tu margen a apps externas. Un menú interactivo sin intermediarios.",
        "main_cta": "Ver Menú Digital", "mockup_title": "Panel de Reservas",
        "icon_1": "utensils", "mockup_item1_title": "Mesa Confirmada (20:00)", "mockup_item1_desc": "Para 4 personas.",
        "icon_2": "shopping-bag", "mockup_item2_title": "Pedido Pickup", "mockup_item2_desc": "$1,200 MXN.",
        "icon_3": "star", "mockup_item3_title": "Reseña de 5 Estrellas", "mockup_item3_desc": "Procesada post-visita."
    },
    {
        "id": "comida_rapida", "niche_name": "Food Truck / Informal",
        "bg_dark": "#1a0f0a", "bg_surface": "#231510", "text_main": "#fdf7f3", "text_muted": "#bf9a89",
        "accent_color": "#E57254", "accent_glow": "rgba(229, 114, 84, 0.15)", "button_text": "#1a0f0a",
        "nav_cta": "Pedir a Domicilio", "headline_part1": "Saca más pedidos", "headline_italic": "desde WhatsApp.",
        "subheadline": "Una plataforma ágil para que tus clientes escojan sus alimentos y el pedido llegue listo a cocina. Cero errores.",
        "main_cta": "Armar Pedido Aquí", "mockup_title": "Monitor de Pedidos",
        "icon_1": "zap", "mockup_item1_title": "Pedido Express (18 min)", "mockup_item1_desc": "2 Combos Especiales.",
        "icon_2": "map-pin", "mockup_item2_title": "Dirección Extraída", "mockup_item2_desc": "Cobro de Envío Automático.",
        "icon_3": "wallet", "mockup_item3_title": "Pago por Transferencia", "mockup_item3_desc": "Comprobante validado."
    },
    {
        "id": "cafeterias", "niche_name": "Café de Especialidad",
        "bg_dark": "#1c1511", "bg_surface": "#281e18", "text_main": "#f7f0eb", "text_muted": "#b5a396",
        "accent_color": "#BA8B62", "accent_glow": "rgba(186, 139, 98, 0.15)", "button_text": "#170e0a",
        "nav_cta": "Ordenar Pick-Up", "headline_part1": "Tu esencia, ", "headline_italic": "ahora digital.",
        "subheadline": "Muestra el ambiente de tu café y permite pre-pedidos para clientes apresurados antes de pasar.",
        "main_cta": "Ver Especialidades", "mockup_title": "Órdenes de Tránsito",
        "icon_1": "coffee", "mockup_item1_title": "Flat White (Para Llevar)", "mockup_item1_desc": "Recuperando en 10 mins.",
        "icon_2": "user", "mockup_item2_title": "Cliente Recurrente", "mockup_item2_desc": "Llegó por campaña en IG.",
        "icon_3": "sun", "mockup_item3_title": "Desayuno Apartado", "mockup_item3_desc": "Reserva de mesa 8:30 AM."
    },
    {
        "id": "consultorios_medicos", "niche_name": "Consultorio Especialista",
        "bg_dark": "#0B1528", "bg_surface": "#111A30", "text_main": "#f0f4f8", "text_muted": "#a3b8cc",
        "accent_color": "#5D9CEC", "accent_glow": "rgba(93, 156, 236, 0.15)", "button_text": "#fff",
        "nav_cta": "Hacer una Cita", "headline_part1": "Automatiza la", "headline_italic": "recepción.",
        "subheadline": "Tu asistente está saturado. Deja que los pacientes agenden, vean tus credenciales y coticen consultas médicas online.",
        "main_cta": "Agendar Consulta", "mockup_title": "Bitácora Médica",
        "icon_1": "calendar-plus", "mockup_item1_title": "Cita Primera Vez", "mockup_item1_desc": "Revisión General - Lunes.",
        "icon_2": "file-text", "mockup_item2_title": "Pre-Diagnóstico Web", "mockup_item2_desc": "Dolor documentado.",
        "icon_3": "bell", "mockup_item3_title": "Recordatorio SMS", "mockup_item3_desc": "Reducción de Inasistencia."
    },
    {
        "id": "dental", "niche_name": "Clínica Dental",
        "bg_dark": "#0b1517", "bg_surface": "#142226", "text_main": "#eef8f8", "text_muted": "#91afb4",
        "accent_color": "#63C8CD", "accent_glow": "rgba(99, 200, 205, 0.15)", "button_text": "#041516",
        "nav_cta": "Sonrisa Perfecta", "headline_part1": "Ortodoncia y", "headline_italic": "confianza.",
        "subheadline": "Despliega una página que denote máxima higiene y profesionalismo, crucial para la toma de decisión del paciente.",
        "main_cta": "Evaluación Dental", "mockup_title": "Solicitudes Diarias",
        "icon_1": "smile", "mockup_item1_title": "Diseño de Sonrisa", "mockup_item1_desc": "Lead de alto valor ($).",
        "icon_2": "camera", "mockup_item2_title": "Antes y Después", "mockup_item2_desc": "Viendo galería premium.",
        "icon_3": "check-circle", "mockup_item3_title": "Autorización Firmada", "mockup_item3_desc": "Llegada desde formulario."
    },
    {
        "id": "veterinarias", "niche_name": "Veterinaria 24h",
        "bg_dark": "#0d1a18", "bg_surface": "#152623", "text_main": "#f0f8f5", "text_muted": "#96bcae",
        "accent_color": "#58C2A1", "accent_glow": "rgba(88, 194, 161, 0.15)", "button_text": "#0a1e17",
        "nav_cta": "Urgencia WhatsApp", "headline_part1": "Cuidando a los", "headline_italic": "que importan.",
        "subheadline": "Que los dueños te encuentren primero en emergencias nocturnas con un SEO local invencible y botón rápido.",
        "main_cta": "Pedir Cita Veterinaria", "mockup_title": "Panel de la Clínica",
        "icon_1": "heart-pulse", "mockup_item1_title": "Emergencia (23:15h)", "mockup_item1_desc": "Desde botón Web Rápido.",
        "icon_2": "info", "mockup_item2_title": "Cita de Vacunación", "mockup_item2_desc": "Programada en calendario.",
        "icon_3": "shopping-cart", "mockup_item3_title": "Venta de Alimento", "mockup_item3_desc": "Bulto Premium separado."
    },
    {
        "id": "salones_belleza", "niche_name": "Salón & Spa",
        "bg_dark": "#1f171c", "bg_surface": "#2b1f26", "text_main": "#faf0f5", "text_muted": "#cdafbx",
        "accent_color": "#DFA8CA", "accent_glow": "rgba(223, 168, 202, 0.15)", "button_text": "#1a0b12",
        "nav_cta": "Quiero Agendar", "headline_part1": "La belleza no", "headline_italic": "espera.",
        "subheadline": "No pierdas horas confirmando citas en chats. Un catálogo visual fluido para balayage, uñas y maquillaje.",
        "main_cta": "Ver Especialidades", "mockup_title": "Reservaciones de Estilo",
        "icon_1": "scissors", "mockup_item1_title": "Balayage Completo", "mockup_item1_desc": "Cita a las 11:00 am confirmada.",
        "icon_2": "image", "mockup_item2_title": "Revisando Estilos", "mockup_item2_desc": "Mirando galería web.",
        "icon_3": "dollar-sign", "mockup_item3_title": "Anticipo de 50%", "mockup_item3_desc": "Cobrado vía Web."
    },
    {
        "id": "barberias", "niche_name": "Barbershop Tradicional",
        "bg_dark": "#121212", "bg_surface": "#1e1e1e", "text_main": "#ffffff", "text_muted": "#a1a1a1",
        "accent_color": "#D08B5B", "accent_glow": "rgba(208, 139, 91, 0.15)", "button_text": "#111",
        "nav_cta": "Seleccionar Barbero", "headline_part1": "Tu estilo, tu", "headline_italic": "tiempo exacto.",
        "subheadline": "Clientes eligen a su barbero de confianza y su horario sin llamarte por teléfono mientras estás ocupado.",
        "main_cta": "Apartar Mi Sillón", "mockup_title": "Monitor del Barbero",
        "icon_1": "user-check", "mockup_item1_title": "Corte de Cabello", "mockup_item1_desc": "Con 'El Jefe'.",
        "icon_2": "clock", "mockup_item2_title": "Recordatorio Enviado", "mockup_item2_desc": "15 min antes de llegar.",
        "icon_3": "check-square", "mockup_item3_title": "Sin sillas vacías", "mockup_item3_desc": "Agenda 100% llena."
    },
    {
        "id": "ferreterias", "niche_name": "Ferretería Industrial",
        "bg_dark": "#151512", "bg_surface": "#21211e", "text_main": "#f7f7f2", "text_muted": "#a8a89b",
        "accent_color": "#E5B03A", "accent_glow": "rgba(229, 176, 58, 0.15)", "button_text": "#141002",
        "nav_cta": "Portal B2B", "headline_part1": "Cotizaciones al por", "headline_italic": "mayor automatizadas.",
        "subheadline": "Que los maestros de obra eligen el cableado o material desde su celular y te lo manden a despachar.",
        "main_cta": "Catálogo Herramientas", "mockup_title": "Cotizaciones B2B",
        "icon_1": "tool", "mockup_item1_title": "Lista de 15 Items", "mockup_item1_desc": "Pedido para Construcción Zona Norte.",
        "icon_2": "file-text", "mockup_item2_title": "Exportar Factura", "mockup_item2_desc": "Se requieren datos legales.",
        "icon_3": "truck", "mockup_item3_title": "Listos para Flete", "mockup_item3_desc": "Material apartado en almacén."
    },
    {
        "id": "talleres_mecanicos", "niche_name": "Taller Automotriz",
        "bg_dark": "#1f1a1a", "bg_surface": "#2a2222", "text_main": "#fcf5f5", "text_muted": "#bda6a6",
        "accent_color": "#D9524A", "accent_glow": "rgba(217, 82, 74, 0.15)", "button_text": "#fff",
        "nav_cta": "Auxilio Mecánico", "headline_part1": "Diagnósticos que sí", "headline_italic": "generan confianza.",
        "subheadline": "El cliente de Mérida necesita ver que tu taller está limpio, especializado y es seguro antes de llevar su vehículo.",
        "main_cta": "Cotizar Mantenimiento", "mockup_title": "Entrada de Vehículos",
        "icon_1": "tool", "mockup_item1_title": "Afinación Mayor", "mockup_item1_desc": "Ford Escape 2021.",
        "icon_2": "camera", "mockup_item2_title": "Reporte de Daños", "mockup_item2_desc": "Evidencia web enviada e impreso.",
        "icon_3": "map-pin", "mockup_item3_title": "Localización Exacta", "mockup_item3_desc": "Enviado desde el maps web."
    },
    {
        "id": "gimnasios", "niche_name": "Centro de Fitness",
        "bg_dark": "#111411", "bg_surface": "#1e241e", "text_main": "#f2f7f2", "text_muted": "#9bad9b",
        "accent_color": "#76C774", "accent_glow": "rgba(118, 199, 116, 0.15)", "button_text": "#051a05",
        "nav_cta": "Pase de Visita", "headline_part1": "Convierte clics", "headline_italic": "en inscripciones.",
        "subheadline": "Atrae miembros al gimnasio enseñando el equipo y recolectando datos mediante un Landing Page optimizado al máximo.",
        "main_cta": "Reservar Clase 1", "mockup_title": "Membresías Activas",
        "icon_1": "activity", "mockup_item1_title": "Inscripción Anual", "mockup_item1_desc": "Plan Full Access cobrado.",
        "icon_2": "users", "mockup_item2_title": "Reto 30 Días", "mockup_item2_desc": "45 Registrados por campaña web.",
        "icon_3": "user-check", "mockup_item3_title": "Apertura de Torniquete", "mockup_item3_desc": "Cliente VIP validado."
    },
    {
        "id": "ropa_y_calzado", "niche_name": "Boutique / Moda",
        "bg_dark": "#050505", "bg_surface": "#111111", "text_main": "#ffffff", "text_muted": "#999999",
        "accent_color": "#f2f2f2", "accent_glow": "rgba(255, 255, 255, 0.1)", "button_text": "#000",
        "nav_cta": "Explorar Tienda", "headline_part1": "Tu pasarela de ventas", "headline_italic": "24 horas.",
        "subheadline": "Un catálogo digital hiper-estético donde el cliente preselecciona prendas locales sin marearse entre mil mensajes.",
        "main_cta": "Ver Colección", "mockup_title": "Notificaciones Boutique",
        "icon_1": "shopping-cart", "mockup_item1_title": "Pedido Express: $2k", "mockup_item1_desc": "3 prendas apartadas Web.",
        "icon_2": "heart", "mockup_item2_title": "Wishlist Actualizada", "mockup_item2_desc": "Tendencia alta en Blusas Lino.",
        "icon_3": "truck", "mockup_item3_title": "Envío a Domicilio", "mockup_item3_desc": "Cobro de Envío Automatizado."
    },
    {
        "id": "lavanderias", "niche_name": "Lavandería & Tintorería",
        "bg_dark": "#0a121c", "bg_surface": "#142030", "text_main": "#eaf2fb", "text_muted": "#95a8bf",
        "accent_color": "#5C9BE8", "accent_glow": "rgba(92, 155, 232, 0.15)", "button_text": "#081b33",
        "nav_cta": "Pedir Recolección", "headline_part1": "Limpieza a", "headline_italic": "domicilio, fácil.",
        "subheadline": "Clientes agendan la recolección de sus prendas, tú organizas tu ruta y cobras de manera ultra eficiente en Mérida.",
        "main_cta": "Agendar Recolección", "mockup_title": "Logística Web",
        "icon_1": "truck", "mockup_item1_title": "Recolección Solicitada", "mockup_item1_desc": "Zona Altabrisa - 4 Kg.",
        "icon_2": "check", "mockup_item2_title": "Ticket Cobrado", "mockup_item2_desc": "$250 MXN (Lavado y Planchado).",
        "icon_3": "clock", "mockup_item3_title": "Devolución Martes", "mockup_item3_desc": "Confirmación mandada por WA."
    },
    {
        "id": "papelerias", "niche_name": "Papelería & Copias",
        "bg_dark": "#161b1f", "bg_surface": "#212930", "text_main": "#f4f7fa", "text_muted": "#aab6c2",
        "accent_color": "#6499D9", "accent_glow": "rgba(100, 153, 217, 0.15)", "button_text": "#0d1824",
        "nav_cta": "Enviar Archivos", "headline_part1": "Acelera trabajos", "headline_italic": "de impresión.",
        "subheadline": "Recibe cotizaciones y archivos para imprimir sin saturar tu WhatsApp o tu mostrador físico. Eficiencia local.",
        "main_cta": "Cotizar Volumen", "mockup_title": "Flujo de Trabajo",
        "icon_1": "printer", "mockup_item1_title": "Impresión 500 Pág", "mockup_item1_desc": "Recibidas vía formulario PDF.",
        "icon_2": "clipboard", "mockup_item2_title": "Lista de Útiles", "mockup_item2_desc": "Agregada al carrito web completo.",
        "icon_3": "check-circle", "mockup_item3_title": "Pedido Recogido", "mockup_item3_desc": "Pagado por anticipado."
    },
    {
        "id": "farmacias", "niche_name": "Farmacia Local",
        "bg_dark": "#0a1a12", "bg_surface": "#122a1f", "text_main": "#ebf7f1", "text_muted": "#8fbfa4",
        "accent_color": "#4EB581", "accent_glow": "rgba(78, 181, 129, 0.15)", "button_text": "#051c11",
        "nav_cta": "Buscar Medicina", "headline_part1": "La seguridad de tu", "headline_italic": "salud, en línea.",
        "subheadline": "Catálago rápido de medicamentos con botón directo al repartidor a la puerta de toda tu comunidad local.",
        "main_cta": "Consultar Inventario", "mockup_title": "Motor de Salud",
        "icon_1": "heart", "mockup_item1_title": "Medicamentos Controlados", "mockup_item1_desc": "Receta anexada en form seguro.",
        "icon_2": "truck", "mockup_item2_title": "Envío Prioritario 24h", "mockup_item2_desc": "Ruta asignada en farmacia.",
        "icon_3": "zap", "mockup_item3_title": "Almacén Actualizado", "mockup_item3_desc": "Stock descontado digitalmente."
    },
    {
        "id": "pet_shops", "niche_name": "Pet Shop",
        "bg_dark": "#181a17", "bg_surface": "#262b25", "text_main": "#f6fbf5", "text_muted": "#a4b5a3",
        "accent_color": "#9BD697", "accent_glow": "rgba(155, 214, 151, 0.15)", "button_text": "#162615",
        "nav_cta": "Para tu Mascota", "headline_part1": "Consiente a los", "headline_italic": "mejores amigos.",
        "subheadline": "Alimento premium, juguetes y accesorios en un catálogo fácil y hermoso para los amantes de las mascotas en la región.",
        "main_cta": "Ver Tienda Mascotas", "mockup_title": "Alimentos & Spa",
        "icon_1": "shopping-bag", "mockup_item1_title": "Alimento Royal Canin", "mockup_item1_desc": "Orden reservada vía web.",
        "icon_2": "smile", "mockup_item2_title": "Reserva de Baño Spa", "mockup_item2_desc": "Agendado Jueves 12:00 pm.",
        "icon_3": "bell", "mockup_item3_title": "Recordatorio Guardería", "mockup_item3_desc": "Pensión canina avisada."
    }
]

os.makedirs("Demos_Premium", exist_ok=True)

for niche in niches:
    html_content = html_template.format(
        niche_name=niche["niche_name"],
        bg_dark=niche["bg_dark"],
        bg_surface=niche["bg_surface"],
        text_main=niche["text_main"],
        text_muted=niche["text_muted"],
        accent_color=niche["accent_color"],
        accent_glow=niche["accent_glow"],
        button_text=niche["button_text"],
        nav_cta=niche["nav_cta"],
        headline_part1=niche["headline_part1"],
        headline_italic=niche["headline_italic"],
        subheadline=niche["subheadline"],
        main_cta=niche["main_cta"],
        mockup_title=niche["mockup_title"],
        icon_1=niche["icon_1"],
        mockup_item1_title=niche["mockup_item1_title"],
        mockup_item1_desc=niche["mockup_item1_desc"],
        icon_2=niche["icon_2"],
        mockup_item2_title=niche["mockup_item2_title"],
        mockup_item2_desc=niche["mockup_item2_desc"],
        icon_3=niche["icon_3"],
        mockup_item3_title=niche["mockup_item3_title"],
        mockup_item3_desc=niche["mockup_item3_desc"],
        problem_desc=f"Empresarios en {niche['niche_name']} merecen no sólo sobrevivir a la digitalización de Mérida, sino beneficiarse de ella."
    )
    
    file_path = f"Demos_Premium/demo_{niche['id']}.html"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

print(f"Generated {len(niches)} premium niche demos in Demos_Premium directory.")
