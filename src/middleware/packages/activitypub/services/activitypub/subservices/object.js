const { MIME_TYPES } = require('@semapps/mime-types');
const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../../../constants');

const ObjectService = {
  name: 'activitypub.object',
  settings: {
    baseUri: null,
    podProvider: false,
    activateTombstones: true
  },
  dependencies: ['ldp.resource'],
  actions: {
    async get(ctx) {
      const { objectUri, actorUri, ...rest } = ctx.params;

      // If the object is already dereferenced, return it
      if (typeof objectUri !== 'string') return objectUri;

      return await ctx.call('ldp.resource.get', {
        resourceUri: objectUri,
        webId: actorUri,
        ...rest,
        accept: MIME_TYPES.JSON
      });
    },
    async process(ctx) {
      let { activity, actorUri } = ctx.params;
      let activityType = activity.type || activity['@type'];
      let objectUri;

      // If an object is passed directly, first wrap it in a Create activity
      if (Object.values(OBJECT_TYPES).includes(activityType)) {
        const { to, '@id': id, ...object } = activity;
        activityType = ACTIVITY_TYPES.CREATE;
        activity = {
          '@context': object['@context'],
          type: activityType,
          to,
          actor: object.attributedTo,
          object
        };
      }

      switch (activityType) {
        case ACTIVITY_TYPES.CREATE: {
          // If the object passed is an URI, this is an announcement and there is nothing to process
          if (typeof activity.object === 'string') break;

          const types = await ctx.call('jsonld.parser.expandTypes', {
            types: activity.object.type || activity.object['@type'],
            context: activity['@context']
          });

          // TODO: attach to all matching containers
          let container, containerUri;

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
            throw new Error(`Cannot create resource of type "${types.join(', ')}", no matching containers were found!`);

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
    },
    async createTombstone(ctx) {
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
  },
  events: {
    async 'ldp.resource.deleted'(ctx) {
      // Check if tombstones are globally activated
      if (this.settings.activateTombstones) {
        const { resourceUri, containersUris, oldData, dataset } = ctx.params;

        // Check if tombstones are activated for this specific container
        const containerOptions = await ctx.call('ldp.registry.getByUri', {
          containerUri: containersUris[0],
          dataset
        });

        if (containerOptions.activateTombstones !== false) {
          const formerType = oldData.type || oldData['@type'];
          await this.actions.createTombstone({ resourceUri, formerType }, { meta: { dataset }, parentCtx: ctx });
        }
      }
    }
  }
};

module.exports = ObjectService;
