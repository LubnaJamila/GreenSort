// src/main.js
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";

// CSS
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Presenters
import IndexPresenter from "./presenters/indexPresenter.js";
import RegisterPresenter from "./presenters/registerPresenter.js";
import LoginPresenter from "./presenters/loginPresenter.js";
import DashboardPresenter from "./presenters/dashboardPresenter.js";
import SidebarPresenter from "./presenters/sidebarPresenter.js";
import Router from "./routes/router.js";

class App {
  constructor() {
    this.router = new Router();
    this.currentPresenter = null;
    this.sidebarPresenter = null;

    document.addEventListener("navigate", this.handleNavigateEvent.bind(this));
    this.setupRouteHandlers();
  }

  setupRouteHandlers() {
    this.router.onRouteChange(({ page }) => {
      console.log(`Route changed to: ${page}`);
      this.loadPage(page);
    });

    const initialPage = this.router.getCurrentRoute();
    console.log(`Initial page: ${initialPage}`);
    this.loadPage(initialPage);
  }

  handleNavigateEvent(event) {
    if (event.detail && event.detail.page) {
      console.log("Navigation event received:", event.detail);
      this.router.navigateTo(event.detail.page);
    }
  }

  loadPage(page) {
    // Ambil halaman sebelumnya
    const previousPage = sessionStorage.getItem("previousPage");

    // Jika halaman berubah, lakukan reload (kecuali reload sudah dilakukan)
    if (
      previousPage !== page &&
      sessionStorage.getItem("hasReloaded") !== "true"
    ) {
      sessionStorage.setItem("hasReloaded", "true");
      sessionStorage.setItem("previousPage", page);
      location.reload();
      return;
    }

    // Reset flag reload setelah reload pertama selesai
    sessionStorage.setItem("previousPage", page);
    sessionStorage.removeItem("hasReloaded");

    // Destroy current presenter
    if (this.currentPresenter) {
      this.currentPresenter.destroy();
      this.currentPresenter = null;
    }

    // Destroy sidebar if exists
    if (this.sidebarPresenter) {
      this.sidebarPresenter.destroy();
      this.sidebarPresenter = null;
    }

    // Pilih presenter berdasarkan halaman
    switch (page) {
      case "index":
        this.currentPresenter = new IndexPresenter();
        break;
      case "register":
        this.currentPresenter = new RegisterPresenter();
        break;
      case "login":
        this.currentPresenter = new LoginPresenter();
        break;
      case "dashboard":
        this.currentPresenter = new DashboardPresenter();
        this.sidebarPresenter = new SidebarPresenter();
        break;
      default:
        this.currentPresenter = new IndexPresenter();
    }

    // Inisialisasi presenter
    if (this.currentPresenter) {
      this.currentPresenter.init();
    }

    if (this.sidebarPresenter) {
      this.sidebarPresenter.init();
    }
  }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
