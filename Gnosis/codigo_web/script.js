document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initStatsCounter();
    initMobileMenu();
    initSmoothScroll();
    initFormHandler();
    updateDemoPreview();
});

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.flexDirection = 'column';
            navLinks.style.padding = '20px';
            navLinks.style.gap = '16px';
            navLinks.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 968) {
                navLinks.style.display = 'none';
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initFormHandler() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            let whatsappMessage = `¡Hola! Me gustaría cotizar un proyecto.%0A%0A`;
            whatsappMessage += `*Nombre:* ${data.nombre || 'No proporcionado'}%0A`;
            whatsappMessage += `*Negocio:* ${data.negocio || 'No proporcionado'}%0A`;
            whatsappMessage += `*WhatsApp:* ${data.telefono || 'No proporcionado'}%0A`;
            whatsappMessage += `*Paquete:* ${data.servicio || 'No seleccionado'}%0A`;
            if (data.mensaje) {
                whatsappMessage += `%0A*Mensaje:*%0A${data.mensaje}`;
            }
            
            const whatsappNumber = '525532521938';
            window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '¡Abriendo WhatsApp!';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ===== CART SYSTEM =====
let gnosisCart = [];

function addToCart(name, price, description) {
    // Only one package at a time (replace if already has one)
    gnosisCart = [{ name, price, description }];
    updateCartUI();
    
    // Open cart sidebar automatically
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Flash the cart badge
    const badge = document.getElementById('cartBadge');
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 300);
}

function removeFromCart(index) {
    gnosisCart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const itemsContainer = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const footer = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');
    const anticipoEl = document.getElementById('cartAnticipo');

    badge.textContent = gnosisCart.length;

    if (gnosisCart.length === 0) {
        emptyState.style.display = 'block';
        footer.style.display = 'none';
        // Remove all dynamic items
        document.querySelectorAll('.cart-item').forEach(el => el.remove());
        return;
    }

    emptyState.style.display = 'none';
    footer.style.display = 'block';

    // Rebuild items
    document.querySelectorAll('.cart-item').forEach(el => el.remove());
    const total = gnosisCart.reduce((sum, item) => sum + item.price, 0);
    const anticipo = Math.floor(total * 0.5);

    gnosisCart.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <button class="cart-item-remove" onclick="removeFromCart(${idx})">
                    <i class="fa-solid fa-trash-can"></i> Eliminar
                </button>
            </div>
            <div style="text-align:right">
                <div class="cart-item-price">$${item.price.toLocaleString('es-MX')}</div>
            </div>
        `;
        itemsContainer.insertBefore(el, emptyState);
    });

    totalEl.textContent = `$${total.toLocaleString('es-MX')} MXN`;
    anticipoEl.textContent = `$${anticipo.toLocaleString('es-MX')} MXN`;
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openCheckout() {
    if (gnosisCart.length === 0) return;
    
    const item = gnosisCart[0];
    const anticipo = Math.floor(item.price * 0.5);

    document.getElementById('checkoutSummary').innerHTML = `
        <div class="summary-plan">📦 ${item.name}</div>
        <div class="summary-amount">$${anticipo.toLocaleString('es-MX')} MXN <small style="font-size:0.7em;font-weight:400;color:var(--text-light);">anticipo (50%)</small></div>
        <div class="summary-note">El 50% restante ($${Math.floor(item.price * 0.5).toLocaleString('es-MX')}) se paga al recibir tu página lista.</div>
    `;

    // Close cart, open checkout
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('checkoutModal').classList.add('active');
}

function closeGnosisModals() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('receiptModal').classList.remove('active');
    document.body.style.overflow = '';
}

function processGnosisPayment(event) {
    event.preventDefault();

    const payText = document.getElementById('gnosis-pay-text');
    const spinner = document.getElementById('gnosis-pay-spinner');
    const btn = document.getElementById('gnosis-pay-btn');
    
    // Show spinner
    payText.style.display = 'none';
    spinner.style.display = 'inline-block';
    btn.disabled = true;

    setTimeout(() => {
        // Reset button
        payText.style.display = 'inline-flex';
        spinner.style.display = 'none';
        btn.disabled = false;

        const clientName = document.getElementById('gnosis-client-name').value;
        const bizName = document.getElementById('gnosis-business-name').value;
        const item = gnosisCart[0];
        const anticipo = Math.floor(item.price * 0.5);
        const txId = 'GNS-' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-MX') + ' ' + now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

        // Populate receipt
        document.getElementById('g-receipt-txn').textContent = txId;
        document.getElementById('g-receipt-date').textContent = dateStr;
        document.getElementById('g-receipt-client').textContent = clientName;
        document.getElementById('g-receipt-biz').textContent = bizName;
        document.getElementById('g-receipt-plan').textContent = item.name;
        document.getElementById('g-receipt-amount').textContent = `$${anticipo.toLocaleString('es-MX')} MXN`;

        // Switch to receipt
        document.getElementById('checkoutModal').classList.remove('active');
        document.getElementById('receiptModal').classList.add('active');

        // Clear cart
        gnosisCart = [];
        updateCartUI();
    }, 2200);
}

function sendCartWhatsApp() {
    if (gnosisCart.length === 0) return;
    const item = gnosisCart[0];
    const anticipo = Math.floor(item.price * 0.5);
    const msg = `¡Hola! Me interesa el *${item.name}* de Gnosis.%0A%0A` +
                `Precio total: $${item.price.toLocaleString('es-MX')} MXN%0A` +
                `Anticipo (50%): $${anticipo.toLocaleString('es-MX')} MXN%0A%0A` +
                `¿Me pueden dar más información?`;
    window.open(`https://wa.me/525532521938?text=${msg}`, '_blank');
}

function sendGnosisReceiptWhatsApp() {
    const txn = document.getElementById('g-receipt-txn').textContent;
    const date = document.getElementById('g-receipt-date').textContent;
    const client = document.getElementById('g-receipt-client').textContent;
    const biz = document.getElementById('g-receipt-biz').textContent;
    const plan = document.getElementById('g-receipt-plan').textContent;
    const amount = document.getElementById('g-receipt-amount').textContent;

    const msg = `*💰 NUEVO ANTICIPO RECIBIDO - GNOSIS*%0A%0A` +
                `✅ *ID:* ${txn}%0A` +
                `📅 *Fecha:* ${date}%0A` +
                `👤 *Cliente:* ${client}%0A` +
                `🏢 *Negocio:* ${biz}%0A` +
                `📦 *Paquete:* ${plan}%0A` +
                `💵 *Anticipo Pagado:* ${amount}%0A%0A` +
                `_Iniciar proyecto inmediatamente._`;
    window.open(`https://wa.me/525532521938?text=${msg}`, '_blank');
}

function formatCardNumber(input) {
    let v = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    input.value = parts.length ? parts.join(' ') : v;
}

function formatExpiry(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    input.value = v;
}

const demoColorThemes = {
    azul: { 
        primary: '#001F3F', 
        gradient: 'linear-gradient(135deg, #001F3F 0%, #1A3A5A 100%)', 
        accent: '#25D366',
        isDark: false,
        bgColor: '#fafafa',
        textColor: '#333333',
        cardBg: '#ffffff',
        navBg: '#001F3F',
        footerBg: '#f5f5f5'
    },
    noche: { 
        primary: '#0d0d0d', 
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
        accent: '#25D366',
        isDark: true,
        bgColor: '#121212',
        textColor: '#e0e0e0',
        cardBg: '#1e1e1e',
        navBg: '#0d0d0d',
        footerBg: '#0d0d0d'
    },
    dia: { 
        primary: '#ffffff', 
        gradient: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', 
        accent: '#001F3F',
        isDark: false,
        bgColor: '#ffffff',
        textColor: '#333333',
        cardBg: '#ffffff',
        navBg: '#ffffff',
        footerBg: '#f0f0f0'
    },
    dorado: { 
        primary: '#B8860B', 
        gradient: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)', 
        accent: '#25D366',
        isDark: false,
        bgColor: '#fafafa',
        textColor: '#333333',
        cardBg: '#ffffff',
        navBg: '#B8860B',
        footerBg: '#f5f5f5'
    },
    rojo: { 
        primary: '#DC2626', 
        gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)', 
        accent: '#ffffff',
        isDark: false,
        bgColor: '#fafafa',
        textColor: '#333333',
        cardBg: '#ffffff',
        navBg: '#DC2626',
        footerBg: '#f5f5f5'
    },
    verde: { 
        primary: '#059669', 
        gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', 
        accent: '#25D366',
        isDark: false,
        bgColor: '#fafafa',
        textColor: '#333333',
        cardBg: '#ffffff',
        navBg: '#059669',
        footerBg: '#f5f5f5'
    }
};

const demoBizTypes = {
    clinica: { name: 'Clínica', title: 'Clínica Dental', subtitle: 'Cuidado dental profesional', services: ['Limpieza dental', 'Ortodoncia', 'Blanqueamiento'], icon: 'fa-user-md' },
    restaurante: { name: 'Restaurante', title: 'Restaurante', subtitle: 'Los mejores platillos', services: ['Desayunos', 'Comida', 'Cenas'], icon: 'fa-utensils' },
    tienda: { name: 'Tienda', title: 'Tienda Online', subtitle: 'Lo que necesitas', services: ['Productos', 'Ofertas', 'Catálogo'], icon: 'fa-store' },
    estetica: { name: 'Estética', title: 'Estética', subtitle: 'Belleza y cuidado', services: ['Corte', 'Coloración', 'Tratamientos'], icon: 'fa-spa' },
    gimnasio: { name: 'Gimnasio', title: 'Gimnasio', subtitle: 'Entrena con nosotros', services: ['Clases', 'Membresías', 'Entrenador'], icon: 'fa-dumbbell' },
    taller: { name: 'Taller', title: 'Taller', subtitle: 'Servicio automotriz', services: ['Diagnóstico', 'Reparación', 'Mantenimiento'], icon: 'fa-wrench' }
};

let currentDemoColor = 'azul';
let currentDemoBiz = 'clinica';

function setDemoColor(color) {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) btn.classList.add('active');
    });
    currentDemoColor = color;
    updateDemoPreview();
}

function setDemoBiz2(biz) {
    document.querySelectorAll('.biz-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.biz2 === biz) btn.classList.add('active');
    });
    currentDemoBiz = biz;
    document.getElementById('bizLabel').textContent = demoBizTypes[biz].name;
    updateDemoPreview();
}

function toggleDemoFeature(feature) {
    const toggleMap = {
        'whatsapp': 'toggleWa',
        'mapa': 'toggleMapa',
        'form': 'toggleForm',
        'reviews': 'toggleReviews',
        'blog': 'toggleBlog'
    };
    
    const toggleEl = document.getElementById(toggleMap[feature]);
    if (toggleEl) {
        toggleEl.classList.toggle('active');
    }
}

function setDemoTab(tab) {
    document.querySelectorAll('.demo-cat-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    const contentArea = document.getElementById('demoContentArea');
    const services = demoBizTypes[currentDemoBiz].services;
    
    let html = '';
    if (tab === 'servicios') {
        services.forEach(svc => {
            html += `
                <div class="demo-service-card">
                    <div class="demo-svc-icon"><i class="fa-solid fa-check"></i></div>
                    <div class="demo-svc-info">
                        <h4>${svc}</h4>
                        <p>Descripción del servicio</p>
                    </div>
                    <button class="demo-svc-btn" onclick="demoBtnClick()">+</button>
                </div>
            `;
        });
    } else if (tab === 'productos') {
        services.forEach((svc, i) => {
            html += `
                <div class="demo-service-card">
                    <div class="demo-svc-img"><i class="fa-solid fa-image"></i></div>
                    <div class="demo-svc-info">
                        <h4>${svc} ${i+1}</h4>
                        <p>$999 MXN</p>
                    </div>
                    <button class="demo-svc-btn" onclick="demoBtnClick()">+</button>
                </div>
            `;
        });
    } else if (tab === 'promociones') {
        html = `
            <div class="demo-promo-card">
                <span class="demo-promo-tag">20% OFF</span>
                <h4>Promo especial</h4>
                <p>¡Solo hoy!</p>
            </div>
            <div class="demo-promo-card">
                <span class="demo-promo-tag">2x1</span>
                <h4>Combo ahorro</h4>
                <p>Llévate 2</p>
            </div>
        `;
    } else if (tab === 'contacto') {
        html = `
            <div class="demo-contact-card">
                <i class="fa-brands fa-whatsapp"></i>
                <h4>Escríbenos</h4>
                <p>Respuesta inmediata</p>
            </div>
            <div class="demo-contact-card">
                <i class="fa-solid fa-phone"></i>
                <h4>Llámanos</h4>
                <p>999 123 4567</p>
            </div>
            <div class="demo-contact-card">
                <i class="fa-solid fa-map-marker-alt"></i>
                <h4>Visítanos</h4>
                <p>Mérida, Yucatán</p>
            </div>
        `;
    }
    
    if (contentArea) {
        contentArea.innerHTML = html;
    }
}

function demoBtnClick() {
    const btn = event.currentTarget;
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
    
    btn.textContent = '¡Enviado!';
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Contáctanos';
    }, 1500);
}

function demoCardClick(card) {
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 100);
    
    const cardIcon = card.querySelector('.demo-card-icon');
    if (cardIcon) {
        cardIcon.style.background = '#25D366';
    }
}

function toggleDemoFeatureBox(element) {
    const wasActive = element.classList.contains('active');
    
    document.querySelectorAll('.demo-feature-box').forEach(box => {
        box.classList.remove('active');
    });
    
    if (!wasActive) {
        element.classList.add('active');
    }
}

function setDemoPage(page) {
    console.log('Page:', page);
}

function toggleDemoElement(element) {
    console.log('Toggle:', element);
}

function updateDemoPreview() {
    const theme = demoColorThemes[currentDemoColor];
    const biz = demoBizTypes[currentDemoBiz];
    
    const browserContent = document.querySelector('.browser-content');
    const nav = document.getElementById('demoNav');
    const hero = document.getElementById('demoHeroSection');
    const ctaBtn = document.getElementById('demoCtaBtn');
    const ctaTop = document.getElementById('demoCtaTop');
    const title = document.getElementById('demoTitle2');
    const subtitle = document.getElementById('demoSubtitle2');
    const svc1Title = document.getElementById('demoSvc1Title');
    const svc2Title = document.getElementById('demoSvc2Title');
    const svc3Title = document.getElementById('demoSvc3Title');
    const heroIcon = document.getElementById('demoHeroIcon');
    const cardIcons = document.querySelectorAll('.demo-card-icon');
    const cards = document.querySelectorAll('.demo-card');
    const servicesPreview = document.getElementById('demoServicesPreview');
    const featuresBar = document.getElementById('demoFeaturesBar');
    const footer = document.getElementById('demoFooter');
    const demoUrl = document.getElementById('demoUrl');
    
    // Apply theme to entire browser content
    if (browserContent) {
        browserContent.style.background = theme.bgColor;
        if (theme.isDark) {
            browserContent.classList.add('dark-mode');
        } else {
            browserContent.classList.remove('dark-mode');
        }
    }
    
    // Apply nav theme
    if (nav) {
        nav.style.background = theme.isDark ? '#0d0d0d' : theme.primary;
        nav.style.color = theme.isDark ? '#fff' : '#fff';
    }
    
    // Apply hero theme
    if (hero) {
        hero.style.background = theme.gradient;
        hero.style.color = theme.isDark ? '#fff' : '#fff';
    }
    
    // Apply CTA buttons
    if (ctaBtn) {
        ctaBtn.style.background = theme.isDark ? '#25D366' : '#25D366';
        ctaBtn.style.color = '#fff';
    }
    if (ctaTop) {
        ctaTop.style.background = theme.isDark ? '#25D366' : '#25D366';
        ctaTop.style.color = '#fff';
    }
    
    // Apply services preview
    if (servicesPreview) {
        servicesPreview.style.background = theme.isDark ? '#1a1a1a' : '#fafafa';
    }
    
    // Apply cards
    cards.forEach(card => {
        card.style.background = theme.cardBg;
        card.style.color = theme.textColor;
    });
    
    // Apply card icons
    cardIcons.forEach(icon => {
        icon.style.background = theme.isDark ? '#25D366' : theme.primary;
    });
    
    // Apply features bar
    if (featuresBar) {
        featuresBar.style.background = theme.cardBg;
    }
    
    // Apply footer
    if (footer) {
        footer.style.background = theme.isDark ? '#0d0d0d' : '#f5f5f5';
        footer.style.color = theme.isDark ? '#888' : '#888';
    }
    
    // Apply text colors
    if (title) {
        title.style.color = theme.isDark ? '#fff' : '#333';
        if (theme.primary === '#ffffff') title.style.color = '#333';
    }
    if (subtitle) {
        subtitle.style.color = theme.isDark ? '#aaa' : '#666';
    }
    
    const cardTitles = document.querySelectorAll('.demo-card h4');
    cardTitles.forEach(h4 => {
        h4.style.color = theme.textColor;
    });
    
    const cardTexts = document.querySelectorAll('.demo-card p');
    cardTexts.forEach(p => {
        p.style.color = theme.isDark ? '#888' : '#888';
    });
    
    // Update services titles
    if (svc1Title) svc1Title.textContent = biz.services[0];
    if (svc2Title) svc2Title.textContent = biz.services[1];
    if (svc3Title) svc3Title.textContent = biz.services[2];
    
    // Update hero icon
    if (heroIcon) heroIcon.className = `fa-solid ${biz.icon}`;
    if (heroIcon) heroIcon.style.color = theme.isDark ? '#25D366' : '#fff';
}

function toggleServicioCard(card) {
    const wasActive = card.classList.contains('active');
    
    document.querySelectorAll('.servicio-card').forEach(c => {
        c.classList.remove('active');
    });
    
    if (!wasActive) {
        card.classList.add('active');
    }
}

// Demo Interactivity Functions
const demoThemes = {
    azul: { bg: '#ffffff', bgLight: '#f8fafc', text: '#1e293b', textLight: '#64748b', accent: '#001F3F', accentDim: 'rgba(0,31,63,0.3)', isDark: false },
    noche: { bg: '#0f172a', bgLight: '#1e293b', text: '#f8fafc', textLight: '#94a3b8', accent: '#6366f1', accentDim: 'rgba(99,102,241,0.3)', isDark: true },
    dia: { bg: '#ffffff', bgLight: '#f0f9ff', text: '#0c4a6e', textLight: '#64748b', accent: '#0284c7', accentDim: 'rgba(2,132,199,0.3)', isDark: false },
    dorado: { bg: '#fefce8', bgLight: '#fef9c3', text: '#713f12', textLight: '#a16207', accent: '#B8860B', accentDim: 'rgba(184,134,11,0.3)', isDark: false },
    rojo: { bg: '#fef2f2', bgLight: '#fee2e2', text: '#7f1d1d', textLight: '#991b1b', accent: '#DC2626', accentDim: 'rgba(220,38,38,0.3)', isDark: false },
    verde: { bg: '#ecfdf5', bgLight: '#d1fae5', text: '#064e3b', textLight: '#047857', accent: '#059669', accentDim: 'rgba(5,150,105,0.3)', isDark: false }
};

const demoBiz = {
    clinica: { brand: 'Clínica Dental', title: 'Sonrisas Perfectas', subtitle: 'Cuidado dental profesional', icon: 'fa-user-md', svc1: 'Ortodoncia', svc2: 'Limpieza', svc3: 'Blanqueamiento' },
    restaurante: { brand: 'Restaurante', title: 'Sabores Únicos', subtitle: 'La mejor experiencia culinaria', icon: 'fa-utensils', svc1: 'Menú Digital', svc2: 'Reservas', svc3: 'Eventos' },
    tienda: { brand: 'Mi Tienda', title: 'Lo que necesitas', subtitle: 'Calidad y precios justos', icon: 'fa-store', svc1: 'Catálogo', svc2: 'Ofertas', svc3: 'Envíos' },
    estetica: { brand: 'Spa & Belleza', title: 'Relajación Total', subtitle: 'Tu momento de paz', icon: 'fa-spa', svc1: 'Masajes', svc2: 'Tratamientos', svc3: 'Paquetes' },
    gimnasio: { brand: 'Gimnasio Fit', title: 'Transforma Tu Cuerpo', subtitle: 'Logra tus metas', icon: 'fa-dumbbell', svc1: 'Clases', svc2: 'Entrenadores', svc3: 'Membresías' },
    taller: { brand: 'Taller Mecánico', title: 'Servicio Confiable', subtitle: 'Tu auto en buenas manos', icon: 'fa-wrench', svc1: 'Diagnóstico', svc2: 'Reparaciones', svc3: 'Mantenimiento' }
};

function setDemoColor(color) {
    const theme = demoThemes[color];
    const content = document.getElementById('demoScreenContent');
    const browserFrame = document.querySelector('.browser-frame');
    const browserToolbar = document.querySelector('.browser-toolbar');
    const urlBar = document.querySelector('.browser-url-bar');
    
    if (content) {
        content.style.setProperty('--demo-bg', theme.bg);
        content.style.setProperty('--demo-bg-light', theme.bgLight);
        content.style.setProperty('--demo-text', theme.text);
        content.style.setProperty('--demo-text-light', theme.textLight);
        content.style.setProperty('--demo-accent', theme.accent);
        content.style.setProperty('--demo-accent-dim', theme.accentDim);
        
        content.style.background = `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgLight} 100%)`;
    }
    
    if (browserFrame) {
        browserFrame.style.background = theme.isDark ? '#1e293b' : '#ffffff';
        browserFrame.style.boxShadow = theme.isDark 
            ? '0 25px 80px rgba(0,0,0,0.5)' 
            : '0 25px 80px rgba(0,0,0,0.15)';
    }
    
    if (browserToolbar) {
        browserToolbar.style.background = theme.isDark ? '#0f172a' : '#f8fafc';
    }
    
    if (urlBar) {
        urlBar.style.background = theme.isDark ? '#334155' : '#e2e8f0';
        urlBar.style.color = theme.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    }
    
    document.querySelectorAll('.demo-color-btn').forEach(btn => {
        btn.style.borderColor = 'transparent';
        btn.style.opacity = '0.6';
    });
    event.target.style.borderColor = theme.accent;
    event.target.style.opacity = '1';
}

function setDemoBiz2(biz) {
    const data = demoBiz[biz];
    document.getElementById('demoBrand').textContent = data.brand;
    document.getElementById('demoTitle2').textContent = data.title;
    document.getElementById('demoSubtitle2').textContent = data.subtitle;
    document.getElementById('demoHeroIcon').className = `fa-solid ${data.icon}`;
    document.getElementById('demoSvc1Title').textContent = data.svc1;
    document.getElementById('demoSvc2Title').textContent = data.svc2;
    document.getElementById('demoSvc3Title').textContent = data.svc3;
    
    document.querySelectorAll('.demo-biz-btn').forEach(btn => {
        btn.style.borderColor = 'transparent';
        btn.style.color = '#94a3b8';
        btn.style.background = '#334155';
    });
    event.target.style.borderColor = '#6366f1';
    event.target.style.color = 'white';
    event.target.style.background = '#4338ca';
}

function toggleIndexCard(card) {
    const wasActive = card.classList.contains('active');
    const dropdown = card.querySelector('.index-card-dropdown');
    const toggle = card.querySelector('span');
    
    document.querySelectorAll('.servicio-card-interactive').forEach(c => {
        c.classList.remove('active');
        c.style.borderColor = 'var(--border)';
        const d = c.querySelector('.index-card-dropdown');
        if (d) {
            d.style.maxHeight = '0';
            d.style.opacity = '0';
            d.style.marginTop = '0';
        }
        const t = c.querySelector('span');
        if (t) t.style.transform = 'rotate(0deg)';
    });
    
    if (!wasActive) {
        card.classList.add('active');
        card.style.borderColor = 'var(--primary)';
        if (dropdown) {
            dropdown.style.maxHeight = '300px';
            dropdown.style.opacity = '1';
            dropdown.style.marginTop = '16px';
        }
        if (toggle) toggle.style.transform = 'rotate(45deg)';
    }
}
