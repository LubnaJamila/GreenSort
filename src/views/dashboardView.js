// src/views/dashboardView.js
import "../assets/styles/dashboard.css";
import userPlaceholder from "../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "./sidebarView";


export default class DashboardView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebar = new SidebarView();
    this.eventListeners = [];
  }

  render() {
    this.sidebar.render();
    this.app.innerHTML = `
      <div class="main-content">
        <header>
          <div class="user-profile">
            <img id="user-avatar" src="${userPlaceholder}" alt="User">
            <span id="user-name">Loading...</span>
          </div>

          <div class="dashboard-header">
            <h2>Dashboard</h2>
            <p class="text-dark mb-4">Ringkasan status pengajuan Anda secara real-time.</p>

            <div class="row">
              ${this.renderStatCard(
                "80",
                "Menunggu Validasi",
                "bi-hourglass-split",
                "yellow-bg"
              )}
              ${this.renderStatCard(
                "16",
                "Diterima",
                "bi-clipboard-check",
                "blue-bg"
              )}
              ${this.renderStatCard("8", "Ditolak", "bi-x-circle", "red-bg")}
              ${this.renderStatCard("24", "Dikirim", "bi-truck", "orange-bg")}
              ${this.renderStatCard(
                "42",
                "Selesai",
                "bi-check-circle",
                "green-bg"
              )}
            </div>
          </div>
        </header>

        <div class="data-section">
          <div class="data-header d-flex justify-content-between align-items-center">
            <h3>Data Pengajuan</h3>
          </div>

          <div class="table-responsive">
            <table id="datatable" class="table table-striped" style="width:100%">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Jenis Sampah</th>
                  <th>Kuantitas</th>
                  <th>Total</th>
                  <th>Gambar Sampah</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="applications-table-body">
                <!-- Isi data dinamis -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  renderStatCard(number, label, icon, colorClass) {
    return `
      <div class="col-md-2 col-lg-2-4">
        <div class="stat-card">
          <div class="stat-number">${number}</div>
          <div class="stat-label">${label}</div>
          <div class="icon-circle ${colorClass}">
            <i class="bi ${icon}"></i>
          </div>
          <a href="#" class="more-btn">
            <i class="bi bi-arrow-down"></i>
          </a>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.removeEventListeners();
  }

  displayUserInfo(user) {
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username;
    }
  }

  renderApplicationsTable(applicationsData) {
    const tableBody = document.getElementById("applications-table-body");
    if (!tableBody) return;

    let tableHTML = "";

    applicationsData.forEach((app) => {
      let statusClass = "bg-light";
      let statusIcon = "bi-hourglass-split";

      switch (app.status) {
        case "Diterima":
          statusClass = "bg-info bg-opacity-10";
          statusIcon = "bi-clipboard-check";
          break;
        case "Ditolak":
          statusClass = "bg-danger bg-opacity-10";
          statusIcon = "bi-x-circle";
          break;
        case "Dikirim":
          statusClass = "bg-warning bg-opacity-10";
          statusIcon = "bi-truck";
          break;
        case "Selesai":
          statusClass = "bg-success bg-opacity-10";
          statusIcon = "bi-check-circle";
          break;
      }

      tableHTML += `
        <tr>
          <td><input type="checkbox" class="form-check-input" value="${app.id}"></td>
          <td>${app.name}</td>
          <td><span class="status-badge ${statusClass}"><i class="bi ${statusIcon} me-1"></i>${app.status}</span></td>
          <td>${app.jenisSampah}</td>
          <td>${app.kuantitas}</td>
          <td>${app.total}</td>
          <td><img src="${app.imageUrl}" width="100" height="70" style="object-fit: cover;"></td>
          <td><button class="btn btn-sm btn-outline-primary">Detail</button></td>
        </tr>
      `;
    });

    tableBody.innerHTML = tableHTML;

    // Inisialisasi DataTable setelah data dimasukkan
    $(document).ready(function () {
      $("#datatable").DataTable();
    });
  }

  renderDashboardData(applicationsData) {
    this.renderApplicationsTable(applicationsData);
  }

  removeEventListeners() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  destroy() {
    this.removeEventListeners();
  }
}
