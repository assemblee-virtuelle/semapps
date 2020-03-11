const mailer = require('nodemailer');
const Handlebars = require('handlebars');
const fs = require('fs').promises;
const { ACTIVITY_TYPES } = require('@semapps/activitypub');

const MailerService = {
  name: 'mailer',
  dependencies: ['match-bot', 'activitypub.actor', 'mail-queue'],
  settings: {
    fromEmail: null,
    fromName: null,
    smtpServer: {
      host: null,
      port: 465,
      secure: true,
      auth: {
        user: null,
        pass: null
      }
    },
    // Set automatically
    matchBotUri: null
  },
  async started() {
    this.settings.matchBotUri = await this.broker.call('match-bot.getUri');

    this.transporter = mailer.createTransport(this.settings.smtpServer);

    const templateFile = await fs.readFile(__dirname + '/../templates/confirmation-mail.html');
    this.confirmationMailTemplate = Handlebars.compile(templateFile.toString());
  },
  actions: {
    async processQueue(ctx) {
      const { frequency } = ctx.params;

      const mails = await this.broker.call('mail-queue.find', { query: { frequency, sentAt: null } });

      for( let mail of mails ) {

        this.actions.sendNotificationMail({ mail });

        // Mark email as sent
        // await this.broker.call('mail-queue.update', {
        //   id: mails[0]['@id'],
        //   sentAt: new Date().toISOString()
        // });
      }
    },
    async sendNotificationMail(ctx) {
      const actor = await this.broker.call('activitypub.actor.get', { id: ctx.params.mail['actor'] });

      console.log('Sending email to : ', actor['pair:e-mail'], ctx.params.mail);
    },
    async sendConfirmationMail(ctx) {
      const { actor } = ctx.params;

      let themes = await ctx.call('theme.get', { id: actor['pair:hasInterest'] });
      if( !Array.isArray(themes) ) themes = [themes];

      const html = this.confirmationMailTemplate({
        locationParam: actor.location ? `A ${actor.location.radius / 1000} km de chez vous` : 'Dans le monde entier',
        themeParam: `Concernant les thématiques: ${themes.map(theme => theme.preferedLabel).join(', ')}`,
        frequency: actor['semapps:mailFrequency'] === 'daily' ? 'une fois par jour' : 'une fois par semaine',
        preferencesUrl: 'http://localhost:3000/?id=' + actor['@id'],
        email: actor['pair:e-mail']
      });

      this.transporter.sendMail({
        from: `"${this.settings.fromName}" <${this.settings.fromEmail}>`,
        to: "srosset81@gmail.com",
        subject: "Notification des nouveaux projets sur la Fabrique",
        // text: "Hello world",
        html
      });
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

      if( mails.length > 0 ) {
        // Add the object to the existing mail
        this.broker.call('mail-queue.update', {
          '@id': mails[0]['@id'],
          objects: [
            object,
            ...mails[0].objects
          ]
        });
      } else {
        // Create a new mail for the actor
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
    }
  }
};

module.exports = MailerService;
