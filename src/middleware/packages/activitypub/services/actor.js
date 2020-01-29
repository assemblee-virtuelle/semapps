module.exports = {
  name: 'activitypub.actor',
  dependencies: ['activitypub.collection', 'webid'],
  events: {
    async 'webid.created'({ webId, userData }) {
      await this.broker.call('activitypub.collection.create', { collectionUri: webId + '/following' });
      await this.broker.call('activitypub.collection.create', { collectionUri: webId + '/followers' });
      await this.broker.call('activitypub.collection.create', { collectionUri: webId + '/inbox' });
      await this.broker.call('activitypub.collection.create', { collectionUri: webId + '/outbox' });

      // Attach the newly-created collections to the user's profile
      await this.broker.call('ldp.patch', {
        resourceUri: webId,
        '@context': 'https://www.w3.org/ns/activitystreams',
        '@type': 'Person',
        preferredUsername: userData.nick,
        name: userData.name + ' ' + userData.familyName,
        following: webId + '/following',
        followers: webId + '/followers',
        inbox: webId + '/inbox',
        outbox: webId + '/outbox'
      });

      this.broker.emit('actor.created', { uri: webId });
    },
    'actor.created'() {
      // Do nothing. We must define one event listener for EventsWatcher middleware to act correctly.
    }
  }
};
