import { Router } from 'express';

import HomeController from '../controllers/home.ts';

class HomeRouter {
  homeController: HomeController;

  constructor(homeController: HomeController) {
    this.homeController = homeController;
  }

  getRouter() {
    const router = Router();
    router.get('/', this.homeController.get);
    return router;
  }
}

export default HomeRouter;
