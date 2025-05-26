//src/pages/dashboard-user/penjemputanPresenter.js
import PenjemputanView from "./penjemputanView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class PenjemputanPresenter {
    constructor() {
        this.view = new PenjemputanView();
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