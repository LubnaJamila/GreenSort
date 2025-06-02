// src/pages/dashboard-user/formOngkirPresenter.js
import FormOngkirView from './formOngkirView.js';
// Import models yang diperlukan
// import ApplicationModel from '../../models/applicationModel.js';
// import AlamatModel from '../../models/alamatModel.js';
// import UserModel from '../../models/userModel.js';

export default class FormOngkirPresenter {
    constructor() {
        this.view = new FormOngkirView();
        // this.applicationModel = new ApplicationModel();
        // this.alamatModel = new AlamatModel();
        // this.userModel = new UserModel();
        
        this.applicationData = null;
        this.userData = null;
        this.masterAlamat = [];
        this.selectedAlamat = null;
        
        // Constants for calculation
        this.ONGKIR_PER_KM = 2000; // Rp 2.000 per km
        this.MINIMUM_ONGKIR = 5000; // Minimum Rp 5.000
        
        this.setupEventListeners();
    }
    
    async init(applicationId = null) {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Load application data if ID provided
            if (applicationId) {
                await this.loadApplicationData(applicationId);
            }
            
            // Load user data
            await this.loadUserData();
            
            // Load master alamat
            await this.loadMasterAlamat();
            
            // Render view with data
            this.view.render(this.applicationData);
            
            // Populate view with loaded data
            this.populateViewData();
            
        } catch (error) {
            console.error('Error initializing Form Ongkir:', error);
            this.view.showError('Gagal memuat data. Silakan coba lagi.');
        }
    }
    
    async loadApplicationData(applicationId) {
        try {
            // Mock data - replace with actual API call
            this.applicationData = {
                id: applicationId,
                namaLengkap: 'John Doe',
                noHp: '081234567890',
                kategoriSampah: 'Plastik',
                beratSampah: 5.5,
                hargaSampah: 15000,
                gambarSampah: '/assets/images/sampah-plastik.jpg',
                status: 'Diterima'
            };
            
            // Actual implementation:
            // this.applicationData = await this.applicationModel.getById(applicationId);
            
        } catch (error) {
            console.error('Error loading application data:', error);
            throw new Error('Gagal memuat data pengajuan');
        }
    }
    
    async loadUserData() {
        try {
            // Mock data - replace with actual API call
            this.userData = {
                id: 1,
                name: 'Current User',
                username: 'currentuser',
                avatar: null,
                alamatLengkap: 'Jl. User Address No. 456, Kecamatan DEF, Kabupaten GHI, Jawa Timur 54321'
            };
            
            // Actual implementation:
            // this.userData = await this.userModel.getCurrentUser();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            throw new Error('Gagal memuat data pengguna');
        }
    }
    
    async loadMasterAlamat() {
        try {
            // Mock data - replace with actual API call
            this.masterAlamat = [
                {
                    id: 1,
                    nama: 'Kantor Pusat',
                    alamat: 'Jl. Kantor Pusat No. 1, Kecamatan A',
                    latitude: -8.1601,
                    longitude: 113.7065,
                    jarak: 5.2
                },
                {
                    id: 2,
                    nama: 'Cabang Timur',
                    alamat: 'Jl. Timur Raya No. 25, Kecamatan B',
                    latitude: -8.1701,
                    longitude: 113.7165,
                    jarak: 8.7
                },
                {
                    id: 3,
                    nama: 'Cabang Selatan',
                    alamat: 'Jl. Selatan Indah No. 50, Kecamatan C',
                    latitude: -8.1801,
                    longitude: 113.6965,
                    jarak: 12.3
                }
            ];
            
            // Actual implementation:
            // this.masterAlamat = await this.alamatModel.getAllAlamat();
            
        } catch (error) {
            console.error('Error loading master alamat:', error);
            throw new Error('Gagal memuat data alamat');
        }
    }
    
    populateViewData() {
        // Populate application data to view
        if (this.applicationData) {
            this.view.populateApplicationData(this.applicationData);
        }
        
        // Populate user info
        if (this.userData) {
            this.view.displayUserInfo(this.userData);
            this.view.populateUserAddress(this.userData.alamatLengkap);
        }
        
        // Populate master alamat
        if (this.masterAlamat.length > 0) {
            this.view.populateMasterAlamat(this.masterAlamat);
        }
        
        // Set default alamat tujuan (for mengantar sendiri)
        this.setDefaultAlamatTujuan();
    }
    
    setDefaultAlamatTujuan() {
        // Set alamat tujuan default (biasanya kantor pusat)
        const defaultAlamat = this.masterAlamat.find(alamat => alamat.nama === 'Kantor Pusat') || this.masterAlamat[0];
        
        if (defaultAlamat) {
            const alamatTujuanElement = document.getElementById('alamat-tujuan');
            const lokasiLink = document.getElementById('lokasi-link');
            
            if (alamatTujuanElement) {
                alamatTujuanElement.textContent = defaultAlamat.alamat;
            }
            
            if (lokasiLink && defaultAlamat.latitude && defaultAlamat.longitude) {
                // Generate Google Maps link
                const mapsUrl = `https://www.google.com/maps?q=${defaultAlamat.latitude},${defaultAlamat.longitude}`;
                lokasiLink.href = mapsUrl;
                lokasiLink.target = '_blank';
            }
        }
    }
    
    setupEventListeners() {
        // Listen for delivery method change
        document.addEventListener('delivery-method-changed', (event) => {
            this.handleDeliveryMethodChange(event.detail.method);
        });
        
        // Listen for alamat change
        document.addEventListener('alamat-changed', (event) => {
            this.handleAlamatChange(event.detail.alamatId);
        });
        
        // Listen for form submit
        document.addEventListener('form-submit', (event) => {
            this.handleFormSubmit(event.detail);
        });
    }
    
    handleDeliveryMethodChange(method) {
        console.log('Delivery method changed:', method);
        
        // Reset selection when switching methods
        this.selectedAlamat = null;
        
        if (method === 'dijemput') {
            // Reset alamat dropdown and ongkir calculation
            const pilihAlamatSelect = document.getElementById('pilih-alamat');
            if (pilihAlamatSelect) {
                pilihAlamatSelect.value = '';
            }
            this.view.updateEstimasiJarak(null, null);
        }
    }
    
    handleAlamatChange(alamatId) {
        if (!alamatId) {
            this.selectedAlamat = null;
            this.view.updateEstimasiJarak(null, null);
            return;
        }
        
        // Find selected alamat
        this.selectedAlamat = this.masterAlamat.find(alamat => alamat.id == alamatId);
        
        if (this.selectedAlamat) {
            // Calculate ongkir based on distance
            const jarak = this.selectedAlamat.jarak;
            const ongkir = this.calculateOngkir(jarak);
            
            // Update view with calculated values
            this.view.updateEstimasiJarak(jarak, ongkir);
            
            console.log('Selected alamat:', this.selectedAlamat);
            console.log('Calculated ongkir:', ongkir);
        }
    }
    
    calculateOngkir(jarak) {
        if (!jarak || jarak <= 0) return 0;
        
        // Calculate ongkir: jarak * tarif per km
        let ongkir = jarak * this.ONGKIR_PER_KM;
        
        // Apply minimum ongkir
        if (ongkir < this.MINIMUM_ONGKIR) {
            ongkir = this.MINIMUM_ONGKIR;
        }
        
        // Round to nearest thousand
        ongkir = Math.ceil(ongkir / 1000) * 1000;
        
        return ongkir;
    }
    
    async handleFormSubmit(formData) {
        try {
            // Validate form data
            const validation = this.validateFormData(formData);
            if (!validation.isValid) {
                this.view.showError(validation.message);
                return;
            }
            
            // Show loading state
            this.view.showLoading(true);
            
            // Prepare submission data
            const submissionData = this.prepareSubmissionData(formData);
            
            // Submit form
            await this.submitForm(submissionData);
            
            // Show success message
            this.view.showSuccess('Form berhasil disimpan! Anda akan diarahkan kembali ke halaman sebelumnya.');
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.view.showError('Gagal menyimpan data. Silakan coba lagi.');
        } finally {
            this.view.showLoading(false);
        }
    }
    
    validateFormData(formData) {
        // Basic validation
        if (!formData.applicationId) {
            return { isValid: false, message: 'Data pengajuan tidak ditemukan.' };
        }
        
        if (!formData.deliveryMethod) {
            return { isValid: false, message: 'Pilih metode pengiriman.' };
        }
        
        if (formData.deliveryMethod === 'dijemput') {
            if (!formData.alamatId) {
                return { isValid: false, message: 'Pilih alamat penjemputan.' };
            }
            
            if (!this.selectedAlamat) {
                return { isValid: false, message: 'Alamat penjemputan tidak valid.' };
            }
        }
        
        return { isValid: true, message: 'Valid' };
    }
    
    prepareSubmissionData(formData) {
        const submissionData = {
            applicationId: formData.applicationId,
            deliveryMethod: formData.deliveryMethod,
            userId: this.userData?.id,
            timestamp: new Date().toISOString()
        };
        
        if (formData.deliveryMethod === 'dijemput') {
            submissionData.alamatId = formData.alamatId;
            submissionData.alamatDetail = this.selectedAlamat;
            submissionData.estimasiJarak = this.selectedAlamat.jarak;
            submissionData.ongkir = this.calculateOngkir(this.selectedAlamat.jarak);
        } else {
            // For mengantar sendiri, use default alamat tujuan
            const defaultAlamat = this.masterAlamat.find(alamat => alamat.nama === 'Kantor Pusat') || this.masterAlamat[0];
            submissionData.alamatTujuan = defaultAlamat;
            submissionData.ongkir = 0; // No ongkir for self-delivery
        }
        
        return submissionData;
    }
    
    async submitForm(submissionData) {
        try {
            // Mock API call - replace with actual implementation
            console.log('Submitting form data:', submissionData);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock success response
            const response = {
                success: true,
                message: 'Data berhasil disimpan',
                data: submissionData
            };
            
            // Actual implementation:
            // const response = await this.applicationModel.updateOngkir(submissionData);
            
            if (!response.success) {
                throw new Error(response.message || 'Gagal menyimpan data');
            }
            
            return response;
            
        } catch (error) {
            console.error('Error in submitForm:', error);
            throw error;
        }
    }
    
    showLoadingState() {
        // Could show a loading spinner or skeleton UI
        console.log('Loading form data...');
    }
    
    // Method to handle external navigation to this form
    static async navigateToForm(applicationId) {
        try {
            const presenter = new FormOngkirPresenter();
            await presenter.init(applicationId);
            return presenter;
        } catch (error) {
            console.error('Error navigating to form:', error);
            // Could redirect to error page or show error message
            throw error;
        }
    }
    
    // Utility method to format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    }
    
    // Utility method to format distance
    formatDistance(distance) {
        if (distance < 1) {
            return `${(distance * 1000).toFixed(0)} m`;
        }
        return `${distance.toFixed(1)} km`;
    }
    
    // Method to update ongkir calculation if tarif changes
    updateOngkirTarif(newTarifPerKm, newMinimumOngkir = null) {
        this.ONGKIR_PER_KM = newTarifPerKm;
        if (newMinimumOngkir !== null) {
            this.MINIMUM_ONGKIR = newMinimumOngkir;
        }
        
        // Recalculate if alamat is selected
        if (this.selectedAlamat) {
            const jarak = this.selectedAlamat.jarak;
            const ongkir = this.calculateOngkir(jarak);
            this.view.updateEstimasiJarak(jarak, ongkir);
        }
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners
        document.removeEventListener('delivery-method-changed', this.handleDeliveryMethodChange);
        document.removeEventListener('alamat-changed', this.handleAlamatChange);
        document.removeEventListener('form-submit', this.handleFormSubmit);
        
        // Destroy view
        if (this.view) {
            this.view.destroy();
        }
        
        // Clear data
        this.applicationData = null;
        this.userData = null;
        this.masterAlamat = [];
        this.selectedAlamat = null;
    }
}