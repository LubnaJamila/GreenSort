// src/pages/klasifikasi-sampah/penjualanSampahPresenter.js
import PenjualanSampahView from "./penjualanSampahView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class PenjualanSampahPresenter {
  constructor() {
    this.view = new PenjualanSampahView();
    this.view.setPresenter(this);
  }

  init() {
    this.view.render();
    const user = getCurrentUser();
    this.view.displayUserInfo(user);

    const imageData = this.validateClassificationImage();
    if (!imageData) return;

    this.view.loadPenjualanData();
  }

  validateClassificationImage() {
    try {
      const classificationData = JSON.parse(
        localStorage.getItem("penjualanSampahData") || "{}"
      );

      if (!classificationData || !classificationData.image) {
        this.view.showError("Data gambar hasil klasifikasi tidak ditemukan");
        // Redirect back to classification page after 2 seconds
        setTimeout(() => {
          window.location.hash = "#/klasifikasi-sampah";
        }, 2000);
        return null;
      }
      return classificationData.image;
    } catch (error) {
      console.error("Error validasi gambar klasifikasi:", error);
      this.view.showError("Terjadi kesalahan saat memvalidasi gambar");
      setTimeout(() => {
        window.location.hash = "#/klasifikasi-sampah";
      }, 2000);
      return null;
    }
  }

  validatePenjualanData(data) {
    const requiredFields = [
      "namaLengkap",
      "noHp",
      "kategoriSampah",
      "beratSampah",
    ];

    for (let field of requiredFields) {
      if (
        !data[field] ||
        (typeof data[field] === "string" && !data[field].trim())
      ) {
        return {
          isValid: false,
          message: `${this.getFieldDisplayName(field)} tidak boleh kosong`,
        };
      }
    }

    if (data.beratSampah <= 0) {
      return {
        isValid: false,
        message: "Berat sampah harus lebih dari 0 kg",
      };
    }

    if (data.beratSampah > 1000) {
      return {
        isValid: false,
        message: "Berat sampah tidak boleh lebih dari 1000 kg",
      };
    }

    if (data.noHp.length < 10 || data.noHp.length > 13) {
      return {
        isValid: false,
        message: "Nomor HP harus 10-13 digit",
      };
    }

    if (!/^\d+$/.test(data.noHp)) {
      return {
        isValid: false,
        message: "Nomor HP hanya boleh berisi angka",
      };
    }

    return { isValid: true };
  }

  getFieldDisplayName(fieldName) {
    const displayNames = {
      namaLengkap: "Nama Lengkap",
      noHp: "Nomor HP",
      kategoriSampah: "Kategori Sampah",
      beratSampah: "Berat Sampah",
    };
    return displayNames[fieldName] || fieldName;
  }

  destroy() {
    this.view.destroy();
  }
}
