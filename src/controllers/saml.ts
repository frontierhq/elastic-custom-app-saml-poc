import { Client } from '@elastic/elasticsearch';
import { Request, Response } from 'express';
import * as prettier from 'prettier';
import zlib from 'zlib'

import logger from '../logger.ts';

class AuthController {
  client: Client;

  constructor() {
    this.client = new Client(
      {
        node: process.env.ELASTIC_ENDPOINT,
        auth: {
          username: process.env.ELASTIC_USERNAME || '',
          password: process.env.ELASTIC_PASSWORD || '',
        }
      }
    );

    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response) {
    let redirectUrl;
    let samlRequestData;
    try {
      const samlPrepareResponse = await this.client.security.samlPrepareAuthentication({
        realm: 'saml2',
      })
      redirectUrl = new URL(samlPrepareResponse.redirect);
      const relayState = {
        id: samlPrepareResponse.id,
        realm: samlPrepareResponse.realm,
      }
      redirectUrl.searchParams.set('relayState', Buffer.from(JSON.stringify(relayState)).toString('base64'));

      samlRequestData = redirectUrl.searchParams.get('SAMLRequest');
      if (!samlRequestData) {
        throw new Error('SAMLRequest parameter not found in elasticsearch response');
      }
    } catch (error) {
      logger.error(`${this.constructor.name}: unable to prepare saml request:`, { error });
      return res.status(500).send(error)
    }

    try {
      const samlRequest = zlib.inflateRawSync(Buffer.from(samlRequestData, 'base64'));

      const prettySamlRequest = await prettier.format(samlRequest.toString('utf-8'), { parser: 'xml', plugins: ['@prettier/plugin-xml'] });
      logger.info(`${this.constructor.name}: prepared saml request:`, { data: prettySamlRequest });
    } catch (error) {
      logger.warn(`${this.constructor.name}: unable to parse saml request:`, { error });
    }

    logger.info(`${this.constructor.name}: redirecting to identity provider:`, { data: redirectUrl.toString() });
    return res.redirect(redirectUrl.toString())
  }
}

export default AuthController;
