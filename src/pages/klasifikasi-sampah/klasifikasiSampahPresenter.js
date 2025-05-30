//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import KlasifikasiSampahView from "./klasifikasiSampahView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class KlasifikasiSampahPresenter {
    constructor() {
        this.view = new KlasifikasiSampahView();
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