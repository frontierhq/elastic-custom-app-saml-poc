import { Router } from 'express';

import SamlController from '../controllers/saml.ts';

class SamlRouter {
  samlController: SamlController;

  constructor(samlController: SamlController) {
    this.samlController = samlController;
  }

  getRouter() {
    const router = Router();
    router.get('/login', this.samlController.login);
    router.post('/callback', this.samlController.callback);
    return router;
  }
}

export default SamlRouter;
