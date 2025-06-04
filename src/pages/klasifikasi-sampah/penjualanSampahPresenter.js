// ============================
// 2. penjualanSampahPresenter.js
// ============================
import PenjualanSampahView from "./penjualanSampahView.js";
import { getCurrentUser } from "../../models/authModel.js";
import { kirimPengajuan } from "../../models/pengajuan_sampah-model.js"; // ⬅️ tambahkan ini

export default class PenjualanSampahPresenter {
  constructor() {
    this.view = new PenjualanSampahView();
    this.view.setPresenter(this);
  }

  init() {
    this.view.render();
    const user = getCurrentUser();
    this.view.displayUserInfo(user);
    this.view.enableSubmit();
  }

  async submitPengajuan() {
    const user = getCurrentUser();
    const data = this.view.getFormData();

    const formData = new FormData();
    formData.append("user_id", user.id_user);
    formData.append("kategori_sampah", data.kategoriSampah);
    formData.append("berat", data.beratSampah);

    const file = await this.base64ToFile(data.gambarSampah, "gambar.jpg");
    formData.append("gambar", file);

    const result = await kirimPengajuan(formData); // ⬅️ pakai model
    if (result.success) {
      this.view.showSuccess("Pengajuan berhasil disimpan.");
    } else {
      this.view.showError(result.message);
    }
  }

  async base64ToFile(base64, filename) {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }
}
