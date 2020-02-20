const { BotService } = require('@semapps/activitypub');

const MatchBotService = {
  name: 'match-bot',
  mixins: [BotService],
  settings: {
    actor: {
      username: 'match-bot',
      name: 'Match Bot'
    }
  },
  methods: {
    actorCreated(actor) {
      // this.broker.call('activitypub.outbox.post', {
      //   collectionUri: this.settings.actor.uri + '/outbox',
      //   '@context': 'https://www.w3.org/ns/activitystreams',
      //   actor: this.settings.actor.uri,
      //   type: 'Follow',
      //   object: 'URL_OF_LAFABRIQUE_ACTOR'
      // });
    },
    async inboxReceived(activity) {
      let matchingActors = [];
      const actors = await this.getFollowers();

      for (let actorUri of actors) {
        const actor = await this.broker.call('activitypub.actor.get', { id: actorUri });
        if (this.matchInterests(activity.object, actor)) {
          if (this.matchLocation(activity.object, actor)) {
            matchingActors.push(actor['@id']);
          }
        }
      }

      // If one or more actor match, announce the activity to them
      if (matchingActors.length > 0) {
        await this.broker.call('activitypub.outbox.post', {
          collectionUri: this.settings.actor.uri + '/outbox',
          '@context': activity.context,
          actor: this.settings.actor.uri,
          to: matchingActors,
          type: 'Announce',
          activity: activity
        });
      }
    },
    matchInterests(object, actor) {
      const actorInterests = Array.isArray(actor['pair:hasInterest'])
        ? actor['pair:hasInterest']
        : [actor['pair:hasInterest']];
      const activityInterests = Array.isArray(object['pair:interestOf'])
        ? object['pair:interestOf']
        : [object['pair:interestOf']];
      return actorInterests.filter(theme => activityInterests.includes(theme)).length > 0;
    },
    matchLocation(object, actor) {
      if (!actor.location) return true;
      const distance = this.distanceBetweenPoints(
        actor.location.latitude,
        actor.location.longitude,
        object.location.latitude,
        object.location.longitude
      );
      return distance <= actor.location.radius / 1000;
    },
    distanceBetweenPoints(lat1, lon1, lat2, lon2) {
      // Taken from https://stackoverflow.com/a/21623206/7900695
      const p = 0.017453292519943295; // Math.PI / 180
      const c = Math.cos;
      const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
  }
};

module.exports = MatchBotService;
