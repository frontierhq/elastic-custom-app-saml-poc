import express, { Express } from 'express';

import { AuthRouter, HomeRouter } from './routers/index.ts';
import { AuthController, HomeController } from './controllers/index.ts';
import morganMiddleware from './middleware/morgan.ts';

const createApp = async (): Promise<Express> => {
  const app: Express = express();
  app.set('views', 'src/views');
  app.set('view engine', 'ejs');
  app.use(express.static('public'))
  app.use(express.urlencoded());
  app.use(morganMiddleware);

  const homeController = new HomeController();
  const homeRouter = new HomeRouter(homeController);
  app.use('/', homeRouter.getRouter());

  const authController = new AuthController();
  const authRouter = new AuthRouter(authController);
  app.use('/auth', authRouter.getRouter());

  return app;
};

export { createApp };
