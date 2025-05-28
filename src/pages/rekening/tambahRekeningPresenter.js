// src/presenters/tambahRekeningPresenter.js
import TambahRekeningView from "../rekening/tambahRekeningView"; 
import { getCurrentUser,createRekening } from "../../models/authModel";


export default class TambahRekeningPresenter {
    constructor() {
        this.view = new TambahRekeningView();
        this.handleBack = this.handleBack.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    init() {
        this.currentUser = getCurrentUser();
        if (!this.currentUser) {
        console.log("User not logged in, redirecting to login");
        const event = new CustomEvent("navigate", { detail: { page: "login" } });
        document.dispatchEvent(event);
        return;
        }
        this.view.render();
        this.view.displayUserInfo(this.currentUser);
        this.setupEventListeners();
        this.view.bindFormSubmit(this.handleFormSubmit.bind(this));
        this.view.bindBackButton(this.handleBack.bind(this));
    }

    setupEventListeners() {
        document.addEventListener("user-logout", this.handleLogout);
    }


    async handleFormSubmit(data) {
    console.log("Data rekening disubmit:", data);

    if (!data.noRekening || !data.bank || !data.namaPemilik) {
        alert("Semua field wajib diisi.");
        return;
    }

    const rekeningData = {
        no_rek: data.noRekening,
        nama_bank: data.bank,
        nama_pemilik: data.namaPemilik,
        id_user: this.currentUser.id_user,
    };

    const result = await createRekening(rekeningData);

    if (result.success) {
        alert("Rekening berhasil disimpan!");
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
        console.log("Destroying TambahRekeningPresenter");
        if (this.view && this.view.destroy) {
            this.view.destroy();
        }
        document.removeEventListener("user-logout", this.handleLogout);
    }
}
