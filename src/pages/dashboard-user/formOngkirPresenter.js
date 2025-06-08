// src/pages/dashboard-user/formOngkirPresenter.js
import FormOngkirView from './formOngkirView.js';
import { getPengajuanById } from '../../models/pengajuanModel.js';
import AlamatModel from '../../models/alamat-model.js';
export default class FormOngkirPresenter {
    constructor() {
        this.view = new FormOngkirView();

        
        this.applicationData = null;
        this.userData = null;
        this.masterAlamat = [];
        this.selectedAlamat = null;
        
        // Constants for calculation
        this.ONGKIR_PER_KM = 2000; // Rp 2.000 per km
        this.MINIMUM_ONGKIR = 5000; // Minimum Rp 5.000
        
        this.setupEventListeners();
        this.alamatModel = new AlamatModel();

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

        // Load master alamat (alamat-alamat admin)
        await this.loadMasterAlamat();

        // Render view (card kosong + form)
        this.view.render(this.applicationData);

        // Set alamat admin default di card mengantar
        this.setDefaultAlamatTujuan(); // ✅ Tambahkan baris ini

        // Populate view: user info, alamat, dll
        this.populateViewData();
    } catch (error) {
        console.error('Error initializing Form Ongkir:', error);
        this.view.showError('Gagal memuat data. Silakan coba lagi.');
    }
    }    
    async loadApplicationData(applicationId) {
    try {
        const data = await getPengajuanById(applicationId);

        this.applicationData = {
        id: data.id,
        namaLengkap: data.nama_lengkap,
        noHp: data.no_hp,
        kategoriSampah: data.jenis_sampah,
        beratSampah: parseFloat(data.berat),
        hargaSampah: parseFloat(data.harga_tawaran || 0),
        gambarSampah: data.gambar_sampah 
            ? `http://localhost:3000${data.gambar_sampah}` 
            : null,
        status: data.status,
        };
    } catch (error) {
        console.error('Gagal ambil data pengajuan:', error);
        throw error;
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
        this.masterAlamat = await this.alamatModel.getAlamatAdmin();
        console.log("Alamat Admin dari DB:", this.masterAlamat);
    } catch (error) {
        console.error("Error loading master alamat:", error);
        throw error;
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
    const defaultAlamat =
        this.masterAlamat.find(alamat => alamat.nama === 'Kantor Pusat') ||
        this.masterAlamat[0];

    console.log("Default Alamat Admin:", defaultAlamat); // ✅ debug log

    if (defaultAlamat) {
        const alamatTujuanElement = document.getElementById('alamat-tujuan');
        const lokasiLink = document.getElementById('lokasi-link');

        if (alamatTujuanElement) {
        alamatTujuanElement.textContent = defaultAlamat.alamat;
        }

        if (lokasiLink && defaultAlamat.latitude && defaultAlamat.longitude) {
        lokasiLink.href = `https://www.google.com/maps?q=${defaultAlamat.latitude},${defaultAlamat.longitude}`;
        lokasiLink.target = "_blank";
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
  this.selectedAlamat = null;

  if (method === 'dijemput') {
    const pilihAlamatSelect = document.getElementById('pilih-alamat');
    if (pilihAlamatSelect) pilihAlamatSelect.value = '';
    this.view.updateEstimasiJarak(null, null);
  } else if (method === 'mengantar') {
    this.setDefaultAlamatTujuan(); // ✅ PENTING
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