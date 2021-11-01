const urlJoin = require('url-join');
const { getContainerFromUri, getSlugFromUri } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTOR_TYPES } = require('../constants');
const { delay } = require('../utils');

const ActorService = {
  name: 'activitypub.actor',
  dependencies: ['activitypub.collection', 'ldp.resource', 'ldp.container', 'signature'],
  settings: {
    baseUri: null,
    actorsContainers: [],
    context: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    selectActorData: resource => ({
      '@type': ACTOR_TYPES.PERSON,
      name: undefined,
      preferredUsername: getSlugFromUri(resource.id || resource['@id'])
    })
  },
  actions: {
    async get(ctx) {
      const { actorUri } = ctx.params;
      if (this.isLocal(actorUri)) {
        // TODO give public read access to actor so we don't need to use webId system
        return await ctx.call('ldp.resource.get', { resourceUri: actorUri, accept: MIME_TYPES.JSON, webId: 'system' });
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
    async attachCollections(ctx) {
      const { actorUri, containerUri, rights } = ctx.params;
      const baseUri = containerUri || actorUri;

      // Create the collections associated with the user
      await ctx.call('activitypub.collection.create', {
        collectionUri: urlJoin(baseUri, 'following'),
        ordered: false,
        rights
      });
      await ctx.call('activitypub.collection.create', {
        collectionUri: urlJoin(baseUri, 'followers'),
        ordered: false,
        rights
      });
      await ctx.call('activitypub.collection.create', {
        collectionUri: urlJoin(baseUri, 'inbox'),
        ordered: true,
        rights
      });
      await ctx.call('activitypub.collection.create', {
        collectionUri: urlJoin(baseUri, 'outbox'),
        ordered: true,
        rights
      });

      // If the collections are created inside a container, attach them to the container
      if( containerUri ) {
        await ctx.call('ldp.container.attach', { containerUri, resourceUri: urlJoin(baseUri, 'following') });
        await ctx.call('ldp.container.attach', { containerUri, resourceUri: urlJoin(baseUri, 'followers') });
        await ctx.call('ldp.container.attach', { containerUri, resourceUri: urlJoin(baseUri, 'inbox') });
        await ctx.call('ldp.container.attach', { containerUri, resourceUri: urlJoin(baseUri, 'outbox') });
      }

      return await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          following: urlJoin(baseUri, 'following'),
          followers: urlJoin(baseUri, 'followers'),
          inbox: urlJoin(baseUri, 'inbox'),
          outbox: urlJoin(baseUri, 'outbox')
        },
        contentType: MIME_TYPES.JSON
      });
    },
    async detachCollections(ctx) {
      const { actorUri, containerUri } = ctx.params;
      const baseUri = containerUri || actorUri;

      await ctx.call('activitypub.collection.remove', { collectionUri: urlJoin(baseUri, 'followers') });
      await ctx.call('activitypub.collection.remove', { collectionUri: urlJoin(baseUri, 'following') });
      await ctx.call('activitypub.collection.remove', { collectionUri: urlJoin(baseUri, 'inbox') });
      await ctx.call('activitypub.collection.remove', { collectionUri: urlJoin(baseUri, 'outbox') });
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
        contentType: MIME_TYPES.JSON
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
      return uri.startsWith(this.settings.baseUri);
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      const containerUri = getContainerFromUri(resourceUri);

      if (this.settings.actorsContainers.includes(containerUri)) {
        if (!newData.preferredUsername || !newData.name) {
          await this.actions.appendActorData({ actorUri: resourceUri, userData: newData }, { parentCtx: ctx });
        }
        await this.actions.attachCollections({ actorUri: resourceUri }, { parentCtx: ctx });
        await this.actions.generateKeyPair({ actorUri: resourceUri }, { parentCtx: ctx });
        ctx.emit('activitypub.actor.created', newData);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      const containerUri = getContainerFromUri(resourceUri);

      if (this.settings.actorsContainers.includes(containerUri)) {
        await this.actions.detachCollections({ actorUri: resourceUri }, { parentCtx: ctx });
        await this.actions.deleteKeyPair({ actorUri: resourceUri }, { parentCtx: ctx });
      }
    },
    'activitypub.actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
