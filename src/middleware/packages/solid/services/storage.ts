import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import { pim } from '@semapps/ontologies';
import { getWebIdFromUri, Registration, arrayOf } from '@semapps/ldp';

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
    /**
     * Create the dataset, the WebID and the root container
     * Create also the controlled resources and containers, attach them to the root container and register them with the type index
     */
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

        ctx.meta.dataset = username;
        ctx.meta.webId = webId;

        const rootContainerUri = await ctx.call('ldp.container.create', { path: '/data', webId });

        // Create WebID
        await ctx.call('webid.create', {
          resourceUri: webId,
          resource: {
            '@id': webId,
            '@type': 'foaf:Person',
            'foaf:nick': username,
            'pim:storage': rootContainerUri,
            'solid:oidcIssuer': this.settings.baseUrl.replace(/\/$/, '') // Remove trailing slash if it exists
          },
          webId
        });

        // Create controlled resources (we do that first so that types indexes are created)
        const resourceRegistrations: Registration[] = await ctx.call('ldp.registry.list', { isContainer: false });
        for (const resourceRegistration of Object.values(resourceRegistrations)) {
          const { controlledActions } = resourceRegistration;

          const baseUrl = await this.actions.getBaseUrl({ webId }, { parentCtx: ctx });
          const allowSlugs = await ctx.call('ldp.getSetting', { key: 'allowSlugs' });

          // TODO Put this inside the ldp.resource.create action
          const resourceUri = await ctx.call('triplestore.named-graph.create', {
            baseUrl,
            slug: allowSlugs ? this.settings.slug : undefined
          });

          await ctx.call(controlledActions.create, {
            resourceUri,
            resource: { '@id': resourceUri, '@type': resourceRegistration.types },
            registration: resourceRegistration,
            webId: 'system'
          });

          await ctx.call('ldp.container.attach', {
            containerUri: rootContainerUri,
            resourceUri,
            webId: 'system'
          });

          await ctx.call('type-index.register', {
            types: arrayOf(resourceRegistration.types),
            uri: resourceUri,
            webId,
            isContainer: false,
            isPrivate: resourceRegistration.typeIndex === 'private'
          });
        }

        // Create containers from registry
        const containerRegistrations: Registration[] = await ctx.call('ldp.registry.list', { isContainer: true });
        for (const containerRegistration of Object.values(containerRegistrations)) {
          const containerUri = await ctx.call('ldp.container.create', {
            registration: containerRegistration,
            webId
          });

          await ctx.call('ldp.container.attach', {
            containerUri: rootContainerUri,
            resourceUri: containerUri,
            webId: 'system'
          });

          await ctx.call('type-index.register', {
            types: arrayOf(containerRegistration.types),
            uri: containerUri,
            webId,
            isContainer: true,
            isPrivate: containerRegistration.typeIndex === 'private'
          });
        }

        // Give full rights on all containers
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

        ctx.emit('solid-storage.created', { webId });

        return { webId, rootContainerUri };
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
