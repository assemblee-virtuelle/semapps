const { getContainerFromUri, getSlugFromUri } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTOR_TYPES } = require('../constants');
const { delay, defaultToArray} = require('../utils');

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
      const { actorUri } = ctx.params;
      if (this.isLocal(actorUri)) {
        return await ctx.call('ldp.resource.get', { resourceUri: actorUri, accept: MIME_TYPES.JSON });
      } else {
        const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
        if (!response) return false;
        return await response.json();
      }
    },
    async appendActorData(ctx) {
      const { actorUri, userData } = ctx.params;
      const userTypes =
        userData.type || userData['@type']
          ? Array.isArray(userData.type || userData['@type'])
            ? userData.type || userData['@type']
            : [userData.type || userData['@type']]
          : [];

      // Skip if ActivityPub information are already provided
      if (
        userData.preferredUsername &&
        userData.name &&
        userTypes.some(type => Object.values(ACTOR_TYPES).includes(type))
      ) {
        console.log(`ActivityPub data have already been provided for ${actorUri}, skipping...`);
        return;
      }

      const { '@type': type, name, preferredUsername } = this.settings.selectActorData(userData);

      await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          '@type': type,
          name,
          preferredUsername
        },
        contentType: MIME_TYPES.JSON
      });
    },
    async generateKeyPair(ctx) {
      const { actorUri } = ctx.params;
      const publicKey = await ctx.call('signature.generateActorKeyPair', { actorUri });

      await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          publicKey: {
            owner: actorUri,
            publicKeyPem: publicKey
          }
        },
        contentType: MIME_TYPES.JSON,
        webId: 'system'
      });
    },
    async deleteKeyPair(ctx) {
      const { actorUri } = ctx.params;
      await ctx.call('signature.deleteActorKeyPair', { actorUri });
    },
    async awaitCreateComplete(ctx) {
      const { actorUri } = ctx.params;
      let actor;
      do {
        await delay(2000);
        actor = await ctx.call(
          'ldp.resource.get',
          {
            resourceUri: actorUri,
            accept: MIME_TYPES.JSON
          },
          { meta: { $cache: false } }
        );
      } while (!actor.publicKey);
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
    }
  },
  methods: {
    isLocal(uri) {
      return !this.settings.podProvider && uri.startsWith(this.settings.baseUri);
    },
    isActor(resource) {
      return defaultToArray(resource['@type'] || resource.type).some(type => Object.values(ACTOR_TYPES).includes(type));
    },
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if( this.isActor(newData )) {
        if (!newData.preferredUsername || !newData.name) {
          await this.actions.appendActorData({ actorUri: resourceUri, userData: newData }, { parentCtx: ctx });
        }
        await this.actions.generateKeyPair({ actorUri: resourceUri }, { parentCtx: ctx });
        ctx.emit('activitypub.actor.created', newData, { meta: { webId: null, dataset: null } });
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if( this.isActor(oldData) ) {
        await this.actions.deleteKeyPair({ actorUri: resourceUri }, { parentCtx: ctx });
      }
    },
    'activitypub.actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
