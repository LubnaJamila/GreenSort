import SidebarView from "../views/sidebarView.js";
import { getCurrentUser } from "../models/authModel.js";

export default class SidebarPresenter {
  constructor(role) {
    this.view = new SidebarView();
    this.role = role; // Simpan role user
  }

  init() {
    console.log("Initializing SidebarPresenter with role:", this.role);

    // Bisa juga cek user di sini jika perlu
    if (!this.role) {
      console.log("Role tidak ditemukan, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    this.view.render(this.role);

    document.addEventListener("user-logout", () => {
      localStorage.removeItem("currentUser");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
    });
  }

  destroy() {
    console.log("Destroying SidebarPresenter");
    this.view.destroy();
  }
}
