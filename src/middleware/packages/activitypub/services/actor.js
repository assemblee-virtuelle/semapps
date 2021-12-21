const fetch = require('node-fetch');
const { getSlugFromUri } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTOR_TYPES } = require('../constants');
const { delay, defaultToArray } = require('../utils');

const ActorService = {
  name: 'activitypub.actor',
  dependencies: ['activitypub.collection', 'ldp', 'signature'],
  settings: {
    baseUri: null,
    jsonContext: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    selectActorData: resource => ({
      '@type': ACTOR_TYPES.PERSON,
      name: undefined,
      preferredUsername: getSlugFromUri(resource.id || resource['@id'])
    }),
    podProvider: false
  },
  actions: {
    async get(ctx) {
      const { actorUri, webId } = ctx.params;
      if (this.isLocal(actorUri)) {
        return await ctx.call('ldp.resource.get', { resourceUri: actorUri, accept: MIME_TYPES.JSON, webId });
      } else {
        const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
        if (!response) return false;
        return await response.json();
      }
    },
    async getProfile(ctx) {
      const { actorUri, webId } = ctx.params;
      const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
      if (actor.url) {
        return await ctx.call('ldp.resource.get', { resourceUri: actor.url, accept: MIME_TYPES.JSON, webId });
      }
    },
    async appendActorData(ctx) {
      const { actorUri } = ctx.params;

      const currentData = await this.actions.get({ actorUri, webId: 'system' }, { parentCtx: ctx });

      await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          ...this.settings.selectActorData(currentData)
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
    },
    async generateKeyPair(ctx) {
      const { actorUri } = ctx.params;
      const actor = await this.actions.get({ actorUri, webId: 'system' }, { parentCtx: ctx });

      if (!actor.publicKey) {
        const publicKey = await ctx.call('signature.generateActorKeyPair', { actorUri });

        await ctx.call('ldp.resource.patch', {
          resource: {
            '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
            '@id': actorUri,
            publicKey: {
              owner: actorUri,
              publicKeyPem: publicKey
            }
          },
          contentType: MIME_TYPES.JSON,
          webId: 'system'
        });
      }
    },
    async deleteKeyPair(ctx) {
      const { actorUri } = ctx.params;
      await ctx.call('signature.deleteActorKeyPair', { actorUri });
    },
    async awaitCreateComplete(ctx) {
      let { actorUri, additionalKeys = [] } = ctx.params;
      const keysToCheck = ['publicKey', 'outbox', 'inbox', 'followers', 'following', ...additionalKeys];
      let actor;
      do {
        await delay(1000);
        actor = await ctx.call(
          'ldp.resource.get',
          {
            resourceUri: actorUri,
            accept: MIME_TYPES.JSON,
            webId: 'system'
          },
          { meta: { $cache: false } }
        );
      } while (!keysToCheck.every(key => Object.keys(actor).includes(key)));
      return actor;
    },
    async generateMissingActorsData(ctx) {
      for (let containerUri of this.settings.actorsContainers) {
        const containerData = await ctx.call('ldp.container.get', { containerUri, accept: MIME_TYPES.JSON });
        for (let actor of containerData['ldp:contains']) {
          const actorUri = actor.id || actor['@id'];
          await this.actions.appendActorData({ actorUri, userData: actor }, { parentCtx: ctx });
          if (!actor.inbox) {
            await this.actions.attachCollections({ actorUri }, { parentCtx: ctx });
          }
          if (!actor.publicKey) {
            await this.actions.generateKeyPair({ actorUri }, { parentCtx: ctx });
          }
          console.log('Generated missing data for actor ' + actorUri);
        }
      }
    },
    getCollectionUri: {
      cache: true,
      async handler(ctx) {
        const { actorUri, predicate, webId } = ctx.params;
        const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
        return actor && actor[predicate];
      }
    }
  },
  methods: {
    isLocal(uri) {
      return uri.startsWith(this.settings.baseUri);
    },
    isActor(resource) {
      return defaultToArray(resource['@type'] || resource.type).some(type => Object.values(ACTOR_TYPES).includes(type));
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isActor(newData)) {
        await this.actions.appendActorData({ actorUri: resourceUri }, { parentCtx: ctx });
        await this.actions.generateKeyPair({ actorUri: resourceUri }, { parentCtx: ctx });
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (this.isActor(oldData)) {
        await this.actions.deleteKeyPair({ actorUri: resourceUri }, { parentCtx: ctx });
      }
    },
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      await this.actions.appendActorData({ actorUri: webId }, { parentCtx: ctx });
      await this.actions.generateKeyPair({ actorUri: webId }, { parentCtx: ctx });
    }
  }
};

module.exports = ActorService;
