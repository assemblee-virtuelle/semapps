const { ControlledContainerMixin } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const {
  createPresentation,
  issue,
  signPresentation,
  verify: verifyPresentation,
  verifyCredential
} = require('@digitalbazaar/vc');
const { cryptosuite } = require('@digitalbazaar/eddsa-rdfc-2022-cryptosuite');
const { DataIntegrityProof } = require('@digitalbazaar/data-integrity');
const { randomUUID } = require('node:crypto');
const jsigs = require('jsonld-signatures');

const {
  purposes: { AssertionProofPurpose }
} = jsigs;

const KEY_TYPES = require('../keys/keyTypes');
// import { Errors as E } from 'moleculer-web';
const { arrayOf, orderLinearGraph } = require('../utils');

// TODO: How do we ensure to attach the right context?
const context = [
  'https://www.w3.org/ns/credentials/v2',
  'https://w3id.org/security/v2',
  {
    parentProof: 'http://activitypods.org/ns/core#parentProof'
  }
];

/** @type {ServiceSchema} */
const SignatureService = {
  name: 'signature.data-integrity',
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
    async verifyObject(ctx) {
      const { object, purpose = new AssertionProofPurpose() } = ctx.params;

      const suite = new DataIntegrityProof({
        cryptosuite
      });

      return jsigs.verify(object, { purpose, documentLoader: this.documentLoader, suite });
    },

    async verifyVC(ctx) {
      const { credential, purpose = new AssertionProofPurpose() } = ctx.params;

      const suite = new DataIntegrityProof({
        cryptosuite
      });

      const verificationResult = await verifyCredential({
        credential,
        documentLoader: this.documentLoader,
        purpose,
        suite
      });

      return verificationResult;
    },

    async verifyPresentation(ctx) {
      const { presentation, challenge = '', purpose = new AssertionProofPurpose() } = ctx.params;

      const suite = new DataIntegrityProof({
        cryptosuite
      });

      const verificationResult = await verifyPresentation({
        presentation,
        presentationPurpose: purpose,
        challenge,
        suite,
        documentLoader: this.documentLoader
      });

      return verificationResult;
    },

    async signObject(ctx) {
      const {
        object,
        purpose = new AssertionProofPurpose(),
        webId = ctx.meta.webId,
        keyObject = undefined,
        keyId = undefined
      } = ctx.params;

      const key = await ctx.call('keys.getMultikeyInstance', {
        webId,
        keyObject,
        keyId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });

      const suite = new DataIntegrityProof({
        signer: key.signer(),
        cryptosuite
      });

      return jsigs.sign(object, { purpose, documentLoader: this.documentLoader, suite });
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
        purpose = new AssertionProofPurpose(),
        additionalCredentialProps = {},
        keyObject = undefined,
        keyId = undefined
      } = ctx.params;

      const key = await ctx.call('keys.getMultikeyInstance', {
        webId,
        keyObject,
        keyId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });

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

      // Create the VC resource
      const resourceUri = await this.actions.post(
        {
          resource: credential,
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        },
        { parentCtx: ctx }
      );

      const credentialResource = await ctx.call('ldp.resource.get', {
        resourceUri,
        jsonContext: context,
        webId: 'system',
        accept: MIME_TYPES.JSON
      });

      // Add anonymous read rights to VC resource by default.
      if (!noAnonRead)
        await ctx.call('webacl.resource.addRights', {
          resourceUri,
          additionalRights: { anon: { read: true } },
          webId: 'system'
        });

      // Get signature suite
      const suite = new DataIntegrityProof({
        signer: key.signer(),
        cryptosuite
      });

      // Sign credential
      const signedCredential = await issue({
        credential: credentialResource,
        documentLoader: this.documentLoader,
        purpose,
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

    async createPresentation(ctx) {
      const {
        verifiableCredential,
        additionalPresentationProps = {},
        challenge = '',
        webId = ctx.meta.webId,
        purpose = new AssertionProofPurpose(),
        keyObject = undefined,
        keyId = undefined
      } = ctx.params;

      // Get keys and suite required for signing.
      const key = await ctx.call('keys.getMultikeyInstance', {
        webId,
        keyObject,
        keyId,
        keyType: KEY_TYPES.ED25519,
        withPrivateKey: true
      });
      const suite = new DataIntegrityProof({
        signer: key.signer(),
        cryptosuite
      });

      // Create presentation.
      const presentation = createPresentation({
        verifiableCredential,
        holder: webId,
        id: `urn:uuid:${randomUUID()}`
      });

      // Sign presentation.
      const signedPresentation = await signPresentation({
        presentation: {
          ...presentation,
          // '@context': context,
          ...additionalPresentationProps
        },
        suite,
        challenge,
        purpose,
        documentLoader: this.documentLoader
      });

      return signedPresentation;
    },

    /**
     * Given a parent VC capability, create a delegated VC with a parent VC.
     * Same params as createVC but VC is created with type CapabilityCredential.
     * And optional param `parentCapability` param is optional to link to the parent.
     * @param {*} ctx
     */
    async createCapability(ctx) {
      const { parentCapability, subject } = ctx.params;

      // We could add type CapabilityCredential...
      return await ctx.call('signature.data-integrity.createVC', {
        ...ctx.params,
        subject: {
          ...subject,
          parentCapability: parentCapability?.id // Do we even need this? It's nice to have.
        }
      });
    },

    async verifyCapabilityPresentation(ctx) {
      const { presentation } = ctx.params;
      const presentationResult = await this.actions.verifyPresentation(ctx.params);

      if (!presentationResult.verified) {
        return presentationResult;
      }

      const credentialOrder = orderLinearGraph(
        arrayOf(presentation.verifiableCredential).map(cred => ({
          id: cred.id,
          nextId: cred.credentialSubject.parentCapability,
          cred
        }))
      );

      if (credentialOrder === null) {
        return {
          verified: false,
          error:
            'The signatures were correct but the credentials were not composed of a delegation chain with `parentCapability` (e.g. parent VC <- delegated VC <- sub-delegated VC.'
        };
      }

      return { verified: true, error: undefined, credentialsOrdered: credentialOrder.map(obj => obj.cred) };
    }
  },
  methods: {
    //
  }
};

module.exports = SignatureService;
