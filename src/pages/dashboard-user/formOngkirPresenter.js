// src/pages/dashboard-user/formOngkirPresenter.js
import FormOngkirView from './formOngkirView.js';
import {
  getCurrentUser,
  getRekeningByUserId,
  getUserDetailById,
} from "../../models/authModel.js";

import {
  getPengajuanById,
  updatePengantaran,
  updatePenjemputan,
} from "../../models/pengajuanModel.js";
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
      this.handleDeliveryMethodChange("mengantar");
    } catch (error) {
      console.error("Error initializing Form Ongkir:", error);
      this.view.showError("Gagal memuat data. Silakan coba lagi.");
    }
  }
  async loadApplicationData(applicationId) {
    try {
      const data = await getPengajuanById(applicationId);

      const berat = parseFloat(data.berat) || 0;
      const hargaPerKg = parseFloat(data.harga_tawaran) || 0;
      this.applicationData = {
        id: data.id,
        namaLengkap: data.nama_lengkap,
        noHp: data.no_hp,
        kategoriSampah: data.jenis_sampah,
        beratSampah: berat, // ✅ berat dari DB
        hargaSampah: hargaPerKg, // ✅ harga per kg dari DB
        totalHarga: berat * hargaPerKg,
        gambarSampah: data.gambar_sampah
          ? `https://greenshort-production.up.railway.app${data.gambar_sampah}`
          : null,
        status: data.status,
      };
    } catch (error) {
      console.error("Gagal ambil data pengajuan:", error);
      throw error;
    }
  }

  async loadUserData() {
    try {
      const user = getCurrentUser();
      if (!user) throw new Error("User belum login");

      const userDetail = await getUserDetailById(user.id_user);
      const rekeningResult = await getRekeningByUserId(user.id_user);
      const alamatResult = await this.alamatModel.getUserAlamat(user.id_user);

      const mappedAlamat = alamatResult.data.map((item) => ({
        id: item.id_alamat,
        nama: `${item.desa}, ${item.kecamatan}`,
        alamat: item.alamat_lengkap,
        latitude: item.latitude, // ← Ini penting!
        longitude: item.longitude,
        jarak: 0,
      }));

      this.userData = {
        id: user.id_user,
        ...userDetail.user,
        rekeningList: rekeningResult.data || [],
        alamatList: mappedAlamat,
      };
    } catch (error) {
      console.error("Error loading user data:", error);
      throw new Error("Gagal memuat data pengguna");
    }
  }

  async loadMasterAlamat() {
    try {
      const alamatAdminList = await this.alamatModel.getAlamatAdmin();
      console.log("Alamat Admin dari DB:", alamatAdminList);

      this.masterAlamat = alamatAdminList;

      const alamatUtama = alamatAdminList[0];
      if (alamatUtama) {
        this.view.populateUserAddress({
          alamat: alamatUtama.alamat_lengkap,
          latitude: alamatUtama.latitude,
          longitude: alamatUtama.longitude,
        });
      }
    } catch (error) {
      console.error("Error loading master alamat:", error);
      throw error;
    }
  }

  populateViewData() {
    if (this.applicationData) {
      this.view.populateApplicationData(this.applicationData);
    }

    if (this.userData) {
      this.view.displayUserInfo(this.userData);
      this.view.displayUserRekening(this.userData.rekeningList);

      const alamatAdminUtama =
        this.masterAlamat.find((al) => al.nama === "Kantor Pusat") ||
        this.masterAlamat[0];

      // Kirim langsung seluruh objek agar konsisten
      this.view.populateUserAddress(alamatAdminUtama);

      if (this.userData.alamatList.length > 0) {
        this.view.populateMasterAlamat(this.userData.alamatList);
      }
    }

    // Alamat tujuan default (mengantar sendiri)
    this.setDefaultAlamatTujuan();
  }

  setDefaultAlamatTujuan() {
    const defaultAlamat =
      this.masterAlamat.find((alamat) => alamat.nama === "Kantor Pusat") ||
      this.masterAlamat[0];

    console.log("Default Alamat Admin:", defaultAlamat); // ✅ debug log

    if (defaultAlamat) {
      const alamatTujuanElement = document.getElementById("alamat-tujuan");
      const lokasiLink = document.getElementById("lokasi-link");

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
    document.addEventListener("delivery-method-changed", (event) => {
      this.handleDeliveryMethodChange(event.detail.method);
    });

    // Listen for alamat change
    document.addEventListener("alamat-changed", (event) => {
      this.handleAlamatChange(event.detail.alamatId);
    });

    // Listen for form submit
    document.addEventListener("form-submit", (event) => {
      this.handleFormSubmit(event.detail);
    });
  }

  handleDeliveryMethodChange(method) {
    this.selectedAlamat = null;

    if (method === "dijemput") {
      const pilihAlamatSelect = document.getElementById("pilih-alamat");
      if (pilihAlamatSelect) pilihAlamatSelect.value = "";
      this.view.updateEstimasiJarak(null, null);
    } else if (method === "mengantar") {
      this.setDefaultAlamatTujuan();
    }

    // ⏱ Ambil estimasi tanggal dari fungsi helper (format YYYY-MM-DD)
    const estimasi = this.getEstimasiTanggalRange(method);

    // 🗓 Tampilkan ke input <input type="date">
    if (method === "mengantar") {
      const startEl = document.getElementById("estimasi-mulai-mengantar");
      const endEl = document.getElementById("estimasi-selesai-mengantar");
      if (startEl) startEl.value = estimasi.start;
      if (endEl) endEl.value = estimasi.end;
    } else if (method === "dijemput") {
      const startEl = document.getElementById("estimasi-mulai-dijemput");
      const endEl = document.getElementById("estimasi-selesai-dijemput");
      if (startEl) startEl.value = estimasi.start;
      if (endEl) endEl.value = estimasi.end;
    }
  }

  getEstimasiTanggalRange(method) {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (method === "mengantar") {
      start.setDate(today.getDate() + 1);
      end.setDate(today.getDate() + 2);
    } else if (method === "dijemput") {
      start.setDate(today.getDate() + 2);
      end.setDate(today.getDate() + 4);
    }

    const toDateStr = (date) => date.toISOString().split("T")[0]; // hasil: "2025-06-09"
    return {
      start: toDateStr(start),
      end: toDateStr(end),
    };
  }

  hitungJarakKm(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius bumi dalam km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // dalam kilometer
  }

  // Tambahkan ke dalam FormOngkirPresenter class

  hitungOngkir(jarakKm, beratGram) {
    const jarakMinimal = 60; // km
    const tarifPer15Km = 3000; // Rp per 15 km
    const tarifPer100Gram = 100; // Rp per 100 gram

    const jarakDihitung = Math.max(jarakKm, jarakMinimal);
    const kelipatanJarak = Math.ceil(jarakDihitung / jarakMinimal);
    const beratDihitung = Math.ceil(beratGram / 1000);

    const ongkirJarak = kelipatanJarak * tarifPer15Km;
    const ongkirBerat = beratDihitung * tarifPer100Gram;

    const totalOngkir = ongkirJarak + ongkirBerat;

    return totalOngkir;
  }

  handleAlamatChange(alamatId) {
    if (!alamatId) {
      this.selectedAlamat = null;
      this.view.updateEstimasiJarak(null, null);
      return;
    }

    this.selectedAlamat = this.userData.alamatList.find(
      (alamat) => alamat.id == alamatId
    );

    const alamatAdmin =
      this.masterAlamat.find((al) => al.nama === "Kantor Pusat") ||
      this.masterAlamat[0];

    if (this.selectedAlamat && alamatAdmin) {
      const lat1 = Number(this.selectedAlamat.latitude);
      const lon1 = Number(this.selectedAlamat.longitude);
      const lat2 = Number(alamatAdmin.latitude);
      const lon2 = Number(alamatAdmin.longitude);

      if (!isNaN(lat1) && !isNaN(lon1) && !isNaN(lat2) && !isNaN(lon2)) {
        const jarak = this.hitungJarakKm(lat1, lon1, lat2, lon2);
        this.selectedAlamat.jarak = jarak;

        const beratGram = (this.applicationData?.beratSampah || 0) * 1000;
        const ongkir = this.hitungOngkir(jarak, beratGram);

        this.view.updateEstimasiJarak(jarak, ongkir);
      } else {
        console.warn("Koordinat tidak valid untuk menghitung jarak.");
        this.view.updateEstimasiJarak(null, null);
      }
    }
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
      this.view.showSuccess(
        "Form berhasil disimpan! Anda akan diarahkan kembali ke halaman sebelumnya."
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      this.view.showError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      this.view.showLoading(false);
    }
  }

  validateFormData(formData) {
    // Basic validation
    if (!formData.applicationId) {
      return { isValid: false, message: "Data pengajuan tidak ditemukan." };
    }

    if (!formData.deliveryMethod) {
      return { isValid: false, message: "Pilih metode pengiriman." };
    }

    if (formData.deliveryMethod === "dijemput") {
      if (!formData.alamatId) {
        return { isValid: false, message: "Pilih alamat penjemputan." };
      }

      if (!this.selectedAlamat) {
        return { isValid: false, message: "Alamat penjemputan tidak valid." };
      }
    }

    return { isValid: true, message: "Valid" };
  }

  prepareSubmissionData(formData) {
    const submissionData = {
      applicationId: formData.applicationId,
      deliveryMethod: formData.deliveryMethod,
      userId: this.userData?.id,
      timestamp: new Date().toISOString(),
    };

    if (formData.deliveryMethod === "dijemput") {
        const alamat = this.selectedAlamat;
        const idRekening = document.getElementById("rekening-user-dijemput")?.value;
        const estimasiMulai = document.getElementById("estimasi-mulai-dijemput")?.value;
        const estimasiSelesai = document.getElementById("estimasi-selesai-dijemput")?.value;
        const berat = this.applicationData?.totalBerat || 0;
        const jarak = alamat?.jarak || 0;
      
        const pendapatanView = parseInt(
          document.getElementById("pendapatan")?.value.replace(/[^\d]/g, "")
        ) || 0;
      
        const ongkirView = parseInt(
          document.getElementById("ongkir")?.value.replace(/[^\d]/g, "")
        ) || 0;
      
        submissionData.idRekening = idRekening;
        submissionData.alamatUserId = alamat?.id;
        submissionData.estimasiJarak = jarak;
        submissionData.ongkir = ongkirView; // ✅ dari tampilan
        submissionData.estimasiMulai = estimasiMulai;
        submissionData.estimasiSelesai = estimasiSelesai;
        submissionData.totalHarga = pendapatanView; // ✅ dari tampilan       // ✅ Ambil dari input pendapatan
    } else {
      // Untuk metode "mengantar"
      const defaultAlamat =
        this.masterAlamat.find((alamat) => alamat.nama === "Kantor Pusat") ||
        this.masterAlamat[0];

      const idRekening = document.getElementById(
        "rekening-user-mengantar"
      )?.value;
      const estimasiMulai = document.getElementById(
        "estimasi-mulai-mengantar"
      )?.value;
      const estimasiSelesai = document.getElementById(
        "estimasi-selesai-mengantar"
      )?.value;
      const totalHarga = this.applicationData?.totalHarga || 0;

      submissionData.alamatTujuan = defaultAlamat;
      submissionData.ongkir = 0;
      submissionData.idRekening = idRekening;
      submissionData.estimasiMulai = estimasiMulai;
      submissionData.estimasiSelesai = estimasiSelesai;
      submissionData.totalHarga = totalHarga;
    }

    console.log("📤 Submitting form data:", submissionData);
    return submissionData;
  }

  async submitForm(submissionData) {
    try {
      this.view.showLoading(true);

      if (submissionData.deliveryMethod === "mengantar") {
        await updatePengantaran(submissionData.applicationId, {
          rekening_id: submissionData.idRekening,
          total: submissionData.totalHarga,
          tanggal_awal: submissionData.estimasiMulai,
          tanggal_akhir: submissionData.estimasiSelesai,
        });
      } else {
        const payload = {
          rekening_id: submissionData.idRekening,
          alamat_user_id: submissionData.alamatUserId,
          total: submissionData.totalHarga,
          ongkir: submissionData.ongkir,
          jarak_estimasi_km: submissionData.estimasiJarak,
          tanggal_awal: submissionData.estimasiMulai,
          tanggal_akhir: submissionData.estimasiSelesai,
        };

        console.log("📤 Payload untuk penjemputan:", payload);
        await updatePenjemputan(submissionData.applicationId, payload);
      }

      this.view.showSuccess("Form berhasil disimpan!");
    } catch (error) {
      console.error("❌ Error saat submit:", error);
      this.view.showError(
        error.message || "Gagal menyimpan data. Silakan coba lagi."
      );
    } finally {
      this.view.showLoading(false);
    }
  }

  showLoadingState() {
    // Could show a loading spinner or skeleton UI
    console.log("Loading form data...");
  }

  // Method to handle external navigation to this form
  static async navigateToForm(applicationId) {
    try {
      const presenter = new FormOngkirPresenter();
      await presenter.init(applicationId);
      return presenter;
    } catch (error) {
      console.error("Error navigating to form:", error);
      // Could redirect to error page or show error message
      throw error;
    }
  }

  // Utility method to format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }

  // Utility method to format distance
  formatDistance(distance) {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(1)} km`;
  }

  // Cleanup method
  destroy() {
    // Remove event listeners
    document.removeEventListener(
      "delivery-method-changed",
      this.handleDeliveryMethodChange
    );
    document.removeEventListener("alamat-changed", this.handleAlamatChange);
    document.removeEventListener("form-submit", this.handleFormSubmit);

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