// @ts-expect-error TS(7016): Could not find a declaration file for module 'json... Remove this comment to see the full error message
import jsigs from 'jsonld-signatures';

// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { cryptosuite } from '@digitalbazaar/eddsa-rdfc-2022-cryptosuite';
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';

<<<<<<< HEAD
/** @type {import('@digitalbazaar/ed25519-multikey')} */
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
=======
// @ts-expect-error TS(7016): Could not find a declaration file for module '@dig... Remove this comment to see the full error message
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
>>>>>>> 2.0

import { ServiceSchema } from 'moleculer';
import { KEY_TYPES } from '../constants.ts';

const {
  purposes: { AssertionProofPurpose }
} = require('jsonld-signatures');

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
  name: 'crypto.vc.data-integrity' as const,
  dependencies: ['ldp', 'api'],

  async started() {
    this.documentLoader = async (url: any, options: any) => {
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
        // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
        object: { type: 'object' },
        options: {
          type: 'object',
          optional: true,
          params: {
            // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
            proofPurpose: { type: 'string', default: 'assertionMethod' }
          }
        },
        // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
        object: { type: 'object' },
        options: { type: 'object', optional: true, params: { proofPurpose: { type: 'string', optional: true } } },
        // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
        purpose: { type: 'object', optional: true },
        webId: { type: 'string', optional: true },
        // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
        keyObject: { type: 'object', optional: true },
        keyId: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const {
          object,
          options: { proofPurpose: method = 'assertionMethod' } = {},
          purpose = new AssertionProofPurpose({ term: method }),
          // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
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
} satisfies ServiceSchema;

export default DataIntegrityService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [DataIntegrityService.name]: typeof DataIntegrityService;
    }
  }
}
