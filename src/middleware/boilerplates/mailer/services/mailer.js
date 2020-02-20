const { ACTIVITY_TYPES } = require('@semapps/activitypub');

const MailerService = {
  name: 'mailer',
  dependencies: ['match-bot', 'activitypub.actor'],
  settings: {
    matchBotUri: null // Set automatically
  },
  async started() {
    this.settings.matchBotUri = await this.broker.call('match-bot.getUri');
  },
  events: {
    async 'activitypub.inbox.received'({ activity, recipients }) {
      if (activity.actor === this.settings.matchBotUri && activity.type === ACTIVITY_TYPES.ANNOUNCE) {
        for (let actorUri of recipients) {
          const actor = await this.broker.call('activitypub.actor.get', { id: actorUri });
          this.sendMail(actor, { '@context': activity['@context'], ...activity.activity.object });
        }
      }
    }
  },
  methods: {
    sendMail(actor, object) {
      console.log('Sending him to : ', actor['pair:e-mail'], object['pair:label']);
    }
  }
};

module.exports = MailerService;
