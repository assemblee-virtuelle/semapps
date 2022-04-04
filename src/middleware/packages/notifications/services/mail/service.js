const urlJoin = require('url-join');
const MailService = require('moleculer-mail');

const MailNotificationsService = {
  name: 'notifications.mail',
  mixins: [MailService],
  settings: {
    defaultLocale: 'en',
    defaultFrontUrl: null,
    // See moleculer-mail doc https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-mail
    templateFolder: null,
    from: null,
    transport: null,
    data: {}
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients } = ctx.params;

      for (let recipientUri of recipients) {
        const account = await ctx.call('auth.account.findByWebId', { webId: recipientUri });
        const locale = account.preferredLocale || this.settings.defaultLocale;
        const frontUrl = account.preferredFrontUrl || this.settings.defaultFrontUrl;

        const notification = await ctx.call('activity-mapping.map', { activity, locale });

        if (notification.actionLink) notification.actionLink = urlJoin(frontUrl, notification.actionLink);

        await this.queueMail(ctx, notification.key, {
          to: account.email,
          data: {
            ...notification,
            descriptionWithBr: notification.description
              ? notification.description.replace(/\r\n|\r|\n/g, '<br />')
              : undefined
          }
        });
      }
    }
  },
  methods: {
    async queueMail(ctx, key, payload) {
      payload.template = 'simple-email';
      if (this.createJob) {
        return this.createJob('sendMail', key, payload);
      } else {
        await ctx.call('notification.send', payload);
      }
    }
  },
  queues: {
    sendMail: {
      name: '*',
      async process(job) {
        job.progress(0);
        const result = await this.broker.call('notification.send', job.data);
        job.progress(100);
        return result;
      }
    }
  }
};

module.exports = MailNotificationsService;
