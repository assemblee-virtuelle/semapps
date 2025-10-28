import urlJoin from 'url-join';
import { pim } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import { getWebIdFromUri } from '@semapps/ldp';

const SolidStorageSchema = {
  name: 'solid-storage' as const,
  settings: {
    baseUrl: null
  },
  dependencies: ['ontologies'],
  async started() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting of the solid-storage service is required');

    await this.broker.call('ontologies.register', pim);
  },
  actions: {
    create: {
      params: {
        username: { type: 'string' }
      },
      async handler(ctx) {
        const { username } = ctx.params;

        await ctx.call('triplestore.dataset.create', {
          dataset: username,
          secure: false // TODO Remove when we switch to Fuseki 5
        });

        const webId = urlJoin(this.settings.baseUrl, username);
        const storageUrl = await ctx.call('ldp.container.create', { path: '/data', webId });

        ctx.meta.dataset = username;

        return storageUrl;
      }
    },

    getBaseUrl: {
      params: {
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { webId } = ctx.params;
        return getWebIdFromUri(webId);
      }
    },

    getRootContainerUri: {
      params: {
        webId: { type: 'string' }
      },
      async handler(ctx) {
        const { webId } = ctx.params;
        const webIdData = await ctx.call('ldp.resource.get', { resourceUri: webId });
        return webIdData?.['pim:storage'];
      }
    }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        const { webId } = ctx.params;

        const rootContainerUri = await this.actions.getRootContainerUri({ webId }, { parentCtx: ctx });

        // Give full rights to user on his storage
        await ctx.call('webacl.resource.addRights', {
          resourceUri: rootContainerUri,
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
    },
    'ldp.container.created': {
      async handler(ctx) {
        const { containerUri, webId } = ctx.params;

        const rootContainerUri = await this.actions.getRootContainerUri({ webId }, { parentCtx: ctx });

        await ctx.call('ldp.container.attach', {
          containerUri: rootContainerUri,
          resourceUri: containerUri,
          webId: 'system'
        });
      }
    }
  }
} satisfies ServiceSchema;

export default SolidStorageSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SolidStorageSchema.name]: typeof SolidStorageSchema;
    }
  }
}
