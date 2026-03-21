
// Cart state management
let cart = JSON.parse(localStorage.getItem('bemylove_cart')) || [];
let isDepositOnly = false; // New state for the 50% deposit option

// Save to localStorage
function saveCart() {
    localStorage.setItem('bemylove_cart', JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
}

// Add item to cart
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    }
    saveCart();
    openCart();
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
}

// Update quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
        }
    }
}

// Update the floating cart icon number
function updateCartIcon() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Open/Close Cart Sidebar
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

function toggleDeposit(value) {
    isDepositOnly = value;
    renderCartItems(); // Re-render to show updated totals
}

// Render items in the sidebar
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-price');
    const depositRow = document.getElementById('cart-deposit-row');
    const depositAmount = document.getElementById('cart-deposit-amount');
    
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; margin-top: 2rem; color: #666;">Tu carrito está vacío</p>';
        totalElement.innerText = '$0.00 MXN';
        depositRow.style.display = 'none';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h5>${item.name}</h5>
                <span>$${item.price.toLocaleString()} MXN</span>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
        `;
        container.appendChild(itemDiv);
    });

    totalElement.innerText = `$${total.toLocaleString()} MXN`;

    if (isDepositOnly) {
        depositRow.style.display = 'flex';
        depositAmount.innerText = `$${(total * 0.5).toLocaleString()} MXN`;
    } else {
        depositRow.style.display = 'none';
    }
}

// Finalize flows
function checkoutWhatsApp() {
    if (cart.length === 0) return;
    
    let message = "¡Hola BeMyLove! 👋 Quiero realizar un pedido:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} ($${item.price.toLocaleString()})\n`;
        total += item.price * item.quantity;
    });
    
    message += `\n*Subtotal: $${total.toLocaleString()} MXN*`;

    if (isDepositOnly) {
        message += `\n*MODO DE PAGO: Anticipo del 50% ($${(total * 0.5).toLocaleString()} MXN)*`;
        message += `\n(Liquidaré el resto al recibir/en la entrega)`;
    } else {
        message += `\n*MODO DE PAGO: Liquidación total*`;
    }
    
    message += `\n\n¿Me podrían confirmar disponibilidad y envío?`;
    
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5219996503963?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
}

function checkoutOnline() {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const amountToPay = isDepositOnly ? total * 0.5 : total;
    
    alert(`Redirigiendo a pasarela de pago segura por un monto de $${amountToPay.toLocaleString()} MXN (${isDepositOnly ? 'Anticipo 50%' : 'Total'})...`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    renderCartItems();
    
    // Attach event listeners to all "Pedir por WhatsApp" buttons to transform them or add cart buttons
    // Actually, I'll modify the HTML directly for better control.
});
