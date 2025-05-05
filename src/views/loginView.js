// src/views/loginView.js
import '../assets/styles/login.css';
import login from '../assets/images/Login-amico 1.png';

export default class LoginView {
    constructor() {
        this.app = document.getElementById('app');
        this.eventListeners = [];
    }
    
    render() {
        this.app.innerHTML = `
            <div class="login-container">
                <div class="illustration">
                <img
                    src="${login}"
                    alt="Illustration of a man holding a large green key standing in front of a computer screen showing a user login form with green accents"
                    width="600"
                    height="400"
                />
                </div>
                <div class="login-form">
                <h1>Welcome!</h1>
                <p class="subtitle">Silahkan isi field untuk Login</p>
                <hr />
                <form id="loginForm">
                    <input
                    id="emailOrUsername"
                    type="text"
                    class="form-control"
                    placeholder="Email atau Username"
                    required
                    />
                    <input
                    id="password"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                    required
                    />
                    <p class="text-center-sm mb-3">
                    Lupa Password?
                    <a href="#" class="link-lime">Klik Disini</a>
                    </p>
                    <button type="submit" class="btn btn-lime mb-3">Login</button>
                    <div id="loginMessages"></div>
                    <p class="text-center-sm">
                    Tidak punya akun?
                    <a href="#" id="register-link" class="link-lime">Daftar</a>
                    </p>
                </form>
                </div>
            </div>
        `;
        
        // Setup event listeners after rendering
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Membersihkan event listener lama
        this.removeEventListeners();
        
        // Add event listener for register link
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            const registerHandler = (e) => {
                e.preventDefault();
                console.log('Navigating to register page');
                // Use event to trigger page change via presenter
                const event = new CustomEvent('navigate', { detail: { page: 'register' } });
                document.dispatchEvent(event);
            };
            
            registerLink.addEventListener('click', registerHandler);
            // Simpan untuk pembersihan nanti
            this.eventListeners.push({ element: registerLink, type: 'click', handler: registerHandler });
        }
    }
    
    getLoginFormData() {
        return {
            emailOrUsername: document.getElementById('emailOrUsername')?.value || '',
            password: document.getElementById('password')?.value || ''
        };
    }
    
    showAlert(message) {
        alert(message);
    }
    
    showLoginSuccess() {
        this.removeMessages();
        
        const messagesContainer = document.getElementById('loginMessages');
        if (messagesContainer) {
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.textContent = 'Login berhasil! Mengalihkan ke dashboard...';
            messagesContainer.appendChild(successMessage);
        }
    }
    
    showLoginError(message) {
        this.removeMessages();
        
        const messagesContainer = document.getElementById('loginMessages');
        if (messagesContainer) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-3';
            errorMessage.textContent = message || 'Login gagal. Silakan coba lagi.';
            messagesContainer.appendChild(errorMessage);
        }
    }
    
    removeMessages() {
        const messagesContainer = document.getElementById('loginMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    }
    
    // Membersihkan event listener saat view dihancurkan
    removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            if (element) {
                element.removeEventListener(type, handler);
            }
        });
        this.eventListeners = [];
    }
    
    // Method untuk digunakan oleh presenter saat destroy
    destroy() {
        console.log('Destroying LoginView');
        this.removeEventListeners();
    }
}