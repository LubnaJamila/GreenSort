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
import SidebarPresenter from "./presenters/sidebarPresenter.js";
import Router from "./routes/router.js";
import IndexPresenter from "./pages/index/indexPresenter.js";
import RegisterPresenter from "./pages/register/registerPresenter.js";
import LoginPresenter from "./pages/login/loginPresenter.js";
import DashboardPresenter from "./pages/dashboard-admin/dashboardPresenter.js";
import DashboardUserPresenter from "./pages/dashboard-user/dashboardUserPresenter.js";
import DataRekeningPresenter from "./pages/rekening/rekeningPresenter.js";
import TambahRekeningPresenter from "./pages/rekening/tambahRekeningPresenter.js";
import MasterAlamatPresenter from "./pages/alamat/masterAlamatPresenter.js";
import TambahAlamatPresenter from "./pages/alamat/tambahAlamatPresenter.js";
import PengajuanPresenter from "./pages/dashboard-admin/pengajuanPresenter.js";
import PengirimanPresenter from "./pages/dashboard-admin/pengirimanPresenter.js";
import SelesaiPresenter from "./pages/dashboard-admin/selesaiPresenter.js";
import DiterimaPresenter from "./pages/dashboard-user/diterimaPresenter.js";
import DitolakPresenter from "./pages/dashboard-user/ditolakPresenter.js";
import PenawaranPresenter from "./pages/dashboard-admin/penawaranPresenter.js";
import PenjemputanPresenter from "./pages/dashboard-user/penjemputanPresenter.js";
import SelesaiUserPresenter from "./pages/dashboard-user/selesaiUserPresenter.js";
//models
import { getCurrentUser } from "./models/authModel.js";

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
    const user = getCurrentUser();

    if (user?.role === "admin" && page === "dashboardUser") {
      this.router.navigateTo("dashboard");
      return;
    }

    if (user?.role === "pengguna" && page === "dashboard") {
      this.router.navigateTo("dashboardUser");
      return;
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
      case "dashboardUser":
        // Buat presenter sesuai page
        if (page === "dashboard") {
          this.currentPresenter = new DashboardPresenter();
        } else {
          this.currentPresenter = new DashboardUserPresenter();
        }
        // Sidebar selalu dibuat jika ada user
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "dataRekening": // TAMBAHKAN INI
        this.currentPresenter = new DataRekeningPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "tambahRekening": // TAMBAHKAN INI
        this.currentPresenter = new TambahRekeningPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "diterima":
        this.currentPresenter = new DiterimaPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "ditolak":
        this.currentPresenter = new DitolakPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "penjemputan":
        this.currentPresenter = new PenjemputanPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "selesaiUser":
        this.currentPresenter = new SelesaiUserPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "masterAlamat":
        this.currentPresenter = new MasterAlamatPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "tambahAlamat":
        this.currentPresenter = new TambahAlamatPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "pengajuan":
        this.currentPresenter = new PengajuanPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "penawaran":
        this.currentPresenter = new PenawaranPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "pengiriman":
        this.currentPresenter = new PengirimanPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "selesai":
        this.currentPresenter = new SelesaiPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
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
