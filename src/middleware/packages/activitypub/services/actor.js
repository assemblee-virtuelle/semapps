const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/ldp');

const ActorService = {
  name: 'activitypub.actor',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  dependencies: ['activitypub.collection'],
  settings: {
    containerUri: null, // To be set by the user
    queryDepth: 1,
    context: 'https://www.w3.org/ns/activitystreams'
  },
  actions: {
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

      return await this._update(ctx, {
        '@id': actorUri,
        following: urlJoin(actorUri, 'following'),
        followers: urlJoin(actorUri, 'followers'),
        inbox: urlJoin(actorUri, 'inbox'),
        outbox: urlJoin(actorUri, 'outbox')
      });
    }
  },
  hooks: {
    after: {
      create: [
        function attachCollections(ctx, res) {
          return ctx.call('activitypub.actor.attachCollections', { actorUri: res.id });
        },
        function emitEvent(ctx, res) {
          // TODO set this on the JsonLdStorageMixin
          this.broker.emit('actor.created', res);
          return res;
        }
      ],
      remove: [
        async function removeCollections(ctx, res) {
          const actorUri = res['@id'];
          await ctx.call('activitypub.collection.remove', { id: actorUri + '/following' });
          await ctx.call('activitypub.collection.remove', { id: actorUri + '/followers' });
          await ctx.call('activitypub.collection.remove', { id: actorUri + '/inbox' });
          await ctx.call('activitypub.collection.remove', { id: actorUri + '/outbox' });
        }
      ]
    }
  },
  events: {
    async 'webid.created'(ctx) {
      const userData = ctx.params;

      await this.broker.call('activitypub.actor.update', {
        '@id': userData['@id'],
        '@type': ['Person', 'foaf:Person'],
        preferredUsername: userData['foaf:nick'],
        name: userData['foaf:name'] + ' ' + userData['foaf:familyName']
      });

      // We must do that here, as the post-create hooks are not called
      const actor = await this.broker.call('activitypub.actor.attachCollections', { actorUri: userData['@id'] });

      this.broker.emit('actor.created', actor);
    },
    async 'webid.updated'() {
      // TODO update actor when webid is updated
    },
    async 'webid.removed'() {
      // TODO remove actor (and collections) when webid is removed
    },
    'actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
