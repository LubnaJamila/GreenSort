//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import UbahPasswordView from "./ubahPasswordView.js";
import { getCurrentUser,changePassword,logoutUser } from "../../models/authModel.js";

export default class UbahPasswordPresenter {
    constructor() {
        this.view = new UbahPasswordView();
    }
    
    init() {
        this.view.render();
        const user = getCurrentUser();
        this.view.displayUserInfo(user);
        this.view.bindChangePassword(this.handleChangePassword.bind(this));

    }
    async handleChangePassword(data) {
    const user = getCurrentUser();
    if (!user || !user.id_user) return;

    const result = await changePassword(user.id_user, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
    });

    if (result.success) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

    const okBtn = document.querySelector("#successModal button[data-bs-dismiss='modal']");
    if (okBtn) {
        const handler = () => {
            logoutUser();
            window.location.hash = "#/login";
            okBtn.removeEventListener("click", handler);
        };
        okBtn.addEventListener("click", handler);
    }
    } else {
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        const errorTitle = document.getElementById('errorModalTitle');
        const errorMessage = document.getElementById('errorModalMessage');

        if (errorTitle) errorTitle.textContent = "Gagal Mengubah Password";
        if (errorMessage) errorMessage.textContent = result.message || "Terjadi kesalahan.";

        errorModal.show();
    }
    }

    destroy() {
        this.view.destroy();
    }
}