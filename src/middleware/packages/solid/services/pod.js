const urlJoin = require('url-join');
const { triple, namedNode } = require('@rdfjs/data-model');
const { pim } = require('@semapps/ontologies');

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: 'pod',
  settings: {
    baseUrl: null,
    pathName: 'data'
  },
  dependencies: ['ontologies', 'ldp.registry'],
  async started() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting of the pod service is required');

    await this.broker.call('ontologies.register', pim);

    // Register root container for the Pod (/:username/data/)
    // Do not await or we will have a circular dependency with the LdpRegistryService
    this.broker.call('ldp.registry.register', {
      path: '/',
      excludeFromMirror: true,
      permissions: {},
      newResourcesPermissions: {}
    });
  },
  actions: {
    async create(ctx) {
      const { username } = ctx.params;
      if (!username) throw new Error('Cannot create pod without a username');

      await ctx.call('triplestore.dataset.create', {
        dataset: username,
        secure: true
      });

      ctx.meta.dataset = username;

      // Create the Pod root container so that the LdpRegistryService can create the default containers
      const podRootUri = urlJoin(this.settings.baseUrl, username, this.settings.pathName);
      await ctx.call('ldp.container.create', { containerUri: podRootUri, webId: 'system' });

      return podRootUri;
    },
    async getUrl(ctx) {
      const { webId } = ctx.params;
      // This is faster, but later we should use the 'pim:storage' property of the webId
      return urlJoin(webId, this.settings.pathName);
    }
  },
  events: {
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;

      const podUrl = await this.actions.getUrl({ webId }, { parentCtx: ctx });

      // Attach the podUrl to the webId
      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToAdd: [
          triple(namedNode(webId), namedNode('http://www.w3.org/ns/pim/space#storage'), namedNode(podUrl))
        ],
        webId: 'system'
      });

      // Give full rights to user on his pod
      await ctx.call('webacl.resource.addRights', {
        resourceUri: podUrl,
        additionalRights: {
          user: {
            uri: webId,
            read: true,
            write: true,
            control: true
          },
          default: {
            user: {
              uri: webId,
              read: true,
              write: true,
              control: true
            }
          }
        },
        webId: 'system'
      });
    }
  }
};
