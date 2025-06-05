import FormPenawaranView from './formPenawaranView.js';
import AlamatModel from "../../models/alamat-model.js";
import { getCurrentUser } from "../../models/authModel.js";
import PengajuanModel from '../../models/pengajuan-model.js';

export default class FormPenawaranPresenter {
    constructor() {
        this.view = new FormPenawaranView();
        this.model = new AlamatModel();
        this.user = null;
        this.currentApplicationId = null;
        this.setupEventListeners();
        this.pengajuanModel = new PengajuanModel();
    }

    async init(applicationId = null) {
        try {
            this.user = getCurrentUser();

            if (!applicationId) {
                applicationId = this.getApplicationIdFromUrl();
            }

            this.view.render(applicationId);

            if (this.user) {
                this.view.displayUserInfo(this.user);
            }

            await this.loadAddressOptions();

            if (applicationId) {
                this.currentApplicationId = applicationId;
                await this.loadApplicationData(applicationId);
            } else {
                this.view.showError('ID pengajuan tidak ditemukan dalam URL.');
            }

        } catch (error) {
            console.error('Error initializing FormPenawaranPresenter:', error);
            this.view.showError('Terjadi kesalahan saat memuat halaman.');
        }
    }

    getApplicationIdFromUrl() {
        const hash = window.location.hash;
        const query = hash.split('?')[1];
        const params = new URLSearchParams(query);
        return params.get("id");
    }

    setupEventListeners() {
        this.boundLoadApplicationData = this.loadApplicationData.bind(this);
        this.boundSubmitPenawaran = this.submitPenawaran.bind(this);
        this.boundLoadUserInfo = this.loadUserInfo.bind(this);

        document.addEventListener('load-application-data', (e) => {
            this.handleLoadApplicationData(e.detail);
        });

        document.addEventListener('submit-penawaran', (e) => {
            this.handleSubmitPenawaran(e.detail);
        });

        document.addEventListener('request-user-info', () => {
            this.loadUserInfo();
        });

        document.addEventListener('load-address-options', () => {
            this.loadAddressOptions();
        });
    }

    async handleLoadApplicationData(detail) {
        const applicationId = detail?.applicationId || detail?.id;
        if (!applicationId) {
            this.view.showError('ID pengajuan tidak valid.');
            return;
        }

        await this.loadApplicationData(applicationId);
    }

    async loadApplicationData(applicationId) {
        try {
            console.log('Loading application data for ID:', applicationId);
            this.view.showLoading();

            const applicationData = await this.pengajuanModel.getApplicationById(applicationId);

            if (!applicationData) {
                throw new Error('Data pengajuan tidak ditemukan.');
            }

            this.currentApplicationId = applicationId;
            this.view.displayApplicationData(applicationData);

        } catch (error) {
            console.error('Error loading application data:', error);
            this.view.showError(error.message || 'Terjadi kesalahan saat memuat data pengajuan.');
        }
    }

   async loadAddressOptions() {
    try {
        const userId = this.user?.id || this.user?.id_user;
        if (!userId) throw new Error('User belum login');

        const addressData = await this.model.getAddresses(userId);
        this.view.displayAddressOptions(addressData || []);
    } catch (error) {
        console.error('Error loading address options:', error);
        this.view.displayAddressOptions([]);
    }
}


    async loadUserInfo() {
        try {
            let userInfo = null;

            if (typeof this.model.getCurrentUser === 'function') {
                userInfo = await this.model.getCurrentUser();
            } else {
                userInfo = getCurrentUser();
            }

            if (userInfo) {
                this.user = userInfo;
                this.view.displayUserInfo(userInfo);
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }

    async submitPenawaran(submissionData) {
        return await this.handleSubmitPenawaran(submissionData);
    }

    async handleSubmitPenawaran(submissionData) {
        try {
            if (!submissionData.applicationId && this.currentApplicationId) {
                submissionData.applicationId = this.currentApplicationId;
            }

            if (!this.validateSubmissionData(submissionData)) {
                return;
            }

            submissionData.offeredBy = this.user?.id || this.user?.username || 'admin';
            submissionData.offeredAt = new Date().toISOString();

            const result = await this.pengajuanModel.submitOffer(submissionData); 

            if (result && result.success) {
                this.view.showSuccess('Penawaran berhasil diterima!');
                setTimeout(() => {
                    window.location.hash = '#/pengajuan';
                }, 1500);
            } else {
                throw new Error(result?.message || 'Gagal menyimpan penawaran.');
            }

        } catch (error) {
            console.error('Error submitting penawaran:', error);
            this.view.showError(error.message || 'Terjadi kesalahan saat memproses penawaran.');
        }
    }

    validateSubmissionData(data) {
        if (!data.applicationId) {
            this.view.showError('ID pengajuan tidak valid');
            return false;
        }

        if (!data.hargaPerKg || data.hargaPerKg <= 0) {
            this.view.showError('Harga per kg harus diisi dan lebih dari 0');
            return false;
        }

        if (!data.alamatId) {
            this.view.showError('Alamat pickup harus dipilih');
            return false;
        }

        if (!data.berat || data.berat <= 0) {
            this.view.showError('Berat sampah tidak valid');
            return false;
        }

        if (data.totalHarga !== undefined && data.totalHarga <= 0) {
            this.view.showError('Total harga tidak valid');
            return false;
        }

        if (data.hargaPerKg > 50000) {
            this.view.showError('Harga per kg terlalu tinggi (maksimal Rp 50.000)');
            return false;
        }

        return true;
    }

    handleRetry() {
        if (this.currentApplicationId) {
            this.loadApplicationData(this.currentApplicationId);
        }
    }

    destroy() {
        document.removeEventListener('load-application-data', this.boundLoadApplicationData);
        document.removeEventListener('submit-penawaran', this.boundSubmitPenawaran);
        document.removeEventListener('request-user-info', this.boundLoadUserInfo);
        document.removeEventListener('load-address-options', this.loadAddressOptions);

        if (this.view && typeof this.view.destroy === 'function') {
            this.view.destroy();
        }
    }
}
