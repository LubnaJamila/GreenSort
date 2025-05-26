//src/pages/dashboard-user/dashboardUserPresenter.js
import DiterimaView from "./diterimaView.js";
import { getCurrentUser } from "../../models/authModel.js";

export default class DiterimaPresenter {
    constructor() {
        this.view = new DiterimaView();
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