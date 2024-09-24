import { Client } from '@elastic/elasticsearch';
import { Request, Response } from 'express';

import logger from '../logger.ts';

class HomeController {

  async index(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      return res.render('home/index');
    }

    const client = new Client(
      {
        node: process.env.ELASTIC_ENDPOINT,
        auth: {
          bearer: req.session.user.access_token,
        }
      }
    );

    const authenticateResponse = await client.info()

    return res.render('home/index', { data: JSON.stringify(authenticateResponse, null, 2) });
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        logger.error(`${this.constructor.name}: unable to destroy session:`, { error: err });
      }
      return res.redirect('/');
    });
  }
}

export default HomeController;
