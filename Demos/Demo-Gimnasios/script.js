// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
// Trigger once on load
reveal();

// WhatsApp Booking Form Logic
const bookingForm = document.getElementById('booking-form');

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('gym-phone').value;
    const name = document.getElementById('nombre').value;
    const interest = document.getElementById('interes').value;
    const date = document.getElementById('fecha').value;
    
    // Construct the WhatsApp message
    let message = `¡Hola! Me llamo ${name} y me gustaría recibir más información.`;
    
    if (interest) {
        message += `\n*Interés:* ${interest}`;
    }
    if (date) {
        message += `\n*Fecha Estimada:* ${date}`;
    }
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp API link
    const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(waLink, '_blank');
});
