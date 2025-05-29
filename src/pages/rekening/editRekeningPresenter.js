// src/rekening/editRekeningPresenter.js
import EditRekeningView from "./editRekeningView";
import { getCurrentUser,getRekeningByUserId,updateRekeningById } from "../../models/authModel";

export default class EditRekeningPresenter {
  constructor(id_rekening) {
    this.view = new EditRekeningView();
    this.id_rekening = id_rekening;
    this.currentUser = getCurrentUser();

    this.handleBack = this.handleBack.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  async init() {
    if (!this.currentUser) {
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    this.view.render();
    this.view.displayUserInfo(this.currentUser);
    this.view.bindFormSubmit(this.handleFormSubmit);
    this.view.bindBackButton(this.handleBack);

    await this.loadRekeningData();
  }

  async loadRekeningData() {
  const result = await getRekeningByUserId(this.currentUser.id_user);

  console.log("Hasil fetch rekening:", result);

  // Jika data tidak valid, cukup log error tanpa alert
  if (!result || typeof result !== 'object' || !Array.isArray(result.data)) {
    console.error("Gagal memuat data rekening dari server:", result);
    // ❌ alert dihapus
    return;
  }

  const rekening = result.data.find(
    r => String(r.id_rekening) === String(this.id_rekening)
  );

  if (rekening) {
    this.view.setFormData({
      namaPemilik: rekening.nama_pemilik,
      noRekening: rekening.no_rek,
      bank: rekening.nama_bank,
    });
  } else {
    console.warn("❗ ID rekening tidak ditemukan dalam data.");
    // ❌ alert juga dihapus atau bisa ganti jadi notifikasi UI
  }
}


  async handleFormSubmit(data) {
    if (!data.noRekening || !data.bank || !data.namaPemilik) {
      alert("Semua field wajib diisi.");
      return;
    }

    const result = await updateRekeningById(this.id_rekening, {
      no_rek: data.noRekening,
      nama_bank: data.bank,
      nama_pemilik: data.namaPemilik
    });

    if (result.success) {
      alert("Rekening berhasil diubah!");
      this.handleBack();
    } else {
      alert("Gagal: " + result.message);
    }
  }

  handleBack() {
    const event = new CustomEvent("navigate", {
      detail: { page: "dataRekening" }
    });
    document.dispatchEvent(event);
  }
  destroy() {
  if (this.view && typeof this.view.destroy === "function") {
    this.view.destroy();
  }
}

}
