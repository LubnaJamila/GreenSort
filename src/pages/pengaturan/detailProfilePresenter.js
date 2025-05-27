//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import DetailProfileView from "./detailProfileView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class DetailProfilePresenter {
    constructor() {
        this.view = new DetailProfileView();
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