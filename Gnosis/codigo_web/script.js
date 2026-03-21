document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initStatsCounter();
    initMobileMenu();
    initSmoothScroll();
    initFormHandler();
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
