import { parseHeader, negotiateAccept, parseJson } from '@semapps/middlewares';
import path from 'node:path';
import { ServiceSchema } from 'moleculer';

const middlewares = [parseHeader, parseJson, negotiateAccept];

/**
 *
 * Verifiable Credentials API Service.
 *
 * This service implements (parts of) the
 * [VC API spec](https://w3c-ccg.github.io/vc-api/) v0.3.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCApiService = {
  name: 'crypto.vc.api' as const,
  dependencies: ['api', 'ldp'],
  settings: {
    podProvider: null
  },
  created() {
    if (this.settings.podProvider === null) {
      throw new Error('No pod provider set.');
    }
  },
  async started() {
    const basePath = await this.broker.call('ldp.getBasePath');
    const apiPath = path.join(basePath, this.settings.podProvider ? '/:username([^/.][^/]+)' : '', VC_API_PATH);

    // Credential routes.
    await this.broker.call('api.addRoute', {
      route: {
        name: 'vc.credentials',
        path: path.join(apiPath, 'credentials'),
        authentication: true,
        aliases: {
          'POST /verify': [...middlewares, 'crypto.vc.verifier.verifyVC'],
          'POST /issue': [...middlewares, 'crypto.vc.issuer.createVC']
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
          'POST /': [...middlewares, 'crypto.vc.holder.createPresentation'],
          'POST /verify': [...middlewares, 'crypto.vc.verifier.verifyPresentation'],
          'POST /verify-capability': [...middlewares, 'crypto.vc.verifier.verifyCapabilityPresentation']
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
          'POST /': [...middlewares, 'crypto.vc.presentation.challenge.create']
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
          'POST /verify': [...middlewares, 'crypto.vc.data-integrity.verifyObject'],
          'POST /sign': [...middlewares, 'crypto.vc.data-integrity.signObject']
        }
      }
    });
  }
} satisfies ServiceSchema;

export default VCApiService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [VCApiService.name]: typeof VCApiService;
    }
  }
}
