// src/pages/alamat/masterAlamatPresenter.js
import MasterAlamatView from "./masterAlamatView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class MasterAlamatPresenter {
  constructor() {
    this.view = new MasterAlamatView();
  }

  init() {
    const user = getCurrentUser();
    this.view.render();
    this.view.displayUserInfo(user);

    // Binding untuk tombol tambah alamat
    this.view.bindAddAlamat(() => {
      document.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { page: "tambahAlamat" },
        })
      );
    });
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
    }
  }
}
