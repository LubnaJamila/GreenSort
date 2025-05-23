// src/presenters/rekeningPresenter.js
import DataRekeningView from "../views/rekeningView.js";
import { getCurrentUser } from "../models/authModel.js";

export default class DataRekeningPresenter {
  constructor() {
    this.view = new DataRekeningView();
    this.currentUser = null;
    
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAddRekening = this.handleAddRekening.bind(this);
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
    
    this.setupEventListeners();
    this.view.bindAddRekening(this.handleAddRekening);
  }

  setupEventListeners() {
    document.addEventListener("user-logout", this.handleLogout);
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
}