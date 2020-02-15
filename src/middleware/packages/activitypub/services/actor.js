const ActorService = {
  name: 'activitypub.actor',
  dependencies: ['activitypub.collection', 'ldp'],
  actions: {
    async create(ctx) {
      // console.log('ACTION activitypub.actor.create');
      const actorUri = ctx.params.userData['@id'];
      // console.log('actorUri',actorUri);

      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/following' });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/followers' });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/inbox' });
      await ctx.call('activitypub.collection.create', { collectionUri: actorUri + '/outbox' });

      // Attach the newly-created collections to the user's profile
      await this.broker.call('ldp.patch', {
        accept: 'json',
        resource:{
          '@id': actorUri,
          '@context': 'https://www.w3.org/ns/activitystreams',
          // TODO find a way to add two types with the patch method
          '@type': ['Person', 'http://xmlns.com/foaf/0.1/Person'],
          preferredUsername: ctx.params.userData.nick,
          name: ctx.params.userData.name + ' ' + ctx.params.userData.familyName,
          following: actorUri + '/following',
          followers: actorUri + '/followers',
          inbox: actorUri + '/inbox',
          outbox: actorUri + '/outbox'
        }
      });
      this.broker.emit('actor.created', ctx.params.userData);
    }
  },
  events: {
    async 'webid.created'(userData) {
      await this.broker.call('activitypub.actor.create', { userData });
    },
    'actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};

module.exports = ActorService;
