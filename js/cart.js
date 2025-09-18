// Cart Management System
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartBadge();
        this.bindEvents();
        
        // Load cart when modal is shown
        document.getElementById('cartModal').addEventListener('show.bs.modal', () => {
            this.loadCart();
        });
    }

    bindEvents() {
        // Clear cart button
        document.getElementById('clear-cart-btn').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.checkout();
        });
    }

    // Add item to cart
    addToCart(id, name, code, description, price, image) {
        const existingItem = this.cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id,
                name,
                code,
                description,
                price,
                image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartBadge();
        this.showAlert('Product added to cart!', 'success');
        
        // Simulate API call
        this.syncWithBackend('add', { id, quantity: 1 });
    }

    // Remove item from cart
    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartBadge();
        this.loadCart();
        this.showAlert('Item removed from cart', 'info');
        
        // Simulate API call
        this.syncWithBackend('remove', { id });
    }

    // Update quantity
    updateQuantity(id, quantity) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(id);
                return;
            }
            item.quantity = quantity;
            this.saveCart();
            this.updateCartBadge();
            this.loadCart();
            
            // Simulate API call
            this.syncWithBackend('update', { id, quantity });
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartBadge();
            this.loadCart();
            this.showAlert('Cart cleared successfully', 'info');
            
            // Simulate API call
            this.syncWithBackend('clear');
        }
    }

    // Load and display cart
    loadCart() {
        // Fetch cart from backend
        fetch('http://localhost:8081/api/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken') || 'demo-token'}`
            }
        })
        .then(res => res.json())
        .then(data => {
            // Use backend data if available, otherwise use local cart
            const cartData = data.success ? data.cart : this.cart;
            this.displayCart(cartData);
        })
        .catch(() => {
            // Fallback to local cart
            this.displayCart(this.cart);
        });
    }

    // Display cart items
    displayCart(cartData) {
        const cartTableBody = document.getElementById('cart-table-body');
        const cartEmpty = document.getElementById('cart-empty');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');

        if (cartData.length === 0) {
            cartEmpty.style.display = 'block';
            cartItemsContainer.style.display = 'none';
            cartFooter.style.display = 'none';
            return;
        }

        cartEmpty.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartFooter.style.display = 'block';

        cartTableBody.innerHTML = '';
        let total = 0;

        cartData.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">${item.description}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-secondary">${item.code}</span></td>
                <td>
                    <div class="input-group" style="width: 120px;">
                        <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" min="1" onchange="cartManager.updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="btn btn-outline-secondary btn-sm" type="button" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>₹${item.price.toLocaleString()}</td>
                <td class="fw-bold">₹${subtotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="cartManager.removeFromCart(${item.id})" title="Remove item">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });

        document.getElementById('cart-total').textContent = `₹${total.toLocaleString()}`;
    }

    // Update cart badge
    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex';
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
            setTimeout(() => {
                if (!badge.classList.contains('show')) {
                    badge.style.display = 'none';
                }
            }, 300);
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Simulate backend sync
    syncWithBackend(action, data = {}) {
        const endpoints = {
            add: 'http://localhost:8081/api/cart/add',
            update: 'http://localhost:8081/api/cart/update',
            remove: 'http://localhost:8081/api/cart/remove',
            clear: 'http://localhost:8081/api/cart/clear'
        };

        fetch(endpoints[action], {
            method: action === 'clear' ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken') || 'demo-token'}`
            },
            body: action !== 'clear' ? JSON.stringify(data) : undefined
        })
        .then(res => res.json())
        .then(data => {
            console.log(`Cart ${action} synced:`, data);
        })
        .catch(err => {
            console.log(`Cart ${action} sync failed (using local storage):`, err);
        });
    }

    // Checkout process
    checkout() {
        if (this.cart.length === 0) {
            this.showAlert('Your cart is empty!', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Checkout API call
        fetch('http://localhost:8081/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userToken') || 'demo-token'}`
            },
            body: JSON.stringify({
                items: this.cart,
                total: total
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                this.showAlert('Order placed successfully! Redirecting to payment...', 'success');
                // Clear cart after successful checkout
                setTimeout(() => {
                    this.cart = [];
                    this.saveCart();
                    this.updateCartBadge();
                    bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
                }, 2000);
            } else {
                this.showAlert('Checkout failed. Please try again.', 'danger');
            }
        })
        .catch(() => {
            // Demo checkout success
            this.showAlert(`Order placed successfully! Total: ₹${total.toLocaleString()}`, 'success');
            setTimeout(() => {
                this.cart = [];
                this.saveCart();
                this.updateCartBadge();
                bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
            }, 2000);
        });
    }

    // Show alert messages
    showAlert(message, type) {
        const alertContainer = document.getElementById('main-cart-alerts') || document.getElementById('cart-alerts');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = message;
        
        alertContainer.appendChild(alert);
        
        // Show animation
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);
        
        // Auto remove after 0.6 seconds
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }, 600);
    }
}

// Initialize cart manager
const cartManager = new CartManager();
window.cartManager = cartManager; // Make globally accessible

// Global function for add to cart buttons
function addToCart(id, name, code, description, price, image) {
    cartManager.addToCart(id, name, code, description, price, image);
}