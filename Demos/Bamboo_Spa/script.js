/* ================================================
   BAMBÚ SPA – script.js
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== NAVBAR SCROLL ===== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    /* ===== MOBILE MENU ===== */
    const mobileBtn = document.getElementById('mobileMenu');
    const navLinks  = document.querySelector('.nav-links');
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    /* ===== FADE IN ON SCROLL ===== */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ===== COUNTER ANIMATION ===== */
    const statNums = document.querySelectorAll('.stat-num');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            statNums.forEach(num => animateCounter(num));
        }
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 16);
    }

    /* ===== PARTICLES in HERO ===== */
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                --dur: ${4 + Math.random() * 6}s;
                --delay: ${Math.random() * 4}s;
                opacity: ${0.3 + Math.random() * 0.5};
                width: ${2 + Math.random() * 5}px;
                height: ${2 + Math.random() * 5}px;
                background: ${Math.random() > 0.5 ? 'rgba(70,160,112,0.45)' : 'rgba(143,188,143,0.45)'};
            `;
            particleContainer.appendChild(p);
        }
    }

    /* ===== GALLERY FILTER ===== */
    const tabs = document.querySelectorAll('.gallery-tab');
    const items = document.querySelectorAll('.gallery-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            items.forEach(item => {
                const cat = item.dataset.cat;
                const show = filter === 'all' || cat === filter;
                item.style.display = show ? '' : 'none';
                if (show) {
                    item.style.animation = 'fadeIn .4s ease forwards';
                }
            });
        });
    });

    /* ===== SMOOTH SCROLL ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 12;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ===== ACTIVE NAV HIGHLIGHT ON SCROLL ===== */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - navbar.offsetHeight - 60;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--bamboo)' : '';
        });
    });

    /* ===== BOOKING & DEPOSIT FLOW ===== */
    const bookingModal      = document.getElementById('bookingModal');
    const bookingService    = document.getElementById('bookingService');
    const totalPriceEl      = document.getElementById('totalPrice');
    const depositPriceEl    = document.getElementById('depositPrice');
    const selectedServiceText = document.getElementById('selectedServiceText');
    const btnPayDeposit     = document.getElementById('btnPayDeposit');
    const closeBooking      = document.getElementById('closeBooking');
    const overlayBooking    = document.querySelector('.booking-modal-overlay');
    
    // Receipt elements
    const rService = document.getElementById('rService');
    const rDeposit = document.getElementById('rDeposit');
    const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
    const receiptDate = document.getElementById('receiptDate');
    const receiptTime = document.getElementById('receiptTime');
    
    // Steps
    const step0        = document.getElementById('step0');
    const step1        = document.getElementById('step1');
    const stepLoading  = document.getElementById('stepLoading');
    const stepSuccess  = document.getElementById('stepSuccess');

    // Open Modal
    document.querySelectorAll('.btn-book-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const service = btn.getAttribute('data-service');
            const price   = btn.getAttribute('data-price');
            
            if (service && price) {
                Array.from(bookingService.options).forEach(opt => {
                    if (opt.value.toLowerCase().includes(service.toLowerCase())) {
                        opt.selected = true;
                    }
                });
            }
            
            updateBookingPrices();
            resetBookingSteps();
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Update Prices
    function updateBookingPrices() {
        if (!bookingService) return;
        const selectedOption = bookingService.options[bookingService.selectedIndex];
        const price = parseFloat(selectedOption.getAttribute('data-price'));
        const deposit = price * 0.5;
        
        if (totalPriceEl) totalPriceEl.textContent = `$${price.toFixed(2)}`;
        if (depositPriceEl) depositPriceEl.textContent = `$${deposit.toFixed(2)}`;
        if (selectedServiceText) selectedServiceText.textContent = selectedOption.value;
    }

    bookingService.addEventListener('change', updateBookingPrices);

    // Reset steps
    function resetBookingSteps() {
        step0.classList.remove('hidden');
        step1.classList.add('hidden');
        stepLoading.classList.add('hidden');
        stepSuccess.classList.add('hidden');
    }

    // LISTENER de Calendly (Detecta cuando agendan)
    window.addEventListener('message', (e) => {
        if (e.data.event && e.data.event.indexOf('calendly.event_scheduled') !== -1) {
            // El cliente ya seleccionó horario. Pasamos al PAGO.
            console.log("Cita agendada en Calendly. Pasando a pago...");
            setTimeout(() => {
                step0.classList.add('hidden');
                step1.classList.remove('hidden');
            }, 600); // Pequeño delay para naturalidad
        }
    });

    // Close Modal
    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBooking.addEventListener('click', closeModal);
    overlayBooking.addEventListener('click', closeModal);

    // Simulated Payment Flow
    btnPayDeposit.addEventListener('click', () => {
        step1.classList.add('hidden');
        stepLoading.classList.remove('hidden');
        
        // Prepare receipt data
        const selectedOption = bookingService.options[bookingService.selectedIndex];
        const price = parseFloat(selectedOption.getAttribute('data-price'));
        const deposit = (price * 0.5).toFixed(2);
        
        rService.textContent = selectedOption.value;
        rDeposit.textContent = `$${deposit}`;

        // Set today's date as default in receipt
        const today = new Date().toISOString().split('T')[0];
        receiptDate.value = today;

        // Simulate processing
        setTimeout(() => {
            stepLoading.classList.add('hidden');
            stepSuccess.classList.remove('hidden');
        }, 2200);
    });

    // Send WhatsApp Receipt
    btnSendWhatsapp.addEventListener('click', () => {
        const date = receiptDate.value;
        const time = receiptTime.value;
        const service = rService.textContent;
        const deposit = rDeposit.textContent;

        if (!date || !time) {
            alert("Por favor confirma la fecha y hora seleccionada en Calendly.");
            return;
        }

        const message = `*CONFIRMACIÓN DE CITA - BAMBÚ SPA*%0A%0A` +
                        `✅ *Pago recibido:* ${deposit} (50% anticipo)%0A` +
                        `🌿 *Servicio:* ${service}%0A` +
                        `📅 *Fecha:* ${date}%0A` +
                        `⏰ *Horario:* ${time}%0A%0A` +
                        `Su cita ha quedado confirmada en nuestra sucursal de Torreón. ¡Le esperamos!`;
        
        window.open(`https://wa.me/5218711939214?text=${message}`, '_blank');
    });

    // Method Cards selection
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

});
