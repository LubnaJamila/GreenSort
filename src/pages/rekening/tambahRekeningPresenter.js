// src/presenters/tambahRekeningPresenter.js
import TambahRekeningView from "../rekening/tambahRekeningView"; 
import { getCurrentUser } from "../../models/authModel";


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


    handleFormSubmit(data) {
        console.log("Data rekening disubmit:", data);
        alert("Rekening berhasil ditambahkan!");
        this.handleBack(); // Gunakan method yang sudah ada
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
