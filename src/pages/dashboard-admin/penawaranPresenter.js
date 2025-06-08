//src/pages/dashboard-admin/penawaranPresenter.js
import PenawaranView from "./penawaranView.js"; 
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import SidebarView from "../../views/sidebarView.js";
import { fetchSemuaPenawaran } from "../../models/penawaranModel.js";

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
        this.sidebarView.render();
        this.penawaranView.render();
        this.loadPenawaranData();
        this.penawaranView.displayUserInfo(this.currentUser);
        this.setupEventListeners();
    }
    async loadPenawaranData() {
    try {
        const data = await fetchSemuaPenawaran();
        console.log("📦 Semua Penawaran:", data); // Debug log
        this.penawaranView.renderPenawaranData(data);
    } catch (error) {
        console.error("❌ Gagal load semua penawaran:", error);
    }
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