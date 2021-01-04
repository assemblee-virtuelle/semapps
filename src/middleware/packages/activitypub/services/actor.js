const urlJoin = require('url-join');
const { getContainerFromUri, getSlugFromUri } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTOR_TYPES } = require('../constants');

const ActorService = {
  name: 'activitypub.actor',
  dependencies: ['activitypub.collection', 'signature'],
  settings: {
    actorsContainers: [],
    context: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    selectActorData: resource => ({
      '@type': ACTOR_TYPES.PERSON,
      name: undefined,
      preferredUsername: getSlugFromUri(resource.id || resource['@id'])
    })
  },
  actions: {
    async appendActorData(ctx) {
      const { actorUri, userData } = ctx.params;
      const { '@type': type, name, preferredUsername } = this.settings.selectActorData(userData);

      const userTypes = Array.isArray(userData.type || userData['@type'])
        ? userData.type || userData['@type']
        : [userData.type || userData['@type']];

      await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          '@type': [...userTypes, type],
          name,
          preferredUsername
        },
        contentType: MIME_TYPES.JSON
      });
    },
    async attachCollections(ctx) {
      const { actorUri } = ctx.params;

      // Create the collections associated with the user
      await ctx.call('activitypub.collection.create', {
        collectionUri: urlJoin(actorUri, 'following'),
        ordered: false
      });
      await ctx.call('activitypub.collection.create', {
        collectionUri: urlJoin(actorUri, 'followers'),
        ordered: false
      });
      await ctx.call('activitypub.collection.create', { collectionUri: urlJoin(actorUri, 'inbox'), ordered: true });
      await ctx.call('activitypub.collection.create', { collectionUri: urlJoin(actorUri, 'outbox'), ordered: true });

      return await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          following: urlJoin(actorUri, 'following'),
          followers: urlJoin(actorUri, 'followers'),
          inbox: urlJoin(actorUri, 'inbox'),
          outbox: urlJoin(actorUri, 'outbox')
        },
        contentType: MIME_TYPES.JSON
      });
    },
    async detachCollections(ctx) {
      const { actorUri } = ctx.params;
      await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/following' });
      await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/followers' });
      await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/inbox' });
      await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/outbox' });
    },
    async generateKeyPair(ctx) {
      const { actorUri } = ctx.params;
      const publicKey = await ctx.call('signature.generateActorKeyPair', { actorUri });

      await ctx.call('ldp.resource.patch', {
        resource: {
          '@id': actorUri,
          publicKey: {
            // TODO expand the key, even if it has an ID (currently only blank nodes are expanded)
            // id: actorUri + '#main-key',
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
    async generateMissingActorsData(ctx) {
      for (let containerUri of this.settings.actorsContainers) {
        const containerData = await ctx.call('ldp.container.get', { containerUri, accept: MIME_TYPES.JSON });
        for (let actor of containerData['ldp:contains']) {
          if (!actor.preferredUsername) {
            await this.actions.appendActorData({ actorUri: actor['@id'], userData: actor });
          }
          if (!actor.inbox) {
            await this.actions.attachCollections({ actorUri: actor['@id'] });
          }
          if (!actor.publicKey) {
            await this.actions.generateKeyPair({ actorUri: actor['@id'] });
          }
          console.log('Generated missing data for actor ' + actor['@id']);
        }
      }
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      const containerUri = getContainerFromUri(resourceUri);

      if (this.settings.actorsContainers.includes(containerUri)) {
        await this.actions.appendActorData({ actorUri: resourceUri, userData: newData });
        await this.actions.attachCollections({ actorUri: resourceUri });
        await this.actions.generateKeyPair({ actorUri: resourceUri });
        ctx.emit('activitypub.actor.created', newData);
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      const containerUri = getContainerFromUri(resourceUri);

      if (this.settings.actorsContainers.includes(containerUri)) {
        await this.actions.detachCollections({ actorUri: resourceUri });
        await this.actions.deleteKeyPair({ actorUri: resourceUri });
      }
    },
    'activitypub.actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
