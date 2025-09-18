// Customer Panel JavaScript

// Check authentication
if (!localStorage.getItem('userId') || localStorage.getItem('userMode') !== 'customer') {
    window.location.href = 'index.html';
}

// Sample product data (simulating API response)
const sampleProducts = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 149.99,
        description: 'High-fidelity sound and noise cancellation.',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Smartwatch Pro',
        price: 299.99,
        description: 'Track your fitness and stay connected on the go.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Ultra-Slim Laptop',
        price: 1299.00,
        description: 'Powerful performance in a sleek, portable design.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 4,
        name: '4K Camera Drone',
        price: 499.50,
        description: 'Capture stunning aerial footage with ease.',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=400&auto=format&fit=crop'
    }
];

// DOM elements
const productsContainer = document.getElementById('products-container');
const loadingSpinner = document.getElementById('loading-spinner');
const alertContainer = document.getElementById('alert-container');
const logoutBtn = document.getElementById('logout-btn');

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// Logout functionality
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
});

// Load products function
function loadProducts() {
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // In real implementation, fetch from: /api/products
        fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            displayProducts(data.products || sampleProducts);
        })
        .catch(() => {
            // Use sample data if API fails
            displayProducts(sampleProducts);
        })
        .finally(() => {
            showLoading(false);
        });
    }, 500);
}

// Display products function
function displayProducts(products) {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col';
    
    col.innerHTML = `
        <div class="card product-card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text text-muted flex-grow-1">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="product-price">₹${product.price.toFixed(2)}</span>
                    <button class="btn btn-custom btn-sm" onclick="addToCart(${product.id}, '${product.name}', 'PRD${product.id}', '${product.description}', ${product.price}, '${product.image}')">
                        <i class="bi bi-cart-plus me-1"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Add to cart function - integrated with CartManager
function addToCart(id, name, code, description, price, image) {
    if (window.cartManager) {
        window.cartManager.addToCart(id, name, code, description, price, image);
    } else {
        showAlert('Cart system not loaded', 'danger');
    }
}

// Show loading spinner
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('d-none');
    } else {
        loadingSpinner.classList.add('d-none');
    }
}

// Show alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}