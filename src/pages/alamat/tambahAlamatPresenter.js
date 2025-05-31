// src/pages/alamat/tambahAlamatPresenter.js
import TambahAlamatView from "./tambahAlamatView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class TambahAlamatPresenter {
    constructor() {
        this.view = new TambahAlamatView();
        this.user = null;
    }

    init() {
        const user = getCurrentUser();
        this.view.render();
        this.view.displayUserInfo(user);

        // Bind form submission
        this.view.bindFormSubmit((formData) => {
            console.log("Form data submitted:", formData);
            // Sekarang formData sudah termasuk latitude dan longitude
            // Anda bisa menggunakan data ini untuk menyimpan alamat lengkap dengan koordinat
            
            // Setelah berhasil, kembali ke halaman master alamat
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: { page: 'masterAlamat' }
            }));
        });

        // Bind cancel button
        this.view.bindCancel(() => {
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: { page: 'masterAlamat' }
            }));
        });
    }

    destroy() {
        if (this.view) {
            this.view.destroy();
        }
    }
}