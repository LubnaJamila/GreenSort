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
            // Di sini Anda bisa menambahkan logika untuk menyimpan data alamat
            // Misalnya dengan memanggil API atau model yang sesuai
            
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