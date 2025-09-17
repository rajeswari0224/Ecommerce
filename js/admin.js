// Admin Panel JavaScript

// Check authentication
if (!localStorage.getItem('userId') || localStorage.getItem('userMode') !== 'admin') {
    window.location.href = 'index.html';
}

// Sample product data (simulating API response)
let products = [
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
const addProductForm = document.getElementById('add-product-form');
const editProductForm = document.getElementById('edit-product-form');

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

// Add product form handler
addProductForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value
    };
    
    addProduct(productData);
});

// Edit product form handler
editProductForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productData = {
        id: parseInt(document.getElementById('editProductId').value),
        name: document.getElementById('editProductName').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        description: document.getElementById('editProductDescription').value,
        image: document.getElementById('editProductImage').value
    };
    
    updateProduct(productData);
});

// Load products function
async function loadProducts() {
    showLoading(true);
    
    // Simulate API call
    setTimeout(async () => {
        // In real implementation, fetch from: /api/admin/products
        await fetch('http://localhost:8081/api/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            products = data.products || products;
            displayProducts(products);
        })
        .catch(() => {
            // Use sample data if API fails
            displayProducts(products);
        })
        .finally(() => {
            showLoading(false);
        });
    }, 500);
}

// Display products function
function displayProducts(productList) {
    productsContainer.innerHTML = '';
    
    productList.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Create product card with admin controls
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
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <div class="btn-group" role="group">
                        <button class="btn btn-outline-primary btn-sm" onclick="editProduct(${product.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct(${product.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Add product function
async function addProduct(productData) {
    showLoading(true);
    
    // In real implementation, send to: /api/admin/products
    await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(productData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert('Product added successfully!', 'success');
            addProductForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            loadProducts();
        } else {
            showAlert('Failed to add product.', 'danger');
        }
    })
    .catch(() => {
        // Demo: add to local array
        const newProduct = {
            ...productData,
            id: Math.max(...products.map(p => p.id)) + 1
        };
        products.push(newProduct);
        displayProducts(products);
        showAlert('Product added successfully!', 'success');
        addProductForm.reset();
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    })
    .finally(() => {
        showLoading(false);
    });
}

// Edit product function
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Populate edit form
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.image;
    
    // Show edit modal
    new bootstrap.Modal(document.getElementById('editProductModal')).show();
}

// Update product function
function updateProduct(productData) {
    showLoading(true);
    
    // In real implementation, send to: /api/admin/products/{id}
    fetch(`/api/admin/products/${productData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(productData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert('Product updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            loadProducts();
        } else {
            showAlert('Failed to update product.', 'danger');
        }
    })
    .catch(() => {
        // Demo: update local array
        const index = products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
            products[index] = productData;
            displayProducts(products);
            showAlert('Product updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        }
    })
    .finally(() => {
        showLoading(false);
    });
}

// Delete product function
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    showLoading(true);
    
    // In real implementation, send to: /api/admin/products/{id}
    fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showAlert('Product deleted successfully!', 'success');
            loadProducts();
        } else {
            showAlert('Failed to delete product.', 'danger');
        }
    })
    .catch(() => {
        // Demo: remove from local array
        products = products.filter(p => p.id !== productId);
        displayProducts(products);
        showAlert('Product deleted successfully!', 'success');
    })
    .finally(() => {
        showLoading(false);
    });
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