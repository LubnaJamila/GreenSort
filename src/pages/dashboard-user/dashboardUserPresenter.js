//src/pages/dashboard-user/dashboardUserPresenter.js
import DashboardUserView from "./dashboardUserView.js";
import { getCurrentUser, logoutUser } from "../../models/authModel.js";
import DashboardModel from "../../models/dashboard-model.js";

export default class DashboardUserPresenter {
  constructor() {
    this.view = new DashboardUserView();
    this.dashboardModel = new DashboardModel();
    this.currentUser = null;

    // Bind methods
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleViewApplication = this.handleViewApplication.bind(this);
    this.handleEditApplication = this.handleEditApplication.bind(this);
    this.handleDeleteApplication = this.handleDeleteApplication.bind(this);
  }

  init() {
    console.log("Initializing DashboardUserPresenter");

    this.currentUser = getCurrentUser();
    if (!this.currentUser) {
      console.log("User not logged in, redirecting to login");
      const event = new CustomEvent("navigate", { detail: { page: "login" } });
      document.dispatchEvent(event);
      return;
    }

    // Render dashboard
    this.view.render();
    
    // Display user info
    this.view.displayUserInfo(this.currentUser);
    
    // Load and display dashboard data
    this.loadDashboardData();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  loadDashboardData() {
    try {
      // Get user-specific applications (filter by current user)
      const allApplications = this.dashboardModel.getApplications();
      const userApplications = allApplications.filter(app => 
        app.userId === this.currentUser.id || app.username === this.currentUser.username
      );

      // Calculate statistics for user
      const stats = this.calculateUserStats(userApplications);

      // Render data to view
      this.view.renderDashboardData(userApplications, stats);

      console.log(`Loaded ${userApplications.length} applications for user ${this.currentUser.username}`);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Show error message to user or handle gracefully
      this.showErrorMessage("Gagal memuat data dashboard");
    }
  }

  calculateUserStats(applications) {
    const stats = {
      menungguValidasi: 0,
      diterima: 0,
      ditolak: 0,
      penjemputan: 0,
      selesai: 0
    };

    applications.forEach(app => {
      switch (app.status) {
        case 'Menunggu Validasi':
          stats.menungguValidasi++;
          break;
        case 'Diterima':
          stats.diterima++;
          break;
        case 'Ditolak':
          stats.ditolak++;
          break;
        case 'Penjemputan':
          stats.penjemputan++;
          break;
        case 'Selesai':
          stats.selesai++;
          break;
      }
    });

    return stats;
  }

  setupEventListeners() {
    // User logout event
    document.addEventListener("user-logout", this.handleLogout);

    // Dashboard refresh event
    document.addEventListener("dashboard-refresh", this.handleRefresh);

    // Application-specific events
    document.addEventListener("view-application", this.handleViewApplication);
    document.addEventListener("edit-application", this.handleEditApplication);
    document.addEventListener("delete-application", this.handleDeleteApplication);
  }

  handleLogout() {
    console.log("User logout initiated");
    logoutUser();

    // Clean up view
    this.view.destroy();

    // Navigate to login
    const event = new CustomEvent("navigate", { detail: { page: "login" } });
    document.dispatchEvent(event);
  }

  handleRefresh() {
    console.log("Dashboard refresh requested");
    this.loadDashboardData();
    this.showSuccessMessage("Data berhasil diperbarui");
  }

  handleViewApplication(event) {
    const { applicationId } = event.detail;
    console.log("View application:", applicationId);

    try {
      const application = this.dashboardModel.getApplicationById(applicationId);
      if (application) {
        // Navigate to application detail page or show modal
        const navEvent = new CustomEvent("navigate", { 
          detail: { 
            page: "application-detail", 
            params: { id: applicationId } 
          } 
        });
        document.dispatchEvent(navEvent);
      } else {
        this.showErrorMessage("Data pengajuan tidak ditemukan");
      }
    } catch (error) {
      console.error("Error viewing application:", error);
      this.showErrorMessage("Gagal menampilkan detail pengajuan");
    }
  }

  handleEditApplication(event) {
    const { applicationId } = event.detail;
    console.log("Edit application:", applicationId);

    try {
      const application = this.dashboardModel.getApplicationById(applicationId);
      if (application) {
        // Check if application can be edited
        if (this.canEditApplication(application)) {
          // Navigate to edit page
          const navEvent = new CustomEvent("navigate", { 
            detail: { 
              page: "edit-application", 
              params: { id: applicationId } 
            } 
          });
          document.dispatchEvent(navEvent);
        } else {
          this.showErrorMessage("Pengajuan tidak dapat diedit pada status ini");
        }
      } else {
        this.showErrorMessage("Data pengajuan tidak ditemukan");
      }
    } catch (error) {
      console.error("Error editing application:", error);
      this.showErrorMessage("Gagal membuka halaman edit");
    }
  }

  handleDeleteApplication(event) {
    const { applicationId } = event.detail;
    console.log("Delete application:", applicationId);

    try {
      const application = this.dashboardModel.getApplicationById(applicationId);
      if (application) {
        // Check if application can be deleted
        if (this.canDeleteApplication(application)) {
          // Perform delete operation
          const success = this.dashboardModel.deleteApplication(applicationId);
          if (success) {
            this.showSuccessMessage("Pengajuan berhasil dihapus");
            this.loadDashboardData(); // Refresh data
          } else {
            this.showErrorMessage("Gagal menghapus pengajuan");
          }
        } else {
          this.showErrorMessage("Pengajuan tidak dapat dihapus pada status ini");
        }
      } else {
        this.showErrorMessage("Data pengajuan tidak ditemukan");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      this.showErrorMessage("Gagal menghapus pengajuan");
    }
  }

  canEditApplication(application) {
    // Allow editing only for certain statuses
    const editableStatuses = ['Menunggu Validasi', 'Ditolak'];
    return editableStatuses.includes(application.status) && 
           (application.userId === this.currentUser.id || application.username === this.currentUser.username);
  }

  canDeleteApplication(application) {
    // Allow deletion only for certain statuses
    const deletableStatuses = ['Menunggu Validasi', 'Ditolak'];
    return deletableStatuses.includes(application.status) && 
           (application.userId === this.currentUser.id || application.username === this.currentUser.username);
  }

  showSuccessMessage(message) {
    // Implement success message display (could be toast, alert, etc.)
    console.log("Success:", message);
    // Example: show toast notification
    this.showToast(message, 'success');
  }

  showErrorMessage(message) {
    // Implement error message display
    console.error("Error:", message);
    // Example: show toast notification
    this.showToast(message, 'error');
  }

  showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Set background color based on type
    switch (type) {
      case 'success':
        toast.style.backgroundColor = '#28a745';
        break;
      case 'error':
        toast.style.backgroundColor = '#dc3545';
        break;
      case 'warning':
        toast.style.backgroundColor = '#ffc107';
        toast.style.color = '#212529';
        break;
      default:
        toast.style.backgroundColor = '#17a2b8';
    }

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 100);

    // Hide and remove toast
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  removeEventListeners() {
    document.removeEventListener("user-logout", this.handleLogout);
    document.removeEventListener("dashboard-refresh", this.handleRefresh);
    document.removeEventListener("view-application", this.handleViewApplication);
    document.removeEventListener("edit-application", this.handleEditApplication);
    document.removeEventListener("delete-application", this.handleDeleteApplication);
  }

  destroy() {
    console.log("Destroying DashboardUserPresenter");
    this.removeEventListeners();
    this.view.destroy();
  }
}