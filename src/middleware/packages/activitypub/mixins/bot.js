const { ACTOR_TYPES } = require('../constants');

const BotService = {
  name: '', // Must be overwritten
  settings: {
    actor: {
      uri: null,
      username: null,
      name: null
    }
  },
  dependencies: ['activitypub.actor'],
  async started(ctx) {
    const actorSettings = this.settings.actor;
    if (!actorSettings.uri || !actorSettings.username || !actorSettings.name) {
      return Promise.reject(new Error('Please set the actor settings in schema!'));
    }

    let actor = await this.broker.call('activitypub.actor.get', {
      id: actorSettings.uri
    });

    if (!actor) {
      console.log(`BotService > Actor ${actorSettings.uri} does not exist yet, create it...`);

      actor = await this.broker.call('activitypub.actor.create', {
        '@id': actorSettings.uri,
        type: ACTOR_TYPES.APPLICATION,
        preferredUsername: actorSettings.username,
        name: actorSettings.name
      });

      if (this.schema.actorCreated) {
        this.schema.actorCreated(actor, this.broker);
      }
    }
  },
  events: {
    'activitypub.inbox.received'(params) {
      if (this.schema.inboxReceived) {
        if (params.recipients.includes(this.settings.actor.uri)) {
          this.schema.inboxReceived(params.activity);
        }
      }
    }
  }
};

module.exports = BotService;
