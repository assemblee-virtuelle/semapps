const jsigs = require('jsonld-signatures');
const {
  purposes: { AssertionProofPurpose }
} = require('jsonld-signatures');
const { cryptosuite } = require('@digitalbazaar/eddsa-rdfc-2022-cryptosuite');
const { DataIntegrityProof } = require('@digitalbazaar/data-integrity');
/** @type {import('@digitalbazaar/ed25519-multikey')} */
const Ed25519Multikey = require('@digitalbazaar/ed25519-multikey');
const { KEY_TYPES } = require('../constants');

/**
 * Data integrity service for signing objects using the [VC data integrity spec](https://www.w3.org/TR/vc-data-integrity/).
 *
 * Currently, the only supported suite is the eddsa-rdfc-2022-cryptosuite.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const DataIntegrityService = {
  name: 'crypto.vc.data-integrity',
  dependencies: ['ldp', 'api'],

  async started() {
    this.documentLoader = async (url, options) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };
  },

  actions: {
    /**
     * Verify an object.
     * @param {object} ctx.params.object - The object to verify.
     */
    verifyObject: {
      params: {
        object: { type: 'object' },
        options: {
          type: 'object',
          optional: true,
          params: {
            proofPurpose: { type: 'string', default: 'assertionMethod' }
          }
        },
        purpose: { type: 'object', optional: true }
      },
      async handler(ctx) {
        const {
          object,
          options: { proofPurpose: method = 'assertionMethod' } = {},
          purpose = new AssertionProofPurpose({ term: method })
        } = ctx.params;

        const suite = new DataIntegrityProof({
          cryptosuite
        });

        return jsigs.verify(object, { purpose, documentLoader: this.documentLoader, suite });
      }
    },

    /**
     * Sign an object.
     * @param {object} ctx.params.object - The object to sign.
     * @param {object} [ctx.params.purpose] - The purpose of the signing.
     * @param {string} [ctx.params.webId] - The webId of the signer.
     * @param {object} [ctx.params.keyObject] - The key object to use.
     * @param {string} [ctx.params.keyId] - The key ID to use.
     */
    signObject: {
      params: {
        object: { type: 'object' },
        options: { type: 'object', optional: true, params: { proofPurpose: { type: 'string', optional: true } } },
        purpose: { type: 'object', optional: true },
        webId: { type: 'string', optional: true },
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          object,
          options: { proofPurpose: method = 'assertionMethod' } = {},
          purpose = new AssertionProofPurpose({ term: method }),
          webId = ctx.meta.webId,
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
        const signingKeyInstance = await Ed25519Multikey.from({ ...key, type: 'Multikey' });

        const suite = new DataIntegrityProof({
          signer: signingKeyInstance.signer(),
          cryptosuite
        });

        return jsigs.sign(object, { purpose, documentLoader: this.documentLoader, suite });
      }
    }
  }
};

module.exports = DataIntegrityService;
