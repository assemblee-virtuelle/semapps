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

      if (arrayOf(resource.type).includes(KEY_TYPES.MULTI_KEY)) {
        const multiKeyFramedKey = await ctx.call('jsonld.parser.frame', {
          input: resource,
          frame: {
            // Context MUST include multikey context.
            '@context': multiKey.jsonldContext,
            '@id': resource.id
          }
        });
        // MultiKeys MUST have Multikey type (https://www.w3.org/TR/controller-document/#Multikey)
        delete multiKeyFramedKey.type;
        multiKeyFramedKey.type = 'MultiKey';

        return multiKeyFramedKey;
      }

      return resource;
    }
  }
};
