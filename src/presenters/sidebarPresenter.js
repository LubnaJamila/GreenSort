// src/presenters/sidebarPresenter.js
import SidebarView from "../views/sidebarView.js"; // pastikan path dan nama file sudah benar
import { getCurrentUser } from "../models/authModel.js";

export default class SidebarPresenter {
  constructor() {
    this.view = new SidebarView();
    this.currentUser = null;
  }

  init() {
    console.log("Initializing SidebarPresenter");

    this.currentUser = getCurrentUser();

    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    this.view.render();

    // Kalau mau handle event logout
    document.addEventListener("user-logout", () => {
      localStorage.removeItem("currentUser"); // contoh hapus session login
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
    });
  }

  destroy() {
    console.log("Destroying SidebarPresenter");
    this.view.destroy();
  }
}
