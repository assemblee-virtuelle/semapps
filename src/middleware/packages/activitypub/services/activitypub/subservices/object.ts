import { getType } from '@semapps/ldp';
import { MIME_TYPES } from '@semapps/mime-types';
import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';
import { OBJECT_TYPES, ACTIVITY_TYPES } from '../../../constants.ts';

const ObjectService = {
  name: 'activitypub.object' as const,
  settings: {
    baseUri: null,
    podProvider: false,
    activateTombstones: true
  },
  dependencies: ['ldp.resource'],
  actions: {
    get: defineAction({
      async handler(ctx) {
        const { objectUri, actorUri, ...rest } = ctx.params;

        // If the object is already dereferenced, return it
        if (typeof objectUri !== 'string') return objectUri;

        return await ctx.call('ldp.resource.get', {
          resourceUri: objectUri,
          webId: actorUri,
          ...rest,
          accept: MIME_TYPES.JSON
        });
      }
    }),

    wrap: defineAction({
      // If an object is passed directly, wrap it in a Create activity
      async handler(ctx) {
        const { activity } = ctx.params;

        if (Object.values(OBJECT_TYPES).includes(getType(activity))) {
          const { to, cc, '@id': id, ...object } = activity;
          return {
            '@context': object['@context'],
            type: ACTIVITY_TYPES.CREATE,
            to,
            cc,
            actor: object.attributedTo,
            object
          };
        } else {
          return activity;
        }
      }
    }),

    process: defineAction({
      async handler(ctx) {
        let { activity, actorUri } = ctx.params;
        let objectUri;

        switch (getType(activity)) {
          case ACTIVITY_TYPES.CREATE: {
            // If the object passed is an URI, this is an announcement and there is nothing to process
            if (typeof activity.object === 'string') break;

            const types = await ctx.call('jsonld.parser.expandTypes', {
              types: activity.object.type || activity.object['@type'],
              context: activity['@context']
            });

            // TODO: attach to all matching containers
            let container;
            let containerUri;

            if (this.settings.podProvider) {
              // If this is a Pod provider, find the container with the type-registrations service
              for (const type of types) {
                const containersUris = await ctx.call('type-registrations.findContainersUris', {
                  type,
                  webId: actorUri
                });
                if (containersUris.length > 0) {
                  containerUri = containersUris[0];
                  continue;
                }
              }
            } else {
              // Otherwise try to find it with the LdpRegistry
              container = await ctx.call('ldp.registry.getByType', { type: types });
              if (container) {
                containerUri = await ctx.call('ldp.registry.getUri', {
                  path: container.path,
                  webId: actorUri
                });
              }
            }

            if (!containerUri)
              throw new Error(
                `Cannot create resource of type "${types.join(', ')}", no matching containers were found!`
              );

            objectUri = await ctx.call(
              container?.controlledActions?.post || 'ldp.container.post',
              {
                containerUri,
                resource: activity.object,
                contentType: MIME_TYPES.JSON,
                webId: actorUri
              },
              {
                meta: {
                  skipObjectsWatcher: true // We don't want to trigger another Create action
                }
              }
            );
            break;
          }

          case ACTIVITY_TYPES.UPDATE: {
            // If the object passed is an URI, this is an announcement and there is nothing to process
            if (typeof activity.object === 'string') break;

            objectUri = activity.object['@id'] || activity.object.id;

            const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: objectUri });

            await ctx.call(
              controlledActions?.put || 'ldp.resource.put',
              {
                resource: activity.object,
                contentType: MIME_TYPES.JSON,
                webId: actorUri
              },
              {
                meta: {
                  skipObjectsWatcher: true // We don't want to trigger another Update action
                }
              }
            );

            break;
          }

          case ACTIVITY_TYPES.DELETE: {
            if (activity.object) {
              const resourceUri = typeof activity.object === 'string' ? activity.object : activity.object.id;
              // If the resource is already deleted, it means it was an announcement
              if (await ctx.call('ldp.resource.exist', { resourceUri, webId: actorUri })) {
                const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri });

                await ctx.call(
                  controlledActions?.delete || 'ldp.resource.delete',
                  { resourceUri, webId: actorUri },
                  {
                    meta: {
                      skipObjectsWatcher: true // We don't want to trigger another Delete action
                    }
                  }
                );
              }
            } else {
              this.logger.warn('Cannot delete object as it is undefined');
            }
            break;
          }

          default:
            break;
        }

        if (objectUri) {
          activity.object = await ctx.call(
            'ldp.resource.get',
            {
              resourceUri: objectUri,
              accept: MIME_TYPES.JSON,
              webId: actorUri
            },
            { meta: { $cache: false } }
          );
        }

        return activity;
      }
    }),

    createTombstone: defineAction({
      async handler(ctx) {
        const { resourceUri, formerType } = ctx.params;
        const expandedFormerTypes = await ctx.call('jsonld.parser.expandTypes', { types: formerType });

        // Insert directly the Tombstone in the triple store to avoid resource creation side-effects
        await ctx.call('triplestore.insert', {
          resource: {
            '@id': resourceUri,
            '@type': 'https://www.w3.org/ns/activitystreams#Tombstone',
            'https://www.w3.org/ns/activitystreams#formerType': expandedFormerTypes.map(type => ({ '@id': type })),
            'https://www.w3.org/ns/activitystreams#deleted': {
              '@value': new Date().toISOString(),
              '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
            }
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      }
    })
  },
  events: {
    'ldp.resource.deleted': defineServiceEvent({
      async handler(ctx) {
        // Check if tombstones are globally activated
        if (this.settings.activateTombstones) {
          const { resourceUri, containersUris, oldData, dataset } = ctx.params;

          // If the resource was in no container, skip...
          if (containersUris.length > 0) {
            // Check if tombstones are activated for this specific container
            const containerOptions = await ctx.call('ldp.registry.getByUri', {
              containerUri: containersUris[0],
              dataset
            });

            if (containerOptions.activateTombstones !== false && ctx.meta.activateTombstones !== false) {
              const formerType = oldData.type || oldData['@type'];
              await this.actions.createTombstone({ resourceUri, formerType }, { meta: { dataset }, parentCtx: ctx });
            }
          }
        }
      }
    })
  }
} satisfies ServiceSchema;

export default ObjectService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ObjectService.name]: typeof ObjectService;
    }
  }
}
