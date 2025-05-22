import DashboardUserView from '../views/dashboardUserView.js';
import { getCurrentUser } from '../models/authModel.js';
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
