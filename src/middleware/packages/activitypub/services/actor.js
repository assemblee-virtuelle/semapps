const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/ldp');

const ActorService = {
  name: 'activitypub.actor',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  dependencies: ['activitypub.collection', 'signature'],
  settings: {
    containerUri: null, // To be set by the user
    queryDepth: 1,
    context: ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1']
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
    },
    async generateKeyPair(ctx) {
      const { actorUri } = ctx.params;
      const publicKey = await ctx.call('signature.generateActorKeyPair', { actorUri });

      return await this._update(ctx, {
        '@id': actorUri,
        publicKey: {
          // TODO expand the key, even if it has an ID (currently only blank nodes are expanded)
          // id: actorUri + '#main-key',
          owner: actorUri,
          publicKeyPem: publicKey
        }
      });
    },
    async generateMissingKeyPairs(ctx) {
      const container = await this._find(ctx, {});
      for( let actor of container['ldp:contains'] ) {
        if( !actor.publicKey ) {
          await this.actions.generateKeyPair({ actorUri: actor.id });
          console.log('Generated missing key for actor ' + actor.id);
        }
      }
    }
  },
  hooks: {
    before: {
      create: [
        function parseSlugFromHeader(ctx) {
          if (ctx.meta && ctx.meta.headers && ctx.meta.headers.slug) {
            ctx.params.slug = ctx.meta.headers.slug;
          }
        }
      ]
    },
    after: {
      create: [
        function generateKeyPair(ctx, res) {
          return this.actions.generateKeyPair({ actorUri: res.id });
        },
        function attachCollections(ctx, res) {
          return this.actions.attachCollections({ actorUri: res.id });
        },
        function emitEvent(ctx, res) {
          this.broker.emit('actor.created', res);
          return res;
        }
      ],
      remove: [
        async function removeCollections(ctx, res) {
          const actorUri = res['@id'];
          await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/following' });
          await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/followers' });
          await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/inbox' });
          await ctx.call('activitypub.collection.remove', { collectionUri: actorUri + '/outbox' });
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
