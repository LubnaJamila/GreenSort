//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import EditProfileView from "./editProfileView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class EditProfilePresenter {
    constructor() {
        this.view = new EditProfileView();
    }
    
    init() {
        this.view.render();
        const user = getCurrentUser();
        this.view.displayUserInfo(user);
    }
    
    destroy() {
        this.view.destroy();
    }
}