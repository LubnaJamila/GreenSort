//src/pages/dashboard-admin/penawaranPresenter.js
import PenawaranView from "./penawaranView.js"; 
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import SidebarView from "../../views/sidebarView.js";
// import PengajuanModel from "../../models/pengajuan-model.js";

export default class PenawaranPresenter {
    constructor() {
        this.penawaranView = new PenawaranView();
        this.sidebarView = new SidebarView();
        this.currentUser = null;
        this.applications = []; // Store applications data

        this.handleLogout = this.handleLogout.bind(this);
    }

    init() {
        console.log("Initializing PenawaranPresenter");

        this.currentUser = getCurrentUser();
        if (!this.currentUser) {
            console.log("User not logged in, redirecting to login");
            const event = new CustomEvent("navigate", { detail: { page: "login" } });
            document.dispatchEvent(event);
            return;
        }

        // Render sidebar dan penawaran view
        this.sidebarView.render();
        this.penawaranView.render();

        // Tampilkan info user di penawaran view
        this.penawaranView.displayUserInfo(this.currentUser);

        // Load penawaran data (jika ada model untuk penawaran)
        // const penawaranData = this.penawaranModel.getPenawaranData();
        // this.penawaranView.renderPenawaranData(penawaranData);

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener("user-logout", this.handleLogout);
    }

    handleLogout() {
        console.log("Logout initiated");
        logoutUser();

        // Bersihkan tampilan penawaran dan sidebar
        this.penawaranView.destroy();
        this.sidebarView.destroy();

        // Navigasi ke halaman login
        const event = new CustomEvent("navigate", { detail: { page: "login" } });
        document.dispatchEvent(event);
    }

    destroy() {
        console.log("Destroying PenawaranPresenter");
        document.removeEventListener("user-logout", this.handleLogout);
        this.penawaranView.destroy();
        this.sidebarView.destroy();
    }
}