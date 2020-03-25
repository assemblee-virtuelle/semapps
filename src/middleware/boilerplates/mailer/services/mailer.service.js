const mailer = require('nodemailer');
const Handlebars = require('handlebars');
const fs = require('fs').promises;
const { ACTIVITY_TYPES } = require('@semapps/activitypub');
const CONFIG = require('../config');

const MailerService = {
  name: 'mailer',
  dependencies: ['match-bot', 'activitypub.actor', 'mail-queue'],
  settings: {
    baseUri: CONFIG.HOME_URL,
    fromEmail: 'reconnexion.app@gmail.com',
    fromName: 'Colibris la Fabrique',
    smtpServer: {
      host: CONFIG.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: CONFIG.SMTP_USER,
        pass: CONFIG.SMTP_PASS
      }
    },
    // Set automatically
    matchBotUri: null
  },
  async started() {
    this.settings.matchBotUri = await this.broker.call('match-bot.getUri');

    this.transporter = mailer.createTransport(this.settings.smtpServer);

    const confirmationMailFile = await fs.readFile(__dirname + '/../templates/confirmation-mail.html');
    this.confirmationMailTemplate = Handlebars.compile(confirmationMailFile.toString());

    const notificationMailFile = await fs.readFile(__dirname + '/../templates/notification-mail.html');
    this.notificationMailTemplate = Handlebars.compile(notificationMailFile.toString());
  },
  actions: {
    async processQueue(ctx) {
      const { frequency } = ctx.params;

      const mails = await this.broker.call('mail-queue.find', {
        query: { frequency, sentAt: null, errorResponse: null }
      });

      for (let mail of mails) {
        const info = await this.actions.sendNotificationMail({ mail });

        if (info.accepted.length > 0) {
          // Mark mail as sent
          await this.broker.call('mail-queue.update', {
            id: mails[0]['@id'],
            sentAt: new Date().toISOString()
          });
        } else {
          // Mark mail as error
          await this.broker.call('mail-queue.update', {
            id: mails[0]['@id'],
            errorResponse: info.response
          });
        }
      }
    },
    async sendNotificationMail(ctx) {
      const { mail } = ctx.params;
      const actor = await this.broker.call('activitypub.actor.get', { id: mail['actor'] });

      let themes = await ctx.call('theme.get', { id: actor['pair:hasInterest'] });
      if (!Array.isArray(themes)) themes = [themes];

      const html = this.notificationMailTemplate({
        projects: mail.objects,
        locationParam: actor.location ? `A ${actor.location.radius / 1000} km de chez vous` : 'Dans le monde entier',
        themeParam: `Concernant les thématiques: ${themes.map(theme => theme.preferedLabel).join(', ')}`,
        preferencesUrl: this.settings.baseUri + '?id=' + actor['@id'],
        email: actor['pair:e-mail']
      });

      return await this.transporter.sendMail({
        from: `"${this.settings.fromName}" <${this.settings.fromEmail}>`,
        to: actor['pair:e-mail'],
        subject: 'Nouveaux projets sur la Fabrique',
        // text: "Hello world",
        html
      });
    },
    async sendConfirmationMail(ctx) {
      const { actor } = ctx.params;

      let themes = await ctx.call('theme.get', { id: actor['pair:hasInterest'] });
      if (!Array.isArray(themes)) themes = [themes];

      const html = this.confirmationMailTemplate({
        locationParam: actor.location ? `A ${actor.location.radius / 1000} km de chez vous` : 'Dans le monde entier',
        themeParam: `Concernant les thématiques: ${themes.map(theme => theme.preferedLabel).join(', ')}`,
        frequency: actor['semapps:mailFrequency'] === 'daily' ? 'une fois par jour' : 'une fois par semaine',
        preferencesUrl: this.settings.baseUri + '?id=' + actor['@id'],
        email: actor['pair:e-mail']
      });

      return await this.transporter.sendMail({
        from: `"${this.settings.fromName}" <${this.settings.fromEmail}>`,
        to: actor['pair:e-mail'],
        subject: 'Notification des nouveaux projets sur la Fabrique',
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
      const mails = await this.broker.call('mail-queue.find', {
        query: { actor: actor['@id'], sentAt: null, errorResponse: null }
      });

      if (mails.length > 0) {
        // Add the object to the existing mail
        this.broker.call('mail-queue.update', {
          '@id': mails[0]['@id'],
          objects: [object, ...mails[0].objects]
        });
      } else {
        // Create a new mail for the actor
        this.broker.call('mail-queue.create', {
          '@type': 'Mail',
          actor: actor['@id'],
          objects: [object],
          frequency: actor['semapps:mailFrequency'],
          sentAt: null,
          errorResponse: null
        });
      }
    }
  }
};

module.exports = MailerService;
