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
    setupTabs();
});

// Tab functionality
function setupTabs() {
    const usersTabBtn = document.getElementById('users-tab-btn');
    const productsTabBtn = document.getElementById('products-tab-btn');
    const usersSection = document.getElementById('users-section');
    const productsSection = document.getElementById('products-section');
    
    usersTabBtn.addEventListener('click', () => {
        usersTabBtn.classList.remove('btn-outline-primary');
        usersTabBtn.classList.add('btn-custom');
        productsTabBtn.classList.remove('btn-custom');
        productsTabBtn.classList.add('btn-outline-primary');
        usersSection.style.display = 'block';
        productsSection.style.display = 'none';
        loadUsers();
    });
    
    productsTabBtn.addEventListener('click', () => {
        productsTabBtn.classList.remove('btn-outline-primary');
        productsTabBtn.classList.add('btn-custom');
        usersTabBtn.classList.remove('btn-custom');
        usersTabBtn.classList.add('btn-outline-primary');
        productsSection.style.display = 'block';
        usersSection.style.display = 'none';
    });
}

// Load users function
async function loadUsers() {
    showLoading(true);
    
    try {
        const response = await fetch('http://localhost:8081/api/admin/users');
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            console.error('Failed to load users:', response.status);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    } finally {
        showLoading(false);
    }
}

// Display users function
function displayUsers(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name || user.username}</td>
            <td>${user.email}</td>
            <td>
                <span class="password-hidden" id="pwd-${user.id}">••••••••</span>
                <span class="password-visible d-none" id="pwd-show-${user.id}">${user.password}</span>
                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="togglePassword(${user.id})">
                    <i class="bi bi-eye" id="eye-${user.id}"></i>
                </button>
            </td>
            <td><span class="badge ${user.isAdmin ? 'bg-danger' : 'bg-primary'}">${user.isAdmin ? 'Admin' : 'Customer'}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Toggle password visibility
function togglePassword(userId) {
    const hiddenSpan = document.getElementById(`pwd-${userId}`);
    const visibleSpan = document.getElementById(`pwd-show-${userId}`);
    const eyeIcon = document.getElementById(`eye-${userId}`);
    
    if (hiddenSpan.classList.contains('d-none')) {
        hiddenSpan.classList.remove('d-none');
        visibleSpan.classList.add('d-none');
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    } else {
        hiddenSpan.classList.add('d-none');
        visibleSpan.classList.remove('d-none');
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
    }
}

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
        name: document.getElementById('productName').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        categoryId: parseInt(document.getElementById('productCategory').value),
        stockQuantity: parseInt(document.getElementById('productStock').value) || 100
    };
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.categoryId) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }
    
    addProduct(productData);
});

// Edit product form handler
editProductForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const productData = {
        id: parseInt(document.getElementById('editProductId').value),
        name: document.getElementById('editProductName').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        categoryId: parseInt(document.getElementById('editProductCategory').value),
        stockQuantity: parseInt(document.getElementById('editProductStock').value) || 100
    };
    
    updateProduct(productData);
});

// Load products function
async function loadProducts() {
    showLoading(true);
    
    try {
        const response = await fetch('http://localhost:8081/api/products');
        if (response.ok) {
            const data = await response.json();
            console.log('Loaded products:', data);
            products = Array.isArray(data) ? data : (data.products || products);
            displayProducts(products);
        } else {
            console.error('Failed to load products:', response.status);
            displayProducts(products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displayProducts(products);
    } finally {
        showLoading(false);
    }
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
    
    try {
        const response = await fetch('http://localhost:8081/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            showAlert('Product added successfully!', 'success');
            addProductForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            loadProducts();
        } else {
            showAlert('Failed to add product to backend', 'danger');
        }
    } catch (error) {
        showAlert('Server connection failed', 'danger');
    } finally {
        showLoading(false);
    }
}

// Edit product function
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Populate edit form
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.categoryId || 1;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stockQuantity || 100;
    document.getElementById('editProductImage').value = product.image || 'https://via.placeholder.com/400';
    
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