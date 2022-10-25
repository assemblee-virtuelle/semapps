const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { OBJECT_TYPES, ACTIVITY_TYPES } = require('../constants');
const { delay } = require('../utils');
const fetch = require('node-fetch');

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

      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: objectUri });
      try {
        return await ctx.call(controlledActions && controlledActions.get ? controlledActions.get : 'ldp.resource.get', {
          resourceUri: objectUri,
          accept: MIME_TYPES.JSON,
          webId: actorUri,
          ...rest
        });
      } catch (e) {
        if (e.code === 404) {
          // TODO only do this for distant objects
          // If the object was not found in cache, try to query it distantly
          if (actorUri && actorUri !== 'system' && actorUri !== 'anon') {
            return await ctx.call('activitypub.proxy.query', {
              resourceUri: objectUri,
              actorUri
            });
            // TODO put results in cache ?
          } else {
            const response = await fetch(objectUri, {
              headers: {
                Accept: 'application/json'
              }
            });

            if (response.ok) {
              return await response.json();
            } else {
              throw new Error(`Unable to fetch remote object: ${objectUri}`);
            }
          }
        } else {
          // Rethrow error if not 404
          throw e;
        }
      }
    },
    async awaitCreateComplete(ctx) {
      let { objectUri, predicates } = ctx.params;
      let object;
      do {
        if (object) await delay(1000); // Delay only on second loop
        object = await ctx.call(
          'ldp.resource.get',
          {
            resourceUri: objectUri,
            accept: MIME_TYPES.JSON,
            webId: 'system'
          },
          { meta: { $cache: false } }
        );
      } while (!predicates.every(p => Object.keys(object).includes(p)));
      return object;
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
          // If the object passed is an URI, this is an announcement and there is nothing to process
          if (typeof activity.object === 'string') break;

          let containerUri;
          const container = await ctx.call('ldp.registry.getByType', {
            type: activity.object.type || activity.object['@type']
          });

          if (!container)
            throw new Error(
              `Cannot create resource of type "${activity.object.type ||
                activity.object['@type']}", no matching containers were found!`
            );

          if (this.settings.podProvider) {
            const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
            containerUri = urlJoin(account.podUri, container.path);
          } else {
            containerUri = urlJoin(this.settings.baseUri, container.path);
          }

          objectUri = await ctx.call('ldp.container.post', {
            containerUri,
            slug: ctx.meta.headers && ctx.meta.headers.slug,
            resource: activity.object,
            contentType: MIME_TYPES.JSON,
            webId: actorUri
          });
          break;
        }

        case ACTIVITY_TYPES.UPDATE: {
          // If the object passed is an URI, this is an announcement and there is nothing to process
          if (typeof activity.object === 'string') break;

          await ctx.call('ldp.resource.patch', {
            resource: activity.object,
            contentType: MIME_TYPES.JSON,
            webId: actorUri
          });
          objectUri = activity.object['@id'] || activity.object.id;
          break;
        }

        case ACTIVITY_TYPES.DELETE: {
          // TODO ensure that this is not an announcement (like for Update and Create)
          await ctx.call('ldp.resource.delete', {
            resourceUri: typeof activity.object === 'string' ? activity.object : activity.object.id,
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
      let { objectUri, actorUri } = ctx.params;

      if (typeof objectUri === 'object') {
        objectUri = objectUri.id || objectUri['@id'];
      }

      const object = await ctx.call('activitypub.object.get', {
        objectUri,
        actorUri
      });

      let containerUri, dataset;
      const container = await ctx.call('ldp.registry.getByType', { type: object.type || object['@type'] });

      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        containerUri = urlJoin(this.settings.baseUri, container.fullPath.replace(':username', account.username));
        dataset = account.username;
      } else {
        containerUri = urlJoin(this.settings.baseUri, container.path);
      }

      // Delete the existing cached resource (if it exists)
      await this.actions.deleteFromCache({ objectUri, actorUri }, { parentCtx: ctx });

      await ctx.call('triplestore.insert', {
        resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${objectUri}>`,
        webId: 'system',
        dataset
      });

      await ctx.call('triplestore.insert', {
        resource: object,
        contentType: MIME_TYPES.JSON,
        webId: 'system',
        dataset
      });
    },
    async deleteFromCache(ctx) {
      const { objectUri, actorUri } = ctx.params;

      let dataset;
      if (this.settings.podProvider) {
        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        dataset = account.username;
      }

      // TODO also delete the associated blank nodes
      await ctx.call('triplestore.update', {
        query: `
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          DELETE
          WHERE { 
            ?container ldp:contains <${objectUri}> .
            <${objectUri}> ?p1 ?o1 .
          }
        `,
        webId: 'system',
        dataset
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
