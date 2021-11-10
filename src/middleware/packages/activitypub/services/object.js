const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../constants');

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
      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: objectUri });
      try {
        return await ctx.call(controlledActions.get || 'ldp.resource.get', { resourceUri: objectUri, accept: MIME_TYPES.JSON, ...rest });
      } catch(e) {
        // If the object was not found in cache, try to query it distantly
        // TODO only do this for distant objects
        return await ctx.call('activitypub.proxy.query', {
          resourceUri: objectUri,
          actorUri
        });
        // TODO put in cache results ??
      }
    },
    async process(ctx) {
      let { activity, actorUri } = ctx.params;
      let activityType = activity.type || activity['@type'],
        objectUri;

      // If an object is passed directly, first wrap it in a Create activity
      if (Object.values(OBJECT_TYPES).includes(activityType)) {
        let { to, '@id': id, ...object } = activity;
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
          let containerUri;
          const container = ctx.call('ldp.registry.getByType', {
            type: activity.object.type || activity.object['@type']
          });

          if (this.settings.podProvider) {
            const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
            containerUri = urlJoin(this.settings.baseUri, account.username, container.path);
          } else {
            containerUri = urlJoin(this.settings.baseUri, container.path);
          }

          objectUri = await ctx.call('ldp.resource.post', {
            containerUri,
            slug: ctx.meta.headers && ctx.meta.headers.slug,
            resource: activity.object,
            contentType: MIME_TYPES.JSON,
            webId: actorUri
          });
          break;
        }

        case ACTIVITY_TYPES.UPDATE: {
          objectUri = await ctx.call('ldp.resource.patch', {
            resource: activity.object,
            contentType: MIME_TYPES.JSON,
            webId: actorUri
          });
          break;
        }

        case ACTIVITY_TYPES.DELETE: {
          await ctx.call('ldp.resource.delete', {
            resourceUri: activity.object,
            webId: actorUri
          });
          break;
        }
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
    async cacheRemote(ctx) {
      const { objectUri, actorUri } = ctx.params;

      const object = await ctx.call('activitypub.proxy.query', {
        resourceUri: objectUri,
        actorUri
      });

      let containerUri, dataset;
      const container = await ctx.call('ldp.registry.getByType', { type: object.type || object['@type'] });

      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        containerUri = urlJoin(this.settings.baseUri, account.username, container.path);
        dataset = account.username;
      } else {
        containerUri = urlJoin(this.settings.baseUri, container.path);
      }

      await ctx.call('triplestore.insert', {
        resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${objectUri}>`,
        webId: 'system',
        dataset
      });

      await ctx.call('triplestore.insert', {
        resource: object,
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
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
    //       await ctx.call('ldp.resource.post', {
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
  }
};

module.exports = ObjectService;
