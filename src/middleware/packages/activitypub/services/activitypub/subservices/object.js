const { MIME_TYPES } = require('@semapps/mime-types');
const { getSlugFromUri } = require('@semapps/ldp');
const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../../../constants');

const ObjectService = {
  name: 'activitypub.object',
  settings: {
    baseUri: null,
    podProvider: false
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

          // Get the first matching container
          // TODO: attach to all matching containers
          const container = await ctx.call('ldp.registry.getByType', {
            type: types,
            dataset: this.settings.podProvider ? getSlugFromUri(actorUri) : undefined
          });

          if (!container)
            throw new Error(`Cannot create resource of type "${types.join(', ')}", no matching containers were found!`);

          const containerUri = await ctx.call('ldp.registry.getUri', { path: container.path, webId: actorUri });

          objectUri = await ctx.call(container.controlledActions?.post || 'ldp.container.post', {
            containerUri,
            resource: activity.object,
            contentType: MIME_TYPES.JSON,
            webId: actorUri
          });
          break;
        }

        case ACTIVITY_TYPES.UPDATE: {
          // If the object passed is an URI, this is an announcement and there is nothing to process
          if (typeof activity.object === 'string') break;

          objectUri = activity.object['@id'] || activity.object.id;

          const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: objectUri });

          await ctx.call(controlledActions?.put || 'ldp.resource.put', {
            resource: activity.object,
            contentType: MIME_TYPES.JSON,
            webId: actorUri
          });

          break;
        }

        case ACTIVITY_TYPES.DELETE: {
          if (activity.object) {
            const resourceUri = typeof activity.object === 'string' ? activity.object : activity.object.id;
            // If the resource is already deleted, it means it was an announcement
            if (await ctx.call('ldp.resource.exist', { resourceUri, webId: actorUri })) {
              const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri });

              await ctx.call(controlledActions?.delete || 'ldp.resource.delete', { resourceUri, webId: actorUri });
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
    // TODO handle Tombstones, also when we post directly through the LDP protocol ?
    // async create(ctx) {
    //   // If there is already a tombstone in the desired URI,
    //   // remove it first to avoid automatic incrementation of the slug
    //   if (ctx.params.slug) {
    //     const desiredUri = urlJoin(this.settings.containerUri, ctx.params.slug);
    //     let object;
    //     try {
    //       object = await this.getById(desiredUri);
    //     } catch (e) {
    //       // Do nothing if object is not found
    //     }
    //     if (object && object.type === OBJECT_TYPES.TOMBSTONE) {
    //       await this._remove(ctx, { id: desiredUri });
    //     }
    //   }
    //   return await this._create(ctx, ctx.params);
    // }
    // },
    // events: {
    //   async 'ldp.resource.deleted'(ctx) {
    //     const { resourceUri } = ctx.params;
    //     const containerUri = getContainerFromUri(resourceUri);
    //     const slug = getSlugFromUri(resourceUri);
    //
    //     if (this.settings.objectsContainers.includes(containerUri)) {
    //       await ctx.call('ldp.container.post', {
    //         containerUri,
    //         slug,
    //         resource: {
    //           '@context': this.settings.context,
    //           type: OBJECT_TYPES.TOMBSTONE,
    //           deleted: new Date().toISOString()
    //         }
    //       });
    //     }
    //   }
  },
  methods: {
    isLocal(uri) {
      return uri.startsWith(this.settings.baseUri);
    }
  }
};

module.exports = ObjectService;
