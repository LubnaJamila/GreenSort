//src/pages/dashboard-user/dashboardUserPresenter.js
import DashboardUserView from "./dashboardUserView.js";
import { getCurrentUser } from "../../models/authModel.js";
export default class DashboardUserPresenter {
  constructor() {
    this.view = new DashboardUserView();
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
