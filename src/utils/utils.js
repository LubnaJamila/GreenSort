/**
 * Format currency to IDR
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('id-ID', options);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('currentUser');
};

/**
 * Protect route - redirect to login if not authenticated
 */
export const protectRoute = () => {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
};

/**
 * Redirect authenticated users away from auth pages
 */
export const redirectIfAuthenticated = () => {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
};