// src/presenters/rekeningPresenter.js
import DataRekeningView from "../rekening/rekeningView.js";
import { getCurrentUser,getRekeningByUserId,deleteRekeningById } from "../../models/authModel.js";

export default class DataRekeningPresenter {
  constructor() {
    this.view = new DataRekeningView();
    this.currentUser = null;
    
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAddRekening = this.handleAddRekening.bind(this);
    this.handleDeleteRekening = this.handleDeleteRekening.bind(this);

  }

  init() {
    console.log("Initializing DataRekeningPresenter");
    
    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    this.view.render();
    
    this.view.displayUserInfo(this.currentUser);
    this.fetchRekeningUser(this.currentUser.id_user);

    
    this.setupEventListeners();
    this.view.bindAddRekening(this.handleAddRekening);
  }

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
    document.addEventListener("delete-rekening", this.handleDeleteRekening);

  }

  handleLogout() {
    console.log("Logout initiated from DataRekeningPresenter");
    
    this.destroy();
    
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  destroy() {
    console.log("Destroying DataRekeningPresenter");
    
    document.removeEventListener("user-logout", this.handleLogout);
    
    if (this.view && this.view.destroy) {
      this.view.destroy();
    }
  }
  
  handleAddRekening() {
    const event = new CustomEvent("navigate", { 
      detail: { page: "tambahRekening" } 
    });
    document.dispatchEvent(event);
  }
  async fetchRekeningUser(userId) {
  const result = await getRekeningByUserId(userId);

  if (result.success) {
    this.view.renderRekeningTable(result.data);
  } else {
    console.error("Gagal mendapatkan data rekening:", result.message);
  }
}
async handleDeleteRekening(event) {
  const { id_rekening, targetRow } = event.detail;

  const result = await deleteRekeningById(id_rekening);
  alert(result.message);

  if (result.success && targetRow) {
    targetRow.remove(); // langsung hapus baris dari tabel
  }
}


}