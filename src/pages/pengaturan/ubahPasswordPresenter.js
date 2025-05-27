//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import UbahPasswordView from "./ubahPasswordView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class UbahPasswordPresenter {
    constructor() {
        this.view = new UbahPasswordView();
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