const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');
const { credentialsContext, credentialsContextNoGraphProof } = require('../constants');

/**
 * Container for Verifiable Presentations. Posting to this container will create a new VP.
 * Service works in analogy to @see {VCCredentialsContainer}.
 *
 * Note that presentations do not have to be persisted. Upon issuance, the holder can
 * provide an unsigned presentation with an id that can be signed as well.
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
  /**
   * The actions below have their `@context` replaced.
   * This is because the proof is considered a separate graph in the original context.
   * We can't handle that internally so we use a copy of the context with the `@graph`s removed.
   */
  actions: {
    async get(ctx) {
      const resource = ctx.call('ldp.resource.get', {
        ...ctx.params,
        jsonContext: credentialsContextNoGraphProof
      });
      return { ...resource, '@context': credentialsContext };
    },
    async put(ctx) {
      const { resource } = ctx.params;
      return ctx.call('ldp.resource.put', {
        ...ctx.params,
        resource: {
          ...resource,
          '@context': credentialsContextNoGraphProof
        }
      });
    },
    async post(ctx) {
      const { resource } = ctx.params;
      return ctx.call('ldp.container.post', {
        ...ctx.params,
        resource: {
          ...resource,
          '@context': credentialsContextNoGraphProof
        }
      });
    },
    async list(ctx) {
      const container = await ctx.call('ldp.container.list', {
        ...ctx.params,
        jsonContext: credentialsContextNoGraphProof
      });
      return { ...container, '@context': credentialsContext };
    }
  }
};

module.exports = VCPresentationContainer;
