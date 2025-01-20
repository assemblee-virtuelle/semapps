const { multiKey } = require('@semapps/ontologies');

const { ControlledContainerMixin } = require('@semapps/ldp');
const { Errors: E } = require('moleculer-web');
const { arrayOf } = require('../utils');
const KEY_TYPES = require('./keyTypes');

/**
 * DANGER ZONE
 *
 * Container to store the private keys of actors.
 *
 * Watch out with permissions. This should be strictly limited to the owner and privileged apps.
 * @type {import('moleculer').ServiceSchema}
 */
module.exports = {
  name: 'keys.container',
  mixins: [ControlledContainerMixin],
  settings: {
    path: '/key',
    acceptedTypes: Object.values(KEY_TYPES),
    permissions: (webId, ctx) => {
      // If not a pod provider, the container is shared, so any user can append.
      return {
        anyUser: {
          // `this` is not available here.
          read: !ctx.service.settings.podProvider,
          append: !ctx.service.settings.podProvider
        }
      };
    },
    newResourcesPermissions: webId => {
      if (webId === 'anon' || webId === 'system') throw new Error('Key resource must be created for registered webId.');

      return {
        user: {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      };
    },
    excludeFromMirror: true,
    // Disallow PATCH & PUT, to prevent keys from being overwritten
    controlledActions: {
      get: 'keys.container.get', // Returns key object with context and type required by Multikey spec.
      put: 'keys.container.forbidden',
      patch: 'keys.container.forbidden',
      delete: 'keys.delete' // Handles deletion of public key as well.
    },
    description: {
      labelMap: {
        en: 'Private Keys',
        fr: 'Clés privées'
      },
      internal: true
    }
  },
  actions: {
    async forbidden(ctx) {
      throw new E.ForbiddenError();
    },
    /**
     * Get action that sets the multikey context and multikey type for those keys. This is required by the spec.
     * This Action is used by the public key container as well.
     */
    async get(ctx) {
      const resource = await ctx.call('ldp.resource.get', ctx.params);

      if (arrayOf(resource.type || resource['@type']).includes('sec:Multikey')) {
        // By the specs (see below), the type of a multikey should have type multikey
        //  and a protected context defining multikey. Unfortunately, @digitalbazaar/ed25519-multikey": "^1.3.0" is stricter.
        //  Thus the separate handling for multikeys...
        // https://www.w3.org/TR/controller-document/#json-ld-context
        // https://www.w3.org/TR/controller-document/#Multikey

        const targetContext = 'https://w3id.org/security/multikey/v1'; // await ctx.call('jsonld.context.get');

        const framedResult = await ctx.call('jsonld.parser.frame', {
          input: resource,
          frame: {
            '@context': targetContext
          }
        });

        const multikey = framedResult['@graph'][0] || framedResult;
        // Must be Multikey only
        multikey.type = 'Multikey';
        multikey['@context'] = targetContext;

        return multikey;
      }

      return resource;
    }
  }
};
