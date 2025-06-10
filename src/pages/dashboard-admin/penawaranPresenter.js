//src/pages/dashboard-admin/penawaranPresenter.js
import PenawaranView from "./penawaranView.js"; 
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import SidebarView from "../../views/sidebarView.js";
import { fetchSemuaPenawaran,fetchStatistikPenawaran } from "../../models/penawaranModel.js";

export default class PenawaranPresenter {
    constructor() {
        this.penawaranView = new PenawaranView();
        this.sidebarView = new SidebarView();
        this.currentUser = null;
        this.applications = []; 

        this.handleLogout = this.handleLogout.bind(this);
    }

    init() {
    console.log("Initializing PenawaranPresenter");

    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
        const event = new CustomEvent("navigate", { detail: { page: "login" } });
        document.dispatchEvent(event);
        return;
    }

    this.sidebarView.render();
    this.penawaranView.render();

    this.loadStatistikCard();      
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
    async loadStatistikCard() {
    try {
        const data = await fetchStatistikPenawaran();

        const stats = {
        total: data.length,
        pengajuan: 0,
        penawaran: 0,
        pengiriman: 0,
        selesai: 0,
        };

        data.forEach(item => {
        const status = item.status?.toLowerCase();
        if (status === "pengajuan") stats.pengajuan++;
        if (status === "penawaran diterima" || status === "penawaran ditolak") stats.penawaran++;
        if (status === "penawaran diterima") stats.pengiriman++;
        if (status === "selesai") stats.selesai++;
        });

        this.penawaranView.updateStatistics(stats);
    } catch (error) {
        console.error("❌ Gagal ambil statistik card:", error);
    }
    }
    handleLogout() {
        console.log("Logout initiated");
        logoutUser();
        this.penawaranView.destroy();
        this.sidebarView.destroy();
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