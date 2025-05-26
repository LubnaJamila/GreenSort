//src/routes/router.js
export default class Router {
  constructor() {
    this.routes = {
      index: "#/",
      register: "#/register",
      login: "#/login",
      dashboard: "#/dashboard",
      dashboardUser: '#/dashboardUser',
      masterAlamat: "#/master-alamat",
      tambahAlamat: "#/master-alamat/tambah",
      pengajuan: "#/pengajuan",
      penawaran: "#/penawaran",
      pengiriman: "#/pengiriman",
      selesai: "#/selesai",
      diterima: "#/diterima",
      ditolak: "#/ditolak",
      penjemputan: "#/penjemputan",
      selesaiUser: "#/selesaiUser",
      dataRekening: "#/rekening",
      tambahRekening: "#/rekening/tambah"
    };

    // Inisialisasi
    this.initialRoute = this.getCurrentRoute();
    this.setupHashChangeListener();
    this.checkAuthAndRedirect(); // Cek saat load pertama
  }

  setupHashChangeListener() {
    window.addEventListener("hashchange", () => {
      this.checkAuthAndRedirect();
      this.dispatchRouteChange();
    });
  }

  getCurrentRoute() {
    const hash = window.location.hash || "#/";
    const route = Object.entries(this.routes).find(
      ([_, path]) => path === hash
    );
    return route ? route[0] : "index";
  }

  getCurrentPath() {
    return window.location.hash || "#/";
  }

  navigateTo(page, options = {}) {
    let targetHash = page.startsWith("#") ? page : this.routes[page] || "#/";

    if (targetHash === this.getCurrentPath() && !options.force) return;

    if (options.replace) {
      window.location.replace(targetHash);
    } else {
      window.location.hash = targetHash;
    }

    this.dispatchRouteChange();
  }

  dispatchRouteChange() {
    const event = new CustomEvent("routeChanged", {
      detail: {
        page: this.getCurrentRoute(),
        path: this.getCurrentPath(),
      },
    });
    document.dispatchEvent(event);
  }

  onRouteChange(callback) {
    const handler = (e) => callback(e.detail);
    document.addEventListener("routeChanged", handler);

    return () => document.removeEventListener("routeChanged", handler);
  }

  checkAuthAndRedirect() {
    const currentRoute = this.getCurrentRoute();
    const isLoggedIn = !!localStorage.getItem("currentUser");

    if (
      isLoggedIn &&
      (currentRoute === "login" || currentRoute === "register")
    ) {
      // Sudah login tapi mau ke login/register → redirect ke dashboard
      this.navigateTo("dashboard", { replace: true });
      return false;
    }

    if (!isLoggedIn && currentRoute === "dashboard") {
      // Belum login tapi mau ke dashboard → redirect ke login
      this.navigateTo("login", { replace: true });
      return false;
    }

    return true;
  }
}
