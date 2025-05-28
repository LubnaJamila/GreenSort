//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import EditProfileView from "./editProfileView.js";
import { getCurrentUser,updateUserProfile } from "../../models/authModel.js";

export default class EditProfilePresenter {
    constructor() {
        this.view = new EditProfileView();
    }
    
    init() {
        this.view.render();
        const user = getCurrentUser();
        this.view.displayUserInfo(user);
        this.view.bindSaveProfile(this.handleSaveProfile.bind(this));
    }
    async handleSaveProfile(data) {
    const user = getCurrentUser();
    if (!user || !user.id_user) return;

    const result = await updateUserProfile(user.id_user, {
        nama_lengkap: data.namaLengkap,
        username: data.username,
        email: data.email,
        no_hp: data.noTelepon,
    });

    if (result.success) {
        const updatedUser = {
        ...user,
        nama_lengkap: data.namaLengkap,
        username: data.username,
        email: data.email,
        no_hp: data.noTelepon,
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        console.log("✅ Profil berhasil diperbarui");
    } else {
        alert("❌ " + result.message);
    }
    }
    
    destroy() {
        this.view.destroy();
    }
}