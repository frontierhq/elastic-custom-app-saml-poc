import { Router } from 'express';

import HomeController from '../controllers/home.ts';

class HomeRouter {
  homeController: HomeController;

  constructor(homeController: HomeController) {
    this.homeController = homeController;
  }

  getRouter() {
    const router = Router();
    router.get('/', this.homeController.index);
    router.get('/logout', this.homeController.logout);
    return router;
  }
}

export default HomeRouter;
