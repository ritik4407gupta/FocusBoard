// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    initTheme(); // Initialize theme on auth pages
});

function initAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'login.html') {
        setupLoginForm();
    }
    
    // Setup logout functionality on all pages
    setupLogout();
    
    // Setup theme toggle
    setupThemeToggle();
    updateThemeToggleIcon(); // Initialize icon on load
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('focusboard_theme', '');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('focusboard_theme', 'dark-theme');
    }
    
    updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
        themeToggle.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('focusboard_theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
    updateThemeToggleIcon();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const signupLink = document.getElementById('signupLink');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupLink) {
        signupLink.addEventListener('click', handleSignupToggle);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // For demo purposes, accept any valid email/password combination
    // In a real app, this would validate against a backend
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Create user object
    const user = {
        id: Date.now(),
        email: email,
        name: extractNameFromEmail(email),
        loginTime: new Date().toISOString(),
        remember: remember
    };
    
    // Store user data
    localStorage.setItem('focusboard_user', JSON.stringify(user));
    
    if (remember) {
        localStorage.setItem('focusboard_remember', 'true');
    }
    
    // Show success message and redirect
    showAuthMessage('Login successful! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function handleSignupToggle(e) {
    e.preventDefault();
    
    const authCard = document.querySelector('.auth-card');
    const isSignup = authCard.dataset.mode === 'signup';
    
    if (isSignup) {
        // Switch to login mode
        switchToLogin();
    } else {
        // Switch to signup mode
        switchToSignup();
    }
}

function switchToSignup() {
    const authCard = document.querySelector('.auth-card');
    authCard.dataset.mode = 'signup';
    
    // Update header
    document.querySelector('.auth-card header h2').textContent = 'Create Account';
    document.querySelector('.auth-card header p').textContent = 'Sign up for a new account';
    
    // Add name field
    const emailGroup = document.getElementById('email').parentElement;
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    nameGroup.innerHTML = `
        <label for="name">Full Name</label>
        <input type="text" id="name" name="name" required>
    `;
    emailGroup.parentElement.insertBefore(nameGroup, emailGroup);
    
    // Add confirm password field
    const passwordGroup = document.getElementById('password').parentElement;
    const confirmPasswordGroup = document.createElement('div');
    confirmPasswordGroup.className = 'form-group';
    confirmPasswordGroup.innerHTML = `
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required>
    `;
    passwordGroup.parentElement.insertBefore(confirmPasswordGroup, passwordGroup.nextSibling);
    
    // Update button text
    document.querySelector('.btn-primary').textContent = 'Sign Up';
    
    // Update footer link
    document.querySelector('.auth-footer p').innerHTML = 'Already have an account? <a href="#" id="signupLink">Sign in</a>';
    
    // Remove form options (remember me, forgot password)
    const formOptions = document.querySelector('.form-options');
    if (formOptions) {
        formOptions.style.display = 'none';
    }
    
    // Update form handler
    document.getElementById('loginForm').removeEventListener('submit', handleLogin);
    document.getElementById('loginForm').addEventListener('submit', handleSignup);
    
    // Re-attach signup link event
    document.getElementById('signupLink').addEventListener('click', handleSignupToggle);
}

function switchToLogin() {
    const authCard = document.querySelector('.auth-card');
    authCard.dataset.mode = 'login';
    
    // Update header
    document.querySelector('.auth-card header h2').textContent = 'Welcome Back';
    document.querySelector('.auth-card header p').textContent = 'Sign in to your account';
    
    // Remove name field
    const nameGroup = document.getElementById('name')?.parentElement;
    if (nameGroup) {
        nameGroup.remove();
    }
    
    // Remove confirm password field
    const confirmPasswordGroup = document.getElementById('confirmPassword')?.parentElement;
    if (confirmPasswordGroup) {
        confirmPasswordGroup.remove();
    }
    
    // Update button text
    document.querySelector('.btn-primary').textContent = 'Sign In';
    
    // Update footer link
    document.querySelector('.auth-footer p').innerHTML = 'Don\'t have an account? <a href="#" id="signupLink">Sign up</a>';
    
    // Show form options
    const formOptions = document.querySelector('.form-options');
    if (formOptions) {
        formOptions.style.display = 'flex';
    }
    
    // Update form handler
    document.getElementById('loginForm').removeEventListener('submit', handleSignup);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Re-attach signup link event
    document.getElementById('signupLink').addEventListener('click', handleSignupToggle);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', 'error');
        return;
    }
    
    // Check if user already exists (in a real app, this would be done on the backend)
    const existingUsers = JSON.parse(localStorage.getItem('focusboard_users') || '[]');
    if (existingUsers.find(user => user.email === email)) {
        showAuthMessage('An account with this email already exists', 'error');
        return;
    }
    
    // Create user
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
    };
    
    // Store user in users list
    existingUsers.push(user);
    localStorage.setItem('focusboard_users', JSON.stringify(existingUsers));
    
    // Log user in
    const loginUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('focusboard_user', JSON.stringify(loginUser));
    
    showAuthMessage('Account created successfully! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear user data but keep remember preference if set
        const remember = localStorage.getItem('focusboard_remember');
        localStorage.removeItem('focusboard_user');
        
        if (!remember) {
            // If not remembered, clear all user data
            localStorage.removeItem('focusboard_todos');
            localStorage.removeItem('focusboard_events');
            localStorage.removeItem('focusboard_notes');
        }
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

function showAuthMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type === 'error' ? 'error-message' : 'success-message'}`;
    messageDiv.textContent = message;
    
    // Insert message at the top of the form
    const form = document.getElementById('loginForm');
    form.parentElement.insertBefore(messageDiv, form);
    
    // Auto-remove success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function extractNameFromEmail(email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, ' ');
}

// Check authentication status
function isAuthenticated() {
    return localStorage.getItem('focusboard_user') !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('focusboard_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Auto-login check on page load
function checkAutoLogin() {
    const remember = localStorage.getItem('focusboard_remember');
    const user = getCurrentUser();
    
    if (remember && user) {
        // User should remain logged in
        return true;
    } else if (!remember && user) {
        // Check if login is still valid (within 24 hours)
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            // Login expired
            localStorage.removeItem('focusboard_user');
            return false;
        }
    }
    
    return !!user;
}

// Export functions for use in other modules
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.checkAutoLogin = checkAutoLogin;