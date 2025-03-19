const { randomUUID } = require('node:crypto');
const { MIME_TYPES } = require('@semapps/mime-types');
const path = require('node:path');
const jsigs = require('jsonld-signatures');
const VCPresentationContainer = require('./vc-presentation-container');

const {
  purposes: { AuthenticationProofPurpose }
} = jsigs;

let cryptosuite;
let DataIntegrityProof;
let vc;
/** @type {import('@digitalbazaar/ed25519-multikey')} */
let Ed25519Multikey;
(async () => {
  vc = await import('@digitalbazaar/vc');

  ({ cryptosuite } = await import('@digitalbazaar/eddsa-rdfc-2022-cryptosuite'));
  ({ DataIntegrityProof } = await import('@digitalbazaar/data-integrity'));
  Ed25519Multikey = await import('@digitalbazaar/ed25519-multikey');
})();

const { KEY_TYPES, credentialsContext, VC_API_PATH } = require('../constants');

/**
 * Service for verifying and creating Verifiable Presentations
 * as well as verifying capabilities created with Verifiable Credentials.
 * For more information see the VC API spec
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCHolderService = {
  name: 'crypto.vc.holder',
  dependencies: ['jsonld', 'jsonld.context'],
  settings: {
    podProvider: null
  },
  created() {
    const { podProvider } = this.settings;
    this.broker.createService({
      mixins: [VCPresentationContainer],
      settings: { path: path.join(VC_API_PATH, 'credentials'), podProvider }
    });
  },
  async started() {
    this.documentLoader = async (url, options) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };
  },

  actions: {
    /**
     * Create a presentation.
     * @param {object} ctx.params - The parameters for creating the presentation.
     * @returns {object} The signed presentation.
     */
    createPresentation: {
      params: {
        presentation: {
          type: 'object',
          params: {
            verifiableCredential: { type: 'multi', rules: [{ type: 'array' }, { type: 'object' }] },
            '@context': { type: 'string', optional: true },
            id: { type: 'string', optional: true },
            type: { type: 'string', optional: true }
          }
        },
        options: {
          type: 'object',
          params: {
            challenge: { type: 'string' },
            domain: { type: 'string', optional: true },
            proofPurpose: { type: 'string', optional: true },
            persist: { type: 'boolean', default: false }
          }
        },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true },
        noAnonRead: { type: 'boolean', default: false },
        webId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          presentation: presentationParam,
          options: { challenge, domain, proofPurpose = 'assertionMethod' },
          webId = ctx.meta.webId,
          keyObject = undefined,
          keyId = undefined,
          noAnonRead = false
        } = ctx.params;
        const purpose = new AuthenticationProofPurpose({ term: proofPurpose, challenge, domain });

        const key = await ctx.call('keys.getMultikey', {
          webId,
          keyObject,
          keyId,
          keyType: KEY_TYPES.ED25519,
          withPrivateKey: true
        });
        // The library requires the key to have the type field set to `Multikey` only.
        const signingKeyInstance = await Ed25519Multikey.from({ ...key, type: 'Multikey' });

        const suite = new DataIntegrityProof({
          signer: signingKeyInstance.signer(),
          cryptosuite
        });

        // Create presentation.
        const vcPresentation = {
          ...vc.createPresentation({
            '@context': credentialsContext,
            type: ['VerifiablePresentation'],
            ...presentationParam,
            holder: presentationParam?.holder || webId
          })
        };

        // Create an ephemeral id, if none given and persist is false.
        if (!presentationParam.id && !ctx.params.persist) presentationParam.id = randomUUID();

        // Create the VP resource, if the id is not set and persist is true.
        const unsignedPresentation = presentationParam.id
          ? vcPresentation
          : await this.createPresentationResource(vcPresentation, noAnonRead);

        // Sign presentation.
        const signedPresentation = await vc.signPresentation({
          presentation: unsignedPresentation,
          suite,
          challenge,
          purpose,
          documentLoader: this.documentLoader
        });

        // Update resource to add the signatures, if the id had not been set.

        if (!presentationParam.id)
          await ctx.call(
            'crypto.vc.holder.presentation-container.put',
            { resource: signedPresentation, contentType: MIME_TYPES.JSON, webId: 'system' },
            { meta: { skipEmitEvent: true } }
          );

        return signedPresentation;
      }
    }
  },

  methods: {
    /** Creates an ldp resource from the presentation and sets rights. */
    async createPresentationResource(presentation, noAnonRead, webId) {
      // Post presentation to container (will add metadata).
      const resourceUri = await this.broker.call('crypto.vc.holder.presentation-container.post', {
        resource: presentation,
        contentType: MIME_TYPES.JSON,
        webId
      });

      // Get the presentation resource.
      const resource = await this.broker.call('crypto.vc.holder.presentation-container.get', {
        resourceUri,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      // Set resource rights.
      if (!noAnonRead) {
        // Add anonymous read rights to VC resource and control rights to holder.
        await this.broker.call('webacl.resource.addRights', {
          resourceUri,
          jsonContext: credentialsContext,
          additionalRights: { anon: { read: true }, user: { uri: webId, control: true, read: true, write: true } },
          webId: 'system'
        });
      } else {
        // Add user control rights only.
        await this.broker.call('webacl.resource.addRights', {
          resourceUri,
          additionalRights: { user: { uri: webId, control: true, read: true, write: true } },
          webId: 'system'
        });
      }

      return resource;
    }
  }
};

module.exports = VCHolderService;
