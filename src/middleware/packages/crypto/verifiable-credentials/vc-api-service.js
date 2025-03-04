const { parseHeader, negotiateAccept, parseJson } = require('@semapps/middlewares');
const { namedNode, triple, blankNode } = require('@rdfjs/data-model');
const path = require('node:path');
const { VC_API_SERVICE_TYPE } = require('../constants');

const middlewares = [parseHeader, parseJson, negotiateAccept];

/**
 *
 * Verifiable Credentials API Service.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCApiService = {
  name: 'crypto.vc.api',
  dependencies: ['api', 'ldp'],
  settings: {
    /** Changing this will break existing references in webId documents to the VC API. */
    vcApiPath: null,
    podProvider: null
  },
  created() {
    if (this.settings.podProvider === null) {
      throw new Error('No pod provider set.');
    }
  },
  async started() {
    const basePath = await this.broker.call('ldp.getBasePath');
    const apiPath = path.join(
      basePath,
      this.settings.podProvider ? '/:username([^/.][^/]+)' : '',
      this.settings.vcApiPath
    );

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
  },

  events: {
    /**
     * Registers the location of the VC api for the webId.
     *
     * Note: The VC API is still in specification and discovery has not been standardized.
     * See: https://github.com/w3c-ccg/vc-api/issues/459
     *
     * TODO: Write job to attach those triples to existing webIds.
     */
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;

      const vcApiUri = this.settings.podProvider
        ? path.join(webId, this.settings.vcApiPath)
        : path.join(await this.broker.call('ldp.getBaseUrl'), this.settings.vcApiPath);

      // Attach the storage URL to the webId
      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToAdd: [
          triple(namedNode(webId), namedNode('https://www.w3.org/ns/did#service'), blankNode('b0')),
          triple(
            blankNode('b0'),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode(VC_API_SERVICE_TYPE)
          ),
          triple(blankNode('b0'), namedNode('https://www.w3.org/ns/did#serviceEndpoint'), namedNode(vcApiUri))
        ],
        webId: 'system'
      });
    }
  }
};

module.exports = VCApiService;
