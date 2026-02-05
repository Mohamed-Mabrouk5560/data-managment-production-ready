// ============================================
// api.js - API Client
// ============================================

// IMPORTANT: Replace this with your deployed Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwaXi-_yPLBDyuIn3ap8b30rAiQpPR-4fre9XnuaivLd9vCcj7ZVNWjM1VWrotWsl2hjA/exec';


// Token management
function getToken() {
    return localStorage.getItem('authToken');
}

function setToken(token) {
    localStorage.setItem('authToken', token);
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function getUserRole() {
    return localStorage.getItem('userRole');
}

function setUserRole(role) {
    localStorage.setItem('userRole', role);
}

function getUserEmail() {
    return localStorage.getItem('userEmail');
}

function setUserEmail(email) {
    localStorage.setItem('userEmail', email);
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Logout
function logout() {
    removeToken();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Register user
async function register(email, password, role = 'user') {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                email: email,
                password: password,
                role: role
            })
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Login user
async function login(email, password) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            setToken(data.data.token);
            setUserRole(data.data.role);
            setUserEmail(data.data.email);
        }

        return data;

    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Submit data entry form
async function submitData(formData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'submitData',
                token: getToken(),
                data: formData
            })
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Submit data error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Search by National ID
async function searchByNationalId(nationalId) {
    try {
        const url = `${API_URL}?action=search&nationalId=${encodeURIComponent(nationalId)}&token=${getToken()}`;

        const response = await fetch(url, {
            method: 'GET'
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Search error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Get all records (admin only)
async function getAllRecords() {
    try {
        const url = `${API_URL}?action=getAllRecords&token=${getToken()}`;

        const response = await fetch(url, {
            method: 'GET'
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Get all records error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Update record (admin only)
async function updateRecord(nationalId, updates) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateRecord',
                token: getToken(),
                nationalId: nationalId,
                updates: updates
            })
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Update record error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Delete record (admin only)
async function deleteRecord(nationalId) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'deleteRecord',
                token: getToken(),
                nationalId: nationalId
            })
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Delete record error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Get pending users (admin only)
async function getPendingUsers() {
    try {
        const url = `${API_URL}?action=getPendingUsers&token=${getToken()}`;

        const response = await fetch(url, {
            method: 'GET'
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Get pending users error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Confirm user (admin only)
async function confirmUser(email) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'confirmUser',
                token: getToken(),
                email: email
            })
        });

        const data = await response.json();

        // Handle unauthorized
        if (!data.success && data.message.includes('Unauthorized')) {
            logout();
        }

        return data;

    } catch (error) {
        console.error('Confirm user error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Toast notification helper
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}
