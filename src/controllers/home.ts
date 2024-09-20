import { Request, Response } from 'express';

import logger from '../logger.ts';

class HomeController {

  async get(req: Request, res: Response) {
    logger.info('GET /');
    return res.render('home/index')
  }
}

export default HomeController;
