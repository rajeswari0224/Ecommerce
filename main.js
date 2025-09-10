document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const loginForm = document.getElementById('login-form');
    const loginNav = document.getElementById('login-nav-item');
    const userNav = document.getElementById('user-nav-item');
    const logoutButton = document.getElementById('logout-button');
    const loginError = document.getElementById('login-error');
    const loginModalEl = document.getElementById('loginModal');
    // Ensure bootstrap is loaded before this script runs
    const loginModal = new bootstrap.Modal(loginModalEl);

    // --- Hardcoded credentials for demonstration ---
    const FAKE_USER = 'user@example.com';
    const FAKE_PASS = 'password123';

    // --- Functions to update UI ---
    function showLoggedInState() {
        loginNav.classList.add('d-none');
        userNav.classList.remove('d-none');
    }

    function showLoggedOutState() {
        userNav.classList.add('d-none');
        loginNav.classList.remove('d-none');
        // Clear the session storage on logout
        sessionStorage.removeItem('loggedInUser');
    }

    // --- Event Listeners ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            loginError.classList.add('d-none'); // Hide previous error

            // Simple validation against hardcoded values
            if (email === FAKE_USER && password === FAKE_PASS) {
                loginModal.hide(); // Close the modal on success
                sessionStorage.setItem('loggedInUser', email); // Store login state
                showLoggedInState(); // Update the navbar
                loginForm.reset(); // Reset form for next time
            } else {
                loginError.classList.remove('d-none'); // Show login error
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            showLoggedOutState();
        });
    }

    // --- Initial State Check on Page Load ---
    // Check if user was already logged in from a previous session
    if (sessionStorage.getItem('loggedInUser')) {
        showLoggedInState();
    }
});