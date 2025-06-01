// src/pages/alamat/masterAlamatPresenter.js
import MasterAlamatView from "./masterAlamatView.js";
import AlamatModel from "../../models/alamat-model.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class MasterAlamatPresenter {
  constructor() {
    this.view = new MasterAlamatView();
    this.alamatModel = new AlamatModel();
    this.currentUser = null;
  }

  async init() {
    try {
      this.currentUser = getCurrentUser();

      if (!this.currentUser || !this.currentUser.id_user) {
        console.error("User not authenticated");
        // Redirect ke login atau tampilkan pesan error
        return;
      }

      this.view.render();
      this.view.displayUserInfo(this.currentUser);

      // Load alamat data berdasarkan user ID
      await this.loadUserAlamat();

      // Binding untuk tombol tambah alamat
      this.view.bindAddAlamat(() => {
        document.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { page: "tambahAlamat" },
          })
        );
      });

      // Binding untuk tombol edit dan delete
      this.bindAlamatActions();
    } catch (error) {
      console.error("Error initializing MasterAlamatPresenter:", error);
      this.view.showError("Failed to load alamat data");
    }
  }

  async loadUserAlamat() {
    try {
      // Tampilkan loading indicator
      this.view.showLoading();

      // Ambil data alamat dari backend berdasarkan user ID
      const result = await this.alamatModel.getUserAlamat(
        this.currentUser.id_user
      );

      if (result.success) {
        // Render data alamat ke tabel
        this.view.renderAlamatData(result.data);
      } else {
        console.error("Failed to load alamat data");
        this.view.showError("Failed to load alamat data");
      }
    } catch (error) {
      console.error("Error loading user alamat:", error);
      this.view.showError("Error loading alamat data: " + error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  bindAlamatActions() {
    // Binding untuk tombol edit
    this.view.bindEditAlamat(async (alamatId) => {
      try {
        // Navigate ke halaman edit alamat dengan ID
        document.dispatchEvent(
          new CustomEvent("navigate", {
            detail: {
              page: "editAlamat",
              params: { id: alamatId },
            },
          })
        );
      } catch (error) {
        console.error("Error navigating to edit alamat:", error);
      }
    });

    // Binding untuk tombol delete
    this.view.bindDeleteAlamat(async (alamatId) => {
      try {
        // Konfirmasi delete
        const confirmed = await this.view.showConfirmDialog(
          "Hapus Alamat",
          "Apakah Anda yakin ingin menghapus alamat ini?"
        );

        if (confirmed) {
          // Tampilkan loading
          this.view.showLoading();

          // Hapus alamat dari backend
          const result = await this.alamatModel.deleteAlamat(alamatId);

          if (result.success) {
            // Tampilkan pesan sukses
            this.view.showSuccess(result.message || "Alamat berhasil dihapus");

            // Reload data alamat
            await this.loadUserAlamat();
          } else {
            this.view.showError("Failed to delete alamat");
          }
        }
      } catch (error) {
        console.error("Error deleting alamat:", error);
        this.view.showError("Error deleting alamat: " + error.message);
      } finally {
        this.view.hideLoading();
      }
    });
  }

  // Method untuk refresh data alamat
  async refreshAlamatData() {
    await this.loadUserAlamat();
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
    }
  }
}
