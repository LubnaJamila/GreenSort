// src/pages/alamat/tambahAlamatPresenter.js
import TambahAlamatView from "./tambahAlamatView.js";
import AlamatModel from "../../models/alamat-model.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class TambahAlamatPresenter {
  constructor() {
    this.view = new TambahAlamatView();
    this.model = new AlamatModel();
    this.user = null;
  }

  async init() {
    try {
      this.user = getCurrentUser();
      this.setupEventHandlers();
      this.view.render();
      this.view.displayUserInfo(this.user);
      await this.loadProvinces();
    } catch (error) {
      console.error("Error initializing TambahAlamatPresenter:", error);
      this.handleError("Gagal menginisialisasi halaman tambah alamat");
    }
  }

  setupEventHandlers() {
    this.view.setEventHandlers({
      onProvinsiChange: () => this.handleProvinsiChange(),
      onKabupatenChange: () => this.handleKabupatenChange(),
      onKecamatanChange: () => this.handleKecamatanChange(),
      onFormSubmit: (formData) => this.handleFormSubmit(formData),
      onCancel: () => this.handleCancel(),
    });
  }

  async loadProvinces() {
    try {
      const provinces = await this.model.getProvinces();
      this.view.populateProvinces(provinces);
    } catch (error) {
      console.error("Error loading provinces:", error);
      this.view.showError("provinsi", "Error loading provinsi");
    }
  }

  async handleProvinsiChange() {
    const formData = this.view.getFormData();
    const provinsiId = formData.provinsi;
    this.view.resetKabupatenOptions();

    if (!provinsiId) return;

    try {
      this.view.showLoading("kabupaten", "Loading kabupaten...");
      const regencies = await this.model.getRegencies(provinsiId);
      this.view.populateKabupaten(regencies);
    } catch (error) {
      console.error("Error loading regencies:", error);
      this.view.showError("kabupaten", "Error loading kabupaten");
    }
  }

  async handleKabupatenChange() {
    const formData = this.view.getFormData();
    const kabupatenId = formData.kabupaten;
    this.view.resetKecamatanOptions();

    if (!kabupatenId) return;

    try {
      this.view.showLoading("kecamatan", "Loading kecamatan...");
      const districts = await this.model.getDistricts(kabupatenId);
      this.view.populateKecamatan(districts);
    } catch (error) {
      console.error("Error loading districts:", error);
      this.view.showError("kecamatan", "Error loading kecamatan");
    }
  }

  async handleKecamatanChange() {
    const formData = this.view.getFormData();
    const kecamatanId = formData.kecamatan;
    this.view.resetDesaOptions();

    if (!kecamatanId) return;

    try {
      this.view.showLoading("desa", "Loading desa...");
      const villages = await this.model.getVillages(kecamatanId);
      this.view.populateDesa(villages);
    } catch (error) {
      console.error("Error loading villages:", error);
      this.view.showError("desa", "Error loading desa");
    }
  }

  async handleFormSubmit(formData) {
    try {
      this.view.setFormLoading(true);

      const validation = this.view.validateForm();
      if (!validation.isValid) {
        this.view.showValidationErrors(validation.errors);
        return;
      }

      const completeFormData = this.view.getFormData();
      const alamatData = {
        provinsi: completeFormData.provinsiText,
        kabupaten: completeFormData.kabupatenText,
        kecamatan: completeFormData.kecamatanText,
        desa: completeFormData.desaText,
        alamatLengkap: completeFormData.alamatLengkap,
        latitude: completeFormData.latitude,
        longitude: completeFormData.longitude,
      };

      console.log("Saving alamat data:", alamatData);

      const result = await this.model.saveAlamat(alamatData);

      if (result.success) {
        this.view.showSuccess(result.message || "Alamat berhasil disimpan!");
        setTimeout(() => {
          this.navigateToMasterAlamat();
        }, 1500);
      } else {
        throw new Error(result.message || "Gagal menyimpan alamat");
      }
    } catch (error) {
      console.error("Error saving alamat:", error);
      this.view.showErrorMessage(
        error.message || "Terjadi kesalahan saat menyimpan alamat"
      );
    } finally {
      this.view.setFormLoading(false);
    }
  }

  handleCancel() {
    const formData = this.view.getFormData();
    const hasData = Object.values(formData).some((value) =>
      typeof value === "string" ? value.trim() : value
    );

    if (hasData) {
      const confirmed = confirm(
        "Anda yakin ingin membatalkan? Data yang sudah diisi akan hilang."
      );
      if (!confirmed) return;
    }

    this.navigateToMasterAlamat();
  }

  navigateToMasterAlamat() {
    document.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { page: "masterAlamat" },
      })
    );
  }

  handleError(message) {
    this.view.showErrorMessage(`Error: ${message}`);
  }

  destroy() {
    if (this.view) this.view.destroy();
    this.model = null;
    this.user = null;
  }
}
