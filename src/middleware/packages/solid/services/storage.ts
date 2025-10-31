import urlJoin from 'url-join';
import rdf from '@rdfjs/data-model';
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
        ctx.meta.dataset = username;

        await ctx.call('triplestore.dataset.create', {
          dataset: username,
          secure: false // TODO Remove when we switch to Fuseki 5
        });

        const allowSlugs = await ctx.call('ldp.getSetting', { key: 'allowSlugs' });
        const baseUrl = await this.actions.getBaseUrl({ username }, { parentCtx: ctx });

        const rootContainerUri: string = await ctx.call('ldp.container.create', { path: '/data' });

        let resourcesUris: Record<string, string> = {};

        // Create controlled resources by priority (first webId, then type indexes, then other resources)
        const resourceRegistrations: Registration[] = await ctx.call('ldp.registry.list', { isContainer: false });
        for (const resourceRegistration of resourceRegistrations) {
          const { controlledActions } = resourceRegistration;

          // TODO Put this inside the ldp.resource.create action
          const resourceUri: string = await ctx.call('triplestore.named-graph.create', {
            baseUrl,
            slug: allowSlugs ? resourceRegistration.path : undefined
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

          resourcesUris[resourceRegistration.name] = resourceUri;
        }

        const webId = resourcesUris.webid;
        ctx.meta.webId = webId;

        // Add other properties to the WebID
        await ctx.call('webid.patch', {
          resourceUri: webId,
          triplesToAdd: [
            rdf.quad(
              rdf.namedNode(webId),
              rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
              rdf.namedNode('http://xmlns.com/foaf/0.1/Person')
            ),
            rdf.quad(rdf.namedNode(webId), rdf.namedNode('http://xmlns.com/foaf/0.1/nick'), rdf.literal(username)),
            rdf.quad(
              rdf.namedNode(webId),
              rdf.namedNode('http://www.w3.org/ns/pim/space#storage'),
              rdf.namedNode(rootContainerUri)
            ),
            rdf.quad(
              rdf.namedNode(webId),
              rdf.namedNode('http://www.w3.org/ns/solid/terms#oidcIssuer'),
              rdf.namedNode(this.settings.baseUrl.replace(/\/$/, ''))
            )
          ],
          webId: 'system'
        });

        // Now the WebID is created, register the resources with the type index
        for (const resourceRegistration of resourceRegistrations) {
          const resourceUri = resourcesUris[resourceRegistration.name];

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
        for (const containerRegistration of containerRegistrations) {
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
        webId: { type: 'string', optional: true },
        username: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { webId, username } = ctx.params;
        if (username) {
          return urlJoin(this.settings.baseUrl, username);
        } else if (webId) {
          return getWebIdFromUri(webId);
        } else {
          throw new Error(`The webId or username param is required`);
        }
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
