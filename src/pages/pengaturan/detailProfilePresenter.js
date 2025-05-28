//src/pages/klasifikasi-sampah/klasifikasiSampahPresenter.js
import DetailProfileView from "./detailProfileView.js";
import { getCurrentUser,getUserDetailById } from "../../models/authModel.js";

export default class DetailProfilePresenter {
    constructor() {
        this.view = new DetailProfileView();
    }
    
    async init() {
        this.view.render();

        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id_user) {
        const result = await getUserDetailById(currentUser.id_user);
        if (result && result.success) {
            this.view.updateProfileData(result.user);
        }
        }
    }
    
    destroy() {
        this.view.destroy();
    }
}