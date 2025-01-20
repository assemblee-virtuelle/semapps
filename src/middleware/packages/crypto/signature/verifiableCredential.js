const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');

const { ServiceSchema } = require('moleculer');
const {
  createPresentation,
  issue,
  signPresentation,
  verify: verifyPresentation,
  verifyCredential
} = require('@digitalbazaar/vc');
const { cryptosuite } = require('@digitalbazaar/eddsa-rdfc-2022-cryptosuite');

const { DataIntegrityProof } = require('@digitalbazaar/data-integrity');
const { createSign, createHash, randomUUID } = require('crypto');
const { parseRequest, verifySignature } = require('http-signature');
const { createAuthzHeader, createSignatureString } = require('http-signature-header');
const jsonld = require('jsonld');
const KEY_TYPES = require('../keys/keyTypes');
// import { Errors as E } from 'moleculer-web';
const { arrayOf } = require('../utils');

// TODO: How do we ensure to attach the right context?
const context = [
  'https://www.w3.org/ns/credentials/v2',
  'https://w3id.org/security/v2',
  {
    parentProofValue: 'http://activitypods.org/ns/core#parentProofValue'
  }
];

/** @type {ServiceSchema} */
const SignatureService = {
  name: 'signature.vc',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/credentials',
    excludeFromMirror: true,
    activateTombstones: false,
    permissions: {},
    newResourcesPermissions: {},
    description: {
      labelMap: {
        en: 'Credentials'
      },
      internal: true
    }
  },

  started() {
    this.documentLoader = async (url, options) => {
      return await this.broker.call('jsonld.document-loader.loadWithCache', { url, options });
    };
  },
  actions: {
    async verifyVC(ctx) {
      const { credential, webId = ctx.meta.webId, proofPurpose = 'assertionMethod' } = ctx.params;

      const suite = new DataIntegrityProof({
        cryptosuite
      });

      const verificationResult = await verifyCredential({
        credential,
        documentLoader: this.documentLoader,
        // purpose: proofPurpose,
        suite
      });
      return verificationResult;
    },

    async verifyPresentation(ctx) {
      const { credential, webId = ctx.meta.webId, proofPurpose } = ctx.params;

      // TODO: Get the key from the service as json, parse to signing key object here.
      // This way, we don't have the dependency on the digitalbazaar service.
      const key = await ctx.call('keys.getSigningMultikeyInstance', { webId, keyType: KEY_TYPES.ED25519 });
      const suite = new DataIntegrityProof({
        signer: key.signer(),
        cryptosuite
      });

      const verificationResult = await verifyPresentation({
        credential,
        documentLoader: this.documentLoader,
        // purpose: proofPurpose,
        suite
      });
      return verificationResult;
      // Step 2 (somewhere else):
      //  Do the verificationSubject check (business logic)
    },

    /**
     * Create a Verifiable Credential.
     *
     * VCs have a resolvable (non-guessable) URI and are publicly readable by default.
     * Set `noAnonRead` to `true`, to prevent this.
     * @param {} ctx
     * @returns
     */
    async createVC(ctx) {
      const {
        validFrom,
        validUntil,
        subject,
        webId = ctx.meta.webId,
        name,
        description,
        noAnonRead = false,
        // proofPurpose = 'assertionMethod',
        additionalCredentialProps = {}
      } = ctx.params;

      const key = await ctx.call('keys.getSigningMultikeyInstance', {
        webId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });
      // TODO: Read about difference between issuer and verification method
      //  and how I get the verificationMethod to have the public key uri!

      const credential = {
        '@type': 'VerifiableCredential', // Another one like ActivityCapability?
        '@context': context,
        issuer: webId,
        validFrom,
        validUntil,
        name,
        description,
        credentialSubject: subject,
        ...additionalCredentialProps
        // We don't take the following into account:
        //  status, credentialSchema, refreshService, termsOfUse, evidence
      };

      // Create the resource
      const resourceUri = await this.actions.post(
        {
          // containerUri,
          resource: credential,
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        },
        { parentCtx: ctx }
      );
      const resource = await ctx.call('ldp.resource.get', {
        resourceUri,
        jsonContext: context,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      // Add anonymous read rights by default.
      if (!noAnonRead)
        await ctx.call('webacl.resource.addRights', {
          resourceUri,
          additionalRights: { anon: { read: true } },
          webId: 'system'
        });

      const suite = new DataIntegrityProof({
        signer: key.signer(),
        cryptosuite
      });

      const signedCredential = await issue({
        credential: resource,
        documentLoader: this.documentLoader,
        // purpose: proofPurpose,
        suite
      });

      // Update resource to add the signatures.
      await ctx.call(
        'ldp.resource.put',
        { resource: signedCredential, contentType: MIME_TYPES.JSON, webId: 'system' },
        { meta: { skipEmitEvent: true } }
      );

      return signedCredential;
    },

    /**
     * Create a capability Verifiable Credential.
     *
     * Same parameters as createVC.
     * Use `subject` param to express information about the capability.
     */
    async createCapability(ctx) {
      return ctx.call('signature.createVC', { ...ctx.params, proofPurpose: 'capabilityDelegation' });
    },

    /**
     * Given a parent VC capability, create a VC capability with a parent capability.
     * Params same as for `createCapability` but with a VC parentCapability param added.
     * @param {*} ctx
     */
    async createDelegatedCapability(ctx) {
      const { parentCapability, subject } = ctx.params;

      await ctx.call('signature.createCapability', {
        ...ctx.params,
        subject: {
          ...subject,
          parentCapability: parentCapability.id,
          parentProofValue: arrayOf(parentCapability.proof).map(proof => proof.proofValue)
        }
      });
    }
  },
  methods: {
    //
  }
};

module.exports = SignatureService;
