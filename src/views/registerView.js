// src/views/registerView.js
import '../assets/styles/register.css';
import register from '../assets/images/Mobile login-amico 1.png';
export default class RegisterView {
    constructor() {
        this.app = document.getElementById('app');
    }
    
    render() {
        this.app.innerHTML = `
            <main class="d-flex flex-column flex-md-row align-items-center justify-content-center w-100">
                <section class="mb-5 mb-md-0 d-flex justify-content-center flex-shrink-0" style="max-width: 400px;">
                    <img src="${register}" alt="Illustration of a woman registering on a large smartphone screen with green leaves and gears around" class="img-fluid" />
                </section>
                <section class="w-100" style="max-width: 400px;">
                <h1 class="fw-bold fs-2 tracking-widest mb-1" style="letter-spacing: 0.15em;">Welcome!</h1>
                <p class="mb-4 text-secondary" style="font-size: 0.875rem;">Silahkan isi field untuk Daftar Akun</p>
                <div class="divider mb-4">
                    <span></span>
                    <hr />
                    <span></span>
                </div>
                <form id="registerForm">
                    <div class="mb-3">
                    <input type="text" id="name" class="form-control" placeholder="Nama Lengkap" />
                    </div>
                    <div class="mb-3">
                    <input type="email" id="email" class="form-control" placeholder="Email" />
                    </div>
                    <div class="mb-3">
                    <input type="tel" id="phone" class="form-control" placeholder="No Hp" />
                    </div>
                    <div class="mb-3">
                    <input type="text" id="username" class="form-control" placeholder="Username" />
                    </div>
                    <div class="mb-3">
                    <input type="password" id="password" class="form-control" placeholder="Password" />
                    </div>
                    <div class="mb-4">
                    <input type="password" id="rePassword" class="form-control" placeholder="Re-Password" />
                    </div>
                    <button type="submit" class="btn btn-lime w-100 mb-3">Daftar</button>
                </form>
                <p class="text-center text-secondary" style="font-size: 0.875rem;">
                    Sudah punya akun? <a href="#" id="login-link" class="lime-link">Login</a>
                </p>
                </section>
            </main>
        `;
        
        // Setup event listeners after rendering
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Add event listener for login link
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Use event to trigger page change via presenter
                const event = new CustomEvent('navigate', { detail: { page: 'login' } });
                document.dispatchEvent(event);
            });
        }
    }
    
    getRegisterFormData() {
        return {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            rePassword: document.getElementById('rePassword').value
        };
    }
    
    showAlert(message) {
        alert(message);
    }
    
    showRegisterSuccess() {
        this.removeMessages();
        
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-3';
        successMessage.textContent = 'Pendaftaran berhasil! Mengalihkan ke halaman login...';
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.insertAdjacentElement('afterend', successMessage);
        }
    }
    
    showRegisterError(message) {
        this.removeMessages();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-3';
        errorMessage.textContent = message || 'Pendaftaran gagal. Silakan coba lagi.';
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.insertAdjacentElement('afterend', errorMessage);
            
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