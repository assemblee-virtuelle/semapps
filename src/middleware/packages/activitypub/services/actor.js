const JsonLdStorageMixin = require('../mixins/jsonld-storage');
const { ACTOR_TYPES } = require( '../constants');

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
  actions: {
    async create(ctx) {
      if( ctx.params.type && !ACTOR_TYPES.includes(ctx.params.type) ) {
        throw new Error('Unknown actor type: ' + ctx.params.type);
      }

      const actorUri = ctx.params['@id'];

      // Create the collections associated with the user
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/following', ordered: false });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/followers', ordered: false });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/inbox', ordered: true });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/outbox', ordered: true });

      let actor = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@id': ctx.params['@id'],
        type: ctx.params.type || ACTOR_TYPES.PERSON,
        preferredUsername: ctx.params.preferredUsername,
        name: ctx.params.name,
        following: actorUri + '/following',
        followers: actorUri + '/followers',
        inbox: actorUri + '/inbox',
        outbox: actorUri + '/outbox'
      };

      actor = await this._create(ctx, actor);

      this.broker.emit('actor.created', actor);

      return actor;
    }
  },
  events: {
    async 'webid.created'(userData) {
      await this.broker.call('activitypub.actor.create', {
        '@id': userData['@id'],
        slug: userData.nick,
        preferredUsername: userData.nick,
        name: userData.name + ' ' + userData.familyName
      });
    },
    'actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
