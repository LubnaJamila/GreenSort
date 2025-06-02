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
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
import "bootstrap-icons/font/bootstrap-icons.css";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
import KlasifikasiSampahPresenter from "./pages/klasifikasi-sampah/klasifikasiSampahPresenter.js";
import EditProfilePresenter from "./pages/pengaturan/editProfilePresenter.js";
import UbahPasswordPresenter from "./pages/pengaturan/ubahPasswordPresenter.js";
import EditRekeningPresenter from "./pages/rekening/editRekeningPresenter.js";
import DetailProfilePresenter from "./pages/pengaturan/detailProfilePresenter.js";
import PenjualanSampahPresenter from "./pages/klasifikasi-sampah/penjualanSampahPresenter.js";
import FormPenolakanPresenter from "./pages/dashboard-admin/formPenolakanPresenter.js";
import FormPenawaranPresenter from "./pages/dashboard-admin/formPenawaranPresenter.js";
import FormOngkirPresenter from "./pages/dashboard-user/formOngkirPresenter.js";
import FormSelesaiPresenter from "./pages/dashboard-admin/formSelesaiPresenter.js";

//models
import { getCurrentUser } from "./models/authModel.js";

class App {
  constructor() {
    this.router = new Router();
    this.currentPresenter = null;
    this.sidebarPresenter = null;
    this.currentPage = null;

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
  if (event.detail?.id_rekening) {
    sessionStorage.setItem("id_rekening", event.detail.id_rekening);
  }

  if (event.detail && event.detail.page) {
    console.log("Navigation event received:", event.detail);
    this.router.navigateTo(event.detail.page);
  }
}


  loadPage(page) {
    this.currentPage = page;
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
      case "klasifikasiSampah": // TAMBAHKAN INI
        this.currentPresenter = new KlasifikasiSampahPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "penjualanSampah": // TAMBAHKAN INI
        this.currentPresenter = new PenjualanSampahPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "detailProfile": // TAMBAHKAN INI
        this.currentPresenter = new DetailProfilePresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "editProfile": // TAMBAHKAN INI
        this.currentPresenter = new EditProfilePresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "ubahPassword": // TAMBAHKAN INI
        this.currentPresenter = new UbahPasswordPresenter();
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
      case "ubahRekening":
        const id_rekening =
          history.state?.id_rekening || sessionStorage.getItem("id_rekening");
        this.currentPresenter = new EditRekeningPresenter(id_rekening);
        if (user) this.sidebarPresenter = new SidebarPresenter(user.role);
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
      case "formPenolakan":
        this.currentPresenter = new FormPenolakanPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "formPenawaran":
        this.currentPresenter = new FormPenawaranPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "formOngkir":
        this.currentPresenter = new FormOngkirPresenter();
        if (user) {
          this.sidebarPresenter = new SidebarPresenter(user.role);
        }
        break;
      case "formSelesai":
        this.currentPresenter = new FormSelesaiPresenter();
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
      // Update active state after initialization
      setTimeout(() => {
        this.sidebarPresenter.setActiveRoute(page);
      }, 100);
    }

    // Dispatch route change event for other components
    document.dispatchEvent(new CustomEvent('route-changed', { 
      detail: { route: page } 
    }));
  }

  // Method to get current page
  getCurrentPage() {
    return this.currentPage;
  }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
