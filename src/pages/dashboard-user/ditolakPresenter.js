//src/pages/dashboard-user/ditolakPresenter.js
import DitolakView from "./ditolakView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class DiterimaPresenter {
    constructor() {
        this.view = new DitolakView();
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