import urlJoin from 'url-join';
import { triple, namedNode } from '@rdfjs/data-model';
import { pim } from '@semapps/ontologies';

/** @type {import('moleculer').ServiceSchema} */
const SolidStorageSchema = {
  name: 'solid-storage',
  settings: {
    baseUrl: null,
    pathName: 'data'
  },
  dependencies: ['ontologies', 'ldp.registry'],
  async started() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting of the solid-storage service is required');

    await this.broker.call('ontologies.register', pim);

    // Register root container for the storage (/:username/data/)
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
      if (!username) throw new Error('Cannot create Solid storage without a username');

      await ctx.call('triplestore.dataset.create', {
        dataset: username,
        secure: false // TODO Remove when we switch to Fuseki 5
      });

      ctx.meta.dataset = username;

      // Create the storage root container so that the LdpRegistryService can create the default containers
      const storageRootUri = urlJoin(this.settings.baseUrl, username, this.settings.pathName);
      await ctx.call('ldp.container.create', { containerUri: storageRootUri, webId: 'system' });

      return storageRootUri;
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

      const storageUrl = await this.actions.getUrl({ webId }, { parentCtx: ctx });

      // Attach the storage URL to the webId
      await ctx.call('ldp.resource.patch', {
        resourceUri: webId,
        triplesToAdd: [
          triple(namedNode(webId), namedNode('http://www.w3.org/ns/pim/space#storage'), namedNode(storageUrl))
        ],
        webId: 'system'
      });

      // Give full rights to user on his storage
      await ctx.call('webacl.resource.addRights', {
        resourceUri: storageUrl,
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

export default SolidStorageSchema;
