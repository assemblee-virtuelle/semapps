const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');
const { credentialsContext, noGraphCredentialContext } = require('../constants');

/**
 * Container for Verifiable Presentations. Posting to this container will create a new VP.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCPresentationContainer = {
  name: 'crypto.vc.holder.presentation-container',
  mixins: [ControlledContainerMixin, PseudoIdMixin],
  settings: {
    path: null,
    excludeFromMirror: true,
    activateTombstones: false,
    podProvider: null,
    permissions: (webId, ctx) => {
      // If not a pod provider, the container is shared, so any user can append.
      return {
        anyUser: {
          // Caution. Here, `ctx.service` is the LdpContainerService. Because this function is called by the WebAclMiddleware.
          read: !ctx.service.settings.podProvider,
          append: !ctx.service.settings.podProvider
        }
      };
    },
    newResourcesPermissions: {}
  },
  actions: {
    async get(ctx) {
      const resource = ctx.call('ldp.resource.get', {
        ...ctx.params,
        jsonContext: noGraphCredentialContext
      });
      return { ...resource, '@context': credentialsContext };
    },
    async put(ctx) {
      const { resource } = ctx.params;
      return ctx.call('ldp.resource.put', {
        ...ctx.params,
        resource: {
          ...resource,
          '@context': noGraphCredentialContext
        }
      });
    },
    async post(ctx) {
      const { resource } = ctx.params;
      return ctx.call('ldp.container.post', {
        ...ctx.params,
        resource: {
          ...resource,
          '@context': noGraphCredentialContext
        }
      });
    },
    async list(ctx) {
      const container = await ctx.call('ldp.container.list', {
        ...ctx.params,
        jsonContext: noGraphCredentialContext
      });
      return { ...container, '@context': credentialsContext };
    }
  }
};

module.exports = VCPresentationContainer;
