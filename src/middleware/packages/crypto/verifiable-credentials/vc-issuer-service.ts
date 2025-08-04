import { MIME_TYPES } from '@semapps/mime-types';

const {
  purposes: { AssertionProofPurpose }
} = require('jsonld-signatures');

import { cryptosuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import vc from '@digitalbazaar/vc';

/** @type {import('@digitalbazaar/ed25519-multikey')} */
import Ed25519Multikey from '@digitalbazaar/ed25519-multikey';

import { KEY_TYPES, credentialsContext } from '../constants.ts';

/**
 * Service for verifying, reading, and revoking Verifiable Credentials.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCCredentialService = {
  name: 'crypto.vc.issuer',
  settings: {
    podProvider: null
  },

  async started() {
    this.documentLoader = async (url, options) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };
  },

  actions: {
    /**
     * # Create a Verifiable Credential.
     *
     * Set param `noAnonRead` to `true` to prevent anonymous read access to the credential.
     * Since the credential URIs are unguessable this is not always necessary.
     *
     *
     * ## Create a capability Verifiable Credential.
     *
     * Use the credentialSubject to express statements that authorize the holder of the capability.
     *
     * Use `credentialSubject.id` to set the holder of the capability.
     * Do not set `credentialSubject.id`, to allow any holder to present the capability.
     * The capability validator (@see VCCapabilityPresentationProofPurpose ) will check the holder of the capability
     * and does not allow more than one delegation step (presenting more than one capability VC) when the holder is
     * anonymous.
     *
     * @param {object} ctx.params - The parameters for creating the VC.
     * @returns {object} The signed credential.
     */
    createVC: {
      params: {
        credential: {
          type: 'object',
          params: {
            credentialSubject: { type: 'object' },
            '@context': { type: 'string', optional: true },
            id: { type: 'string', optional: true },
            type: { type: 'multi', rules: [{ type: 'string' }, { type: 'array', items: 'string' }], optional: true },
            validFrom: { type: 'string', optional: true },
            validUntil: { type: 'string', optional: true },
            proof: { type: 'multi', optional: true, rules: [{ type: 'object' }, { type: 'array', items: 'object' }] }
          }
        },
        options: {
          type: 'object',
          default: {},
          params: {
            proofPurpose: { type: 'object', optional: true }
          }
        },
        webId: { type: 'string', optional: true },
        noAnonRead: { type: 'boolean', optional: true, default: false },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          credential: receivedCredential,
          options: { proofPurpose = 'assertionMethod' },
          webId = ctx.meta.webId,
          noAnonRead = false,
          purpose = new AssertionProofPurpose({ term: proofPurpose }),
          keyObject = undefined,
          keyId = undefined
        } = ctx.params;

        const key = await ctx.call('keys.getMultikey', {
          webId,
          keyObject,
          keyId,
          keyType: KEY_TYPES.ED25519,
          withPrivateKey: true
        });
        // The library requires the key to have the type field set to `Multikey` only.
        const signingKeyInstance = await Ed25519Multikey.from(key);

        const credential = {
          '@context': credentialsContext,
          type: ['VerifiableCredential'],
          issuer: webId,
          ...receivedCredential
        };

        // Create the VC resource, if the id is not set.
        const credentialResource = credential.id
          ? credential
          : await this.createCredentialResource(credential, noAnonRead, webId);

        // Get signature suite
        const suite = new DataIntegrityProof({
          signer: signingKeyInstance.signer(),
          cryptosuite
        });

        // Sign credential
        const signedCredential = await vc.issue({
          credential: credentialResource,
          documentLoader: this.documentLoader,
          purpose,
          suite
        });

        // Update resource to add the signatures, if the id had not been set.
        if (!receivedCredential.id)
          await ctx.call(
            'crypto.vc.issuer.credential-container.put',
            { resource: signedCredential, contentType: MIME_TYPES.JSON, webId: 'system' },
            { meta: { skipEmitEvent: true } }
          );

        return signedCredential;
      }
    }
  },
  methods: {
    /** Creates an ldp resource from the presentation and sets rights. */
    async createCredentialResource(credential, noAnonRead, webId) {
      const resourceUri = await this.broker.call('crypto.vc.issuer.credential-container.post', {
        resource: credential,
        contentType: MIME_TYPES.JSON,
        webId
      });

      // Get the presentation resource.
      const resource = await this.broker.call('crypto.vc.issuer.credential-container.get', {
        resourceUri,
        jsonContext: credentialsContext,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      // Set resource rights.
      if (!noAnonRead) {
        // Add anonymous read rights to VC resource and control rights to holder.
        await this.broker.call('webacl.resource.addRights', {
          resourceUri,
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

export default VCCredentialService;
