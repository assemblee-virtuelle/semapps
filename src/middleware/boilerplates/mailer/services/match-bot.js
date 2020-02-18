const { BotService } = require('@semapps/activitypub');
const CONFIG = require('../config');

const MatchBotService = {
  name: 'match-bot',
  mixins: [BotService],
  dependencies: ['activitypub.outbox'],
  settings: {
    actor: {
      uri: CONFIG.HOME_URL + 'users/' + 'match-bot',
      username: 'match-bot',
      name: 'Match Bot'
    }
  },
  actorCreated(actor, broker) {
    // broker.call('activitypub.outbox.post', {
    //   username: actor.preferredUsername,
    //   '@context': 'https://www.w3.org/ns/activitystreams',
    //   actor: actor.id,
    //   type: 'Follow',
    //   object: 'http://localhost:3000/users/srosset81'
    // });
  },
  inboxReceived(activity) {
    console.log('Activity received in inbox', activity);
  }
};

module.exports = MatchBotService;
