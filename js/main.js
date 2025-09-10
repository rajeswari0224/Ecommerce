// LOGIN FORM VALIDATION & SUBMIT
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const errorDiv = document.getElementById('login-error');
        errorDiv.classList.add('d-none');
        // Simple validation
        if (!email || !password) {
            errorDiv.textContent = 'Please enter both email and password.';
            errorDiv.classList.remove('d-none');
            return;
        }
        // Send to backend (Java REST API)
        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Handle successful login (e.g., close modal, show user, etc.)
                location.reload();
            } else {
                errorDiv.textContent = data.message || 'Invalid email or password.';
                errorDiv.classList.remove('d-none');
            }
        })
        .catch(() => {
            errorDiv.textContent = 'Server error. Please try again later.';
            errorDiv.classList.remove('d-none');
        });
    });
}

// REGISTER FORM VALIDATION & SUBMIT
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
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
        fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(res => res.json())
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
        .catch(() => {
            successDiv.textContent = 'Server error. Please try again later.';
            successDiv.classList.remove('d-none', 'alert-success');
            successDiv.classList.add('alert-danger');
        });
    });
}
