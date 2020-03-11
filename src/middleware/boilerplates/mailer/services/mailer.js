const { ACTIVITY_TYPES } = require('@semapps/activitypub');

const MailerService = {
  name: 'mailer',
  dependencies: ['match-bot', 'activitypub.actor', 'mail-queue'],
  settings: {
    matchBotUri: null // Set automatically
  },
  async started() {
    this.settings.matchBotUri = await this.broker.call('match-bot.getUri');
  },
  actions: {
    async processQueue(ctx) {
      const { frequency } = ctx.params;

      const mails = await this.broker.call('mail-queue.find', { query: { frequency, sentAt: null } });

      for( let mail of mails ) {

        await this.sendMail(mail);

        // Mark email as sent
        // await this.broker.call('mail-queue.update', {
        //   id: mails[0]['@id'],
        //   sentAt: new Date().toISOString()
        // });
      }
    }
  },
  events: {
    async 'activitypub.inbox.received'({ activity, recipients }) {
      if (activity.actor === this.settings.matchBotUri && activity.type === ACTIVITY_TYPES.ANNOUNCE) {
        for (let actorUri of recipients) {
          const actor = await this.broker.call('activitypub.actor.get', { id: actorUri });
          this.queueObject(actor, { '@context': activity['@context'], ...activity.activity.object });
        }
      }
    }
  },
  methods: {
    async queueObject(actor, object) {
      // Find if there is a mail in queue for the actor
      const mails = await this.broker.call('mail-queue.find', { query: { actor: actor['@id'], sentAt: null } });

      console.log('mails', mails, actor);

      if( mails.length > 0 ) {
        // Add the object to the existing email
        this.broker.call('mail-queue.update', {
          '@id': mails[0]['@id'],
          objects: [
            object,
            ...mails[0].objects
          ]
        });
      } else {
        // Create a new email for the actor
        this.broker.call('mail-queue.create', {
          '@type': 'Mail',
          actor: actor['@id'],
          objects: [
            object
          ],
          frequency: actor['semapps:mailFrequency'],
          sentAt: null
        });
      }
    },
    async sendMail(mail) {
      const actor = await this.broker.call('activitypub.actor.get', { id: mail['actor'] });

      console.log('Sending email to : ', actor['pair:e-mail'], mail);
    }
  }
};

module.exports = MailerService;
