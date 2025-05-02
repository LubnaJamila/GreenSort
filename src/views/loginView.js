// src/views/loginView.js
import login from '../assets/images/Login-amico 1.png';
// import '../assets/styles/login.css';
export default class LoginView {
    constructor() {
        this.app = document.getElementById('app');
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
                    <p class="text-center-sm">
                    Tidak punya akun?
                    <a href="#" id="register-link" class="link-lime">Daftar</a>
                    </p>
                </form>
                </div>
            </div>
        `;
        
        // Add styles specific to login
        this.addLoginStyles();
        
        // Setup event listeners after rendering
        this.setupEventListeners();
    }
    
    addLoginStyles() {
        // Check if styles already exist
        if (!document.getElementById('login-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'login-styles';
            styleEl.textContent = `
                body {
                    font-family: 'Montserrat', sans-serif;
                    background-color: #fff;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .login-container {
                    max-width: 900px;
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                }
                .illustration {
                    flex: 1 1 50%;
                    max-width: 600px;
                    text-align: center;
                }
                .illustration img {
                    max-width: 100%;
                    height: auto;
                }
                .login-form {
                    flex: 1 1 50%;
                    max-width: 400px;
                    padding: 0 1rem;
                }
                h1 {
                    font-weight: 700;
                    font-size: 2rem;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.5rem;
                }
                p.subtitle {
                    font-weight: 400;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                    color: #4a4a4a;
                }
                hr {
                    border-color: #999;
                    margin-bottom: 2rem;
                }
                .form-control {
                    border-radius: 0.375rem;
                    font-size: 1rem;
                    padding: 0.75rem 1rem;
                    margin-bottom: 1rem;
                }
                .link-lime {
                    color: #b7e22f;
                    text-decoration: none;
                }
                .link-lime:hover {
                    text-decoration: underline;
                    color: #a0d01f;
                }
                .btn-lime {
                    background-color: #b7e22f;
                    border: none;
                    font-weight: 700;
                    padding: 0.75rem 0;
                    border-radius: 0.5rem;
                    width: 100%;
                    box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
                    transition: background-color 0.3s ease;
                    color: black;
                }
                .btn-lime:hover {
                    background-color: #a0d01f;
                    color: black;
                }
                .text-center-sm {
                    text-align: center;
                }
                @media (max-width: 767.98px) {
                    .login-container {
                        flex-direction: column;
                    }
                    .illustration,
                    .login-form {
                        max-width: 100%;
                        flex: 1 1 100%;
                    }
                    .text-center-sm {
                        text-align: center;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
    
    setupEventListeners() {
        // Add event listener for register link
        const registerLink = document.getElementById('register-link');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Use event to trigger page change via presenter
                const event = new CustomEvent('navigate', { detail: { page: 'register' } });
                document.dispatchEvent(event);
            });
        }
    }
    
    getLoginFormData() {
        return {
            emailOrUsername: document.getElementById('emailOrUsername').value,
            password: document.getElementById('password').value
        };
    }
    
    showAlert(message) {
        alert(message);
    }
    
    showLoginSuccess() {
        this.removeMessages();
        
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-3';
        successMessage.textContent = 'Login berhasil! Mengalihkan ke dashboard...';
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.insertAdjacentElement('afterend', successMessage);
        }
    }
    
    showLoginError(message) {
        this.removeMessages();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-3';
        errorMessage.textContent = message || 'Login gagal. Silakan coba lagi.';
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.insertAdjacentElement('afterend', errorMessage);
            
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        }
    }
    
    removeMessages() {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
    }
}