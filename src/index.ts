import dotenv from 'dotenv'
import { Express } from 'express';

import { createApp } from './app.ts';
import { port } from './constants.ts';
import logger from './logger.ts';

dotenv.config()

createApp().then((app: Express) => {
  app.listen(port, () => {
    logger.info(`server is up at http://localhost:${port}`);
  });
});
