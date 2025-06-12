const { randomUUID } = require('node:crypto');
const { MIME_TYPES } = require('@semapps/mime-types');
const {
  purposes: { AuthenticationProofPurpose }
} = require('jsonld-signatures');
const { cryptosuite } = require('@digitalbazaar/eddsa-rdfc-2022-cryptosuite');
const { DataIntegrityProof } = require('@digitalbazaar/data-integrity');
const vc = require('@digitalbazaar/vc');
/** @type {import('@digitalbazaar/ed25519-multikey')} */
const Ed25519Multikey = require('@digitalbazaar/ed25519-multikey');
const { KEY_TYPES, credentialsContext } = require('../constants');

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
        const presentation = {
          ...vc.createPresentation({
            '@context': credentialsContext,
            type: ['VerifiablePresentation'],
            id: !presentationParam.id && !ctx.params.options.persist && `urn:uuid:${randomUUID()}`,
            ...presentationParam,
            holder: presentationParam?.holder || webId
          })
        };

        // Create the VP resource, if the id is not set.
        const presentationWithId = presentation.id
          ? presentation
          : await this.createPresentationResource(presentation, noAnonRead, webId);

        // Sign presentation.
        const signedPresentation = await vc.signPresentation({
          presentation: presentationWithId,
          suite,
          challenge,
          purpose,
          documentLoader: this.documentLoader
        });

        // Update resource to add the signatures, if the id had not been set.

        if (!presentationParam.id && ctx.params.options.persist)
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
