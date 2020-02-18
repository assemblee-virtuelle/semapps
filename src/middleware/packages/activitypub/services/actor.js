const JsonLdStorageMixin = require('../mixins/jsonld-storage');
const { ACTOR_TYPES } = require('../constants');

const ActorService = {
  name: 'activitypub.actor',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  dependencies: ['activitypub.collection'],
  collection: 'actors',
  settings: {
    containerUri: null, // To be set by the user
    context: 'https://www.w3.org/ns/activitystreams'
  },
  hooks: {
    after: {
      create: [
        async function attachCollections(ctx, res) {
          const actorUri = res['@id'];

          // Create the collections associated with the user
          await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/following', ordered: false });
          await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/followers', ordered: false });
          await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/inbox', ordered: true });
          await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/outbox', ordered: true });

          let actor = {
            '@id': actorUri,
            following: actorUri + '/following',
            followers: actorUri + '/followers',
            inbox: actorUri + '/inbox',
            outbox: actorUri + '/outbox'
          };

          await this._update(ctx, actor);
        },
        function emitEvent(ctx, res) {
          this.broker.emit('actor.created', res);
        }
      ]
    }
  },
  events: {
    async 'webid.created'(userData) {
      await this.broker.call('activitypub.actor.update', {
        '@id': userData['@id'],
        type: ACTOR_TYPES.PERSON,
        preferredUsername: userData.nick,
        name: userData.name + ' ' + userData.familyName
      });
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
