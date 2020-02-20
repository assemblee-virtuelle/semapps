const JsonLdStorageMixin = require('../mixins/jsonld-storage');

const ActorService = {
  name: 'activitypub.actor',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  dependencies: ['activitypub.collection'],
  collection: 'actors',
  settings: {
    containerUri: null, // To be set by the user
    context: {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      foaf: 'http://xmlns.com/foaf/0.1/'
    }
  },
  actions: {
    async attachCollections(ctx) {
      const { actorUri } = ctx.params;

      // Create the collections associated with the user
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/following', ordered: false });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/followers', ordered: false });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/inbox', ordered: true });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/outbox', ordered: true });

      return await this._update(ctx, {
        '@id': actorUri,
        following: actorUri + '/following',
        followers: actorUri + '/followers',
        inbox: actorUri + '/inbox',
        outbox: actorUri + '/outbox'
      });
    },
    getContainerUri(ctx) {
      return this.settings.containerUri;
    }
  },
  hooks: {
    after: {
      create: [
        function attachCollections(ctx, res) {
          return ctx.call('activitypub.actor.attachCollections', { actorUri: res['@id'] });
        },
        function emitEvent(ctx, res) {
          // TODO set this on the JsonLdStorageMixin
          this.broker.emit('actor.created', res);
          return res;
        }
      ]
    }
  },
  events: {
    async 'webid.created'(userData) {
      await this.broker.call('activitypub.actor.update', {
        '@id': userData['@id'],
        '@type': ['Person', 'foaf:Person'],
        preferredUsername: userData.nick,
        name: userData.name + ' ' + userData.familyName
      });

      // We must do that here, as the post-create hooks are not called
      const actor = await this.broker.call('activitypub.actor.attachCollections', { actorUri: userData['@id'] });

      this.broker.emit('actor.created', actor);
    },
    async 'webid.updated'(userData) {
      // TODO update actor when webid is updated
    },
    async 'webid.removed'(userData) {
      // TODO remove actor (and collections) when webid is removed
    },
    'actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
