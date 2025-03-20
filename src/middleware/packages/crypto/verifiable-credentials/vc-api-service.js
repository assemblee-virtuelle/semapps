const { parseHeader, negotiateAccept, parseJson } = require('@semapps/middlewares');
const path = require('node:path');
const { VC_API_PATH } = require('../constants');

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
  name: 'crypto.vc.api',
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
        authorization: false,
        authentication: true,
        aliases: {
          'POST /verify': [...middlewares, 'crypto.vc.data-integrity.verifyObject'],
          'POST /sign': [...middlewares, 'crypto.vc.data-integrity.signObject']
        }
      }
    });
  }
};

module.exports = VCApiService;
