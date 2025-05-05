// src/views/registerView.js
import '../assets/styles/register.css';
import register from '../assets/images/Mobile login-amico 1.png';

export default class RegisterView {
    constructor() {
        this.app = document.getElementById('app');
        this.eventListeners = [];
    }
    
    render() {
        this.app.innerHTML = `
            <main class="container">
                <div class="row justify-content-center align-items-center">
                    <div class="col-md-6 d-flex justify-content-center mb-4 mb-md-0">
                        <img 
                        src="${register}" 
                        alt="Illustration of a woman interacting with a large mobile phone screen showing a registration form, surrounded by green leaves and white gears" 
                        class="img-fluid" 
                        style="max-height: 500px;"
                        />
                    </div>
                    <div class="col-md-6" style="max-width: 400px;">
                        <h1 class="fw-bold fs-2 tracking-widest mb-1" style="letter-spacing: 0.15em;">Welcome!</h1>
                        <p class="mb-4 text-secondary" style="font-size: 0.875rem;">Silahkan isi field untuk Daftar Akun</p>
                        <div class="divider">
                            <div class="dot"></div>
                            <div class="line"></div>
                            <div class="dot"></div>
                        </div>
                        <form id="registerForm">
                            <div class="mb-3">
                                <input type="text" id="name" class="form-control rounded-3" placeholder="Nama Lengkap" />
                            </div>
                            <div class="mb-3">
                                <input type="email" id="email" class="form-control rounded-3" placeholder="Email" />
                            </div>
                            <div class="mb-3">
                                <input type="tel" id="phone" class="form-control rounded-3" placeholder="No Hp" />
                            </div>
                            <div class="mb-3">
                                <input type="text" id="username" class="form-control rounded-3" placeholder="Username" />
                            </div>
                            <div class="mb-3">
                                <input type="password" id="password" class="form-control rounded-3" placeholder="Password" />
                            </div>
                            <div class="mb-3">
                                <input type="password" id="rePassword" class="form-control rounded-3" placeholder="Re-Password" />
                            </div>
                            <button type="submit" class="btn btn-lime w-100 py-3 fw-bold">Daftar</button>
                            <div id="registerMessages"></div>
                        </form>
                        <p class="text-center mt-4 text-secondary" style="font-size: 0.875rem;">
                        Sudah punya akun? <a href="#" id="login-link" class="lime-link">Login</a>
                        </p>
                    </div>
                </div>
            </main>
        `;
        
        // Setup event listeners after rendering
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Membersihkan event listener lama
        this.removeEventListeners();
        
        // Add event listener for login link
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            const loginHandler = (e) => {
                e.preventDefault();
                console.log('Navigating to login page');
                // Use event to trigger page change via presenter
                const event = new CustomEvent('navigate', { detail: { page: 'login' } });
                document.dispatchEvent(event);
            };
            
            loginLink.addEventListener('click', loginHandler);
            // Simpan untuk pembersihan nanti
            this.eventListeners.push({ element: loginLink, type: 'click', handler: loginHandler });
        }
    }
    
    getRegisterFormData() {
        return {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            username: document.getElementById('username')?.value || '',
            password: document.getElementById('password')?.value || '',
            rePassword: document.getElementById('rePassword')?.value || ''
        };
    }
    
    showAlert(message) {
        alert(message);
    }
    
    showRegisterSuccess() {
        this.removeMessages();
        
        const messagesContainer = document.getElementById('registerMessages');
        if (messagesContainer) {
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.textContent = 'Pendaftaran berhasil! Mengalihkan ke halaman login...';
            messagesContainer.appendChild(successMessage);
        }
    }
    
    showRegisterError(message) {
        this.removeMessages();
        
        const messagesContainer = document.getElementById('registerMessages');
        if (messagesContainer) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-3';
            errorMessage.textContent = message || 'Pendaftaran gagal. Silakan coba lagi.';
            messagesContainer.appendChild(errorMessage);
        }
    }
    
    removeMessages() {
        const messagesContainer = document.getElementById('registerMessages');
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
        console.log('Destroying RegisterView');
        this.removeEventListeners();
    }
}