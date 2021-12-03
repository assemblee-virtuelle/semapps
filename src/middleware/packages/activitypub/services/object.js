const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { MoleculerError } = require('moleculer').Errors;
const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../constants');

const ObjectService = {
  name: 'activitypub.object',
  settings: {
    baseUri: null,
    containers: null
  },
  dependencies: ['ldp.resource'],
  actions: {
    async get(ctx) {
      const { objectUri } = ctx.params;
      return await ctx.call('ldp.resource.get', { resourceUri: objectUri, accept: MIME_TYPES.JSON });
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
          const objectType = activity.object.type || activity.object['@type'];
          let containerUri = this.getMatchingContainerUri(objectType);
          if (!containerUri) {
            throw new MoleculerError('No container support the object type ' + objectType, 400, 'BAD_REQUEST');
          }

          if (containerUri.includes('/:username')) {
            const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
            containerUri = containerUri.replace(':username', account.username);
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

      const objectType = object.type || object['@type'];
      let containerUri = this.getMatchingContainerUri(objectType);
      if (!containerUri) {
        throw new MoleculerError('No container support the object type ' + objectType, 400, 'BAD_REQUEST');
      }

      if (containerUri.includes('/:username')) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        containerUri = containerUri.replace(':username', account.username);
        ctx.meta.dataset = account.username;
      }

      await ctx.call('triplestore.insert', {
        resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${objectUri}>`,
        webId
      });

      await ctx.call('triplestore.insert', {
        resource,
        contentType: MIME_TYPES.JSON
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
  },
  methods: {
    getMatchingContainerUri(types) {
      types = Array.isArray(types) ? types : [types];
      const container = this.settings.containers.find(container =>
        types.some(type =>
          Array.isArray(container.acceptedTypes)
            ? container.acceptedTypes.includes(type)
            : container.acceptedTypes === type
        )
      );
      return container ? urlJoin(this.settings.baseUri, container.path) : null;
    }
  }
};

module.exports = ObjectService;
