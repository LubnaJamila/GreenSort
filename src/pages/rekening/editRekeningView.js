// src/rekening/editRekeningView.js
import "../../assets/styles/rekening.css";
import userPlaceholder from "../../assets/images/unsplash_HaNi1rsZ6Nc.png";
import SidebarView from "../../views/sidebarView";
import { getBankList } from "../../models/authModel";

export default class EditRekeningView {
  constructor() {
    this.app = document.getElementById("content");
    this.sidebarView = new SidebarView();
    this.eventListeners = [];
  }

  render() {
    this.sidebarView.render();
    this.app.innerHTML = `
      <button id="mobile-menu-toggle" class="mobile-menu-btn">
        <i class="bi bi-list"></i>
      </button>
      <div class="sidebar-overlay"></div>

      <div class="main-content">
        <header>
          <div class="header-content">
            <div class="dashboard-header">
              <h2>Edit Rekening</h2>
              <p class="text-dark mb-4">Perbarui data rekening</p>
            </div>
            <div class="user-profile">
              <img id="user-avatar" src="${userPlaceholder}" alt="User">
              <span id="user-name">Loading...</span>
            </div>
          </div>
        </header>

        <div class="rekening-section">
          <div class="form-section">
            <form id="form-edit-rekening" class="form">
              <div class="form-group">
                <label for="nama-pemilik">Nama Pemilik</label>
                <input type="text" id="nama-pemilik" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="no-rekening">Nomor Rekening</label>
                <input type="text" id="no-rekening" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="bank">Bank</label>
                <select id="bank" class="form-control" required>
                  <option value="">Memuat daftar bank...</option>
                </select>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary">Simpan</button>
                <button type="button" id="btn-kembali" class="btn btn-secondary">Kembali</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    this.populateBankDropdown();
  }

  async populateBankDropdown() {
    const select = document.getElementById("bank");
    try {
      const banks = await getBankList();
      select.innerHTML = `<option value="">-- Pilih Bank --</option>`;
      banks.forEach(bank => {
        const option = document.createElement("option");
        option.value = bank.nama;
        option.textContent = `${bank.nama} (${bank.kode})`;
        select.appendChild(option);
      });
    } catch {
      select.innerHTML = `<option value="">Gagal memuat bank</option>`;
    }
  }

  bindFormSubmit(handler) {
    const form = document.getElementById("form-edit-rekening");
    const formHandler = (e) => {
      e.preventDefault();
      const data = {
        namaPemilik: document.getElementById("nama-pemilik").value.trim(),
        noRekening: document.getElementById("no-rekening").value.trim(),
        bank: document.getElementById("bank").value
      };
      handler(data);
    };
    form.addEventListener("submit", formHandler);
    this.eventListeners.push({ element: form, type: 'submit', handler: formHandler });
  }

  bindBackButton(handler) {
    const btn = document.getElementById("btn-kembali");
    btn.addEventListener("click", handler);
    this.eventListeners.push({ element: btn, type: "click", handler });
  }

  setFormData({ namaPemilik, noRekening, bank }) {
    document.getElementById("nama-pemilik").value = namaPemilik;
    document.getElementById("no-rekening").value = noRekening;
    document.getElementById("bank").value = bank;
  }

  displayUserInfo(user) {
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && user) {
      userNameElement.textContent = user.name || user.username;
    }
  }

  destroy() {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
  }
}
