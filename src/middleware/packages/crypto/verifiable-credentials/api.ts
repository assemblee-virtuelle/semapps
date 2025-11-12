import {
  parseHeader,
  parseRawBody,
  negotiateAccept,
  negotiateContentType,
  parseJson,
  saveDatasetMeta
} from '@semapps/middlewares';
import path from 'node:path';
import { ServiceSchema } from 'moleculer';
import { VC_API_PATH } from '../constants.ts';

const middlewares = [saveDatasetMeta, parseHeader, negotiateAccept, negotiateContentType, parseRawBody, parseJson];

/**
 *
 * Verifiable Credentials API Service.
 *
 * This service implements (parts of) the
 * [VC API spec](https://w3c-ccg.github.io/vc-api/) v0.3.
 *
 * WARNING: Changing things here can have security implications
 */
const ApiService = {
  name: 'vc.api' as const,
  dependencies: ['api', 'ldp'],
  async started() {
    const basePath: string = await this.broker.call('ldp.getBasePath');
    const apiPath = path.join(basePath, '/:username([^/.][^/]+)', VC_API_PATH);

    // Credential routes.
    await this.broker.call('api.addRoute', {
      route: {
        name: 'vc.credentials',
        path: path.join(apiPath, 'credentials'),
        authentication: true,
        aliases: {
          'POST /verify': [...middlewares, 'vc.verifier.verifyVC'],
          'POST /issue': [...middlewares, 'vc.issuer.createVC']
        }
      }
    });

    // Presentation routes.
    await this.broker.call('api.addRoute', {
      route: {
        name: 'vc.presentations',
        path: path.join(apiPath, 'presentations'),
        authentication: true,
        aliases: {
          'POST /': [...middlewares, 'vc.holder.createPresentation'],
          'POST /verify': [...middlewares, 'vc.verifier.verifyPresentation'],
          'POST /verify-capability': [...middlewares, 'vc.verifier.verifyCapabilityPresentation']
        }
      }
    });

    // Challenges route.
    await this.broker.call('api.addRoute', {
      route: {
        name: 'vc.challenges',
        path: path.join(apiPath, 'challenges'),
        authorization: false,
        authentication: false,
        aliases: {
          'POST /': [...middlewares, 'vc.challenge.create']
        }
      }
    });

    // Data integrity routes.
    await this.broker.call('api.addRoute', {
      route: {
        name: 'vc.data-integrity',
        path: path.join(apiPath, 'data-integrity'),
        authentication: true,
        aliases: {
          'POST /verify': [...middlewares, 'vc.data-integrity.verifyObject'],
          'POST /sign': [...middlewares, 'vc.data-integrity.signObject']
        }
      }
    });
  }
} satisfies ServiceSchema;

export default ApiService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ApiService.name]: typeof ApiService;
    }
  }
}
