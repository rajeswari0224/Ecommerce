// LOGIN FORM VALIDATION & SUBMIT
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const userMode = document.querySelector('input[name="userMode"]:checked').value;
        const errorDiv = document.getElementById('login-error');
        errorDiv.classList.add('d-none');
        
        // Simple validation
        if (!email || !password) {
            errorDiv.textContent = 'Please enter both email and password.';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        // Send to backend API
        fetch('http://localhost:8081/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                // Store user info and redirect based on role from backend
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userMode', data.isAdmin ? 'admin' : 'customer');
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('username', data.username);
                localStorage.setItem('userToken', 'logged-in-' + data.userId); // Add token for auth check
                
                if (data.isAdmin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'customer.html';
                }
            } else {
                errorDiv.textContent = data.message || 'Invalid email or password.';
                errorDiv.classList.remove('d-none');
            }
        })
        .catch((error) => {
            console.error('Login error:', error);
            if (error.message.includes('Failed to fetch')) {
                errorDiv.textContent = 'Cannot connect to server. Please check if the backend is running on port 8081.';
            } else if (error.message.includes('HTTP 401')) {
                errorDiv.textContent = 'Invalid email or password. Please try again.';
            } else if (error.message.includes('HTTP 500')) {
                errorDiv.textContent = 'Server error. Please try again later.';
            } else {
                errorDiv.textContent = 'Login failed: ' + error.message;
            }
            errorDiv.classList.remove('d-none');
        });
    });
}

// REGISTER FORM VALIDATION & SUBMIT
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit',async function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const successDiv = document.getElementById('register-success');
        successDiv.classList.add('d-none');
        // Simple validation
        if (!name || !email || !password) {
            successDiv.textContent = 'Please fill all fields.';
            successDiv.classList.remove('d-none');
            successDiv.classList.remove('alert-success');
            successDiv.classList.add('alert-danger');
            return;
        }
        // Send to backend (Java REST API)
        await fetch('http://localhost:8081/api/users/register/customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                successDiv.textContent = 'Registration successful! You can now log in.';
                successDiv.classList.remove('d-none', 'alert-danger');
                successDiv.classList.add('alert-success');
                registerForm.reset();
            } else {
                successDiv.textContent = data.message || 'Registration failed.';
                successDiv.classList.remove('d-none', 'alert-success');
                successDiv.classList.add('alert-danger');
            }
        })
        .catch((error) => {
            console.error('Registration error:', error);
            if (error.message.includes('Failed to fetch')) {
                successDiv.textContent = 'Cannot connect to server. Please check if the backend is running on port 8081.';
            } else if (error.message.includes('HTTP 400')) {
                successDiv.textContent = 'Invalid registration data. Please check your inputs.';
            } else if (error.message.includes('HTTP 409')) {
                successDiv.textContent = 'Email already exists. Please use a different email.';
            } else {
                successDiv.textContent = 'Registration failed: ' + error.message;
            }
            successDiv.classList.remove('d-none', 'alert-success');
            successDiv.classList.add('alert-danger');
        });
    });
}

// SEARCH FUNCTIONALITY
const searchBar = document.getElementById('search-bar');
if (searchBar) {
    searchBar.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const description = item.querySelector('.card-text').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = searchTerm === '' ? 'block' : 'none';
            }
        });
    });
}
