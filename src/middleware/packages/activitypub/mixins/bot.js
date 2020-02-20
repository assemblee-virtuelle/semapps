const { ACTOR_TYPES } = require('../constants');

const BotService = {
  name: '', // Must be overwritten
  settings: {
    actor: {
      username: null,
      name: null,
      uri: null // Automatically set
    }
  },
  dependencies: ['activitypub.actor'],
  actions: {
    getUri(ctx) {
      return this.settings.actor.uri;
    }
  },
  async started(ctx) {
    const actorSettings = this.settings.actor;
    if (!actorSettings.username || !actorSettings.name) {
      return Promise.reject(new Error('Please set the actor settings in schema!'));
    }

    let actor = await this.broker.call('activitypub.actor.get', {
      id: actorSettings.username
    });

    if (!actor) {
      console.log(`BotService > Actor ${actorSettings.username} does not exist yet, create it...`);

      actor = await this.broker.call('activitypub.actor.create', {
        slug: actorSettings.username,
        type: ACTOR_TYPES.APPLICATION,
        preferredUsername: actorSettings.username,
        name: actorSettings.name
      });

      if (this.actorCreated) {
        this.actorCreated(actor);
      }
    }

    this.settings.actor.uri = actor['@id'];
  },
  events: {
    'activitypub.inbox.received'(params) {
      if (this.inboxReceived) {
        if (params.recipients.includes(this.settings.actor.uri)) {
          this.inboxReceived(params.activity);
        }
      }
    }
  },
  methods: {
    async getFollowers() {
      const result = await this.broker.call('activitypub.follow.listFollowers', {
        username: this.settings.actor.username
      });
      return result && result.items;
    }
  }
};

module.exports = BotService;
