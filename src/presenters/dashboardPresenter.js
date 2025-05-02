// src/presenters/dashboardPresenter.js
import DashboardView from '../views/dashboardView.js';

class DashboardPresenter {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.view = new DashboardView(); // Buat instance dari DashboardView
    this.initEventHandlers();
  }

  initEventHandlers() {
    // Event handler lainnya bisa ditambahkan di sini
  }

  loadUserData() {
    if (this.currentUser) {
      this.view.displayUserInfo(this.currentUser); // Gunakan method dari view
      this.view.renderDashboardData(this.currentUser); // Gunakan method dari view
    }
  }
}

export const loadDashboard = () => {
  const presenter = new DashboardPresenter();
  presenter.loadUserData();
};

export const handleLogout = () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
};