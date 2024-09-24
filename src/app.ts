import { estypes } from '@elastic/elasticsearch';
import express, { Express } from 'express';
import session from 'express-session';

import { HomeRouter, SamlRouter } from './routers/index.ts';
import { HomeController, SamlController } from './controllers/index.ts';
import morgan from './middleware/morgan.ts';

declare module "express-session" {
  interface SessionData {
    user: estypes.SecuritySamlAuthenticateResponse;
  }
}

const createApp = async (): Promise<Express> => {
  const app: Express = express();

  app.set('views', 'src/views');
  app.set('view engine', 'ejs');

  app.use(express.static('public'))
  app.use(session({ resave: false, saveUninitialized: false, secret: 'notasecret' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan());
  app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
  });

  const homeController = new HomeController();
  const homeRouter = new HomeRouter(homeController);
  app.use('/', homeRouter.getRouter());

  const samlController = new SamlController();
  const samlRouter = new SamlRouter(samlController);
  app.use('/saml', samlRouter.getRouter());

  return app;
};

export { createApp };
