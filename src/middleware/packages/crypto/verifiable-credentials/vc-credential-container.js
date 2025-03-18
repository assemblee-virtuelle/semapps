const { ControlledContainerMixin, PseudoIdMixin } = require('@semapps/ldp');
const { credentialsContext, credentialsContextNoGraphProof } = require('../constants');

/**
 * Container for Verifiable Credentials. Posting to this container will create a new VC.
 *
 * WARNING: Changing things here can have security implications.
 *
 * @type {import('moleculer').ServiceSchema}
 */
const VCCredentialsContainer = {
  name: 'crypto.vc.issuer.credential-container',
  mixins: [ControlledContainerMixin, PseudoIdMixin],
  dependencies: ['ontologies'],
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
    newResourcesPermissions: webId => {
      if (webId === 'anon') throw new Error('Credential resource must be created for registered webId.');
      if (webId === 'system') return {};

      return {
        user: {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      };
    }
  },
  actions: {
    async get(ctx) {
      const resource = await ctx.call('ldp.resource.get', {
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
        containerUri: await this.actions.getContainerUri({ webId: ctx.params.webId }, { parentCtx: ctx }),
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

module.exports = VCCredentialsContainer;
