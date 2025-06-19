import urlJoin from 'url-join';
import path from 'path';
import MailService from 'moleculer-mail';
import { getSlugFromUri } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';

const delay = t => new Promise(resolve => setTimeout(resolve, t));

const SingleMailNotificationsService = {
  name: 'notifications.single-mail' as const,
  mixins: [MailService],
  settings: {
    defaultLocale: 'en',
    defaultFrontUrl: null,
    color: '#E2003B',
    delay: 0,
    podProvider: false,
    // See moleculer-mail doc https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-mail
    templateFolder: path.join(__dirname, '../../templates'),
    from: null,
    transport: null,
    data: {}
  },
  events: {
    async 'activitypub.inbox.received'(ctx) {
      const { activity, recipients } = ctx.params;

      if (this.settings.delay) {
        await delay(this.settings.delay);
      }

      for (const recipientUri of recipients) {
        const account = await ctx.call('auth.account.findByWebId', { webId: recipientUri });

        if (account) {
          ctx.meta.webId = recipientUri;
          ctx.meta.dataset = this.settings.podProvider ? getSlugFromUri(recipientUri) : undefined;

          const locale = account?.preferredLocale || this.settings.defaultLocale;
          const notification = await ctx.call('activity-mapping.map', { activity, locale });

          if (notification && (await this.filterNotification(notification, activity, recipientUri))) {
            if (notification.actionLink)
              notification.actionLink = await this.formatLink(notification.actionLink, recipientUri);

            await this.queueMail(ctx, notification.key, {
              to: account.email,
              locale,
              data: {
                ...notification,
                color: this.settings.color,
                descriptionWithBr: notification.description
                  ? notification.description.replace(/\r\n|\r|\n/g, '<br />')
                  : undefined
              }
            });
          }
        } else {
          this.logger.warn(`No account found for local recipient ${recipientUri}`);
        }
      }
    }
  },
  methods: {
    // Optional method called for each notification
    // Return true if you want the notification to be sent by email
    async filterNotification(notification, activity, recipientUri) {
      return true;
    },
    // Method called to format "actionLink" returned for each notification
    // You can overwrite it to adapt it to your needs
    async formatLink(link, recipientUri) {
      if (link && !link.startsWith('http')) {
        return urlJoin(this.settings.defaultFrontUrl, link);
      }
      return link;
    },
    async queueMail(ctx, key, payload) {
      payload.template = 'single-mail';
      if (this.createJob) {
        return this.createJob('sendMail', key, payload);
      }
      await this.actions.send(payload, { parentCtx: ctx });
    }
  },
  queues: {
    sendMail: {
      name: '*' as const,
      async process(job) {
        job.progress(0);
        const result = await this.actions.send(job.data);
        job.progress(100);
        return result;
      }
    }
  }
} satisfies ServiceSchema;

export default SingleMailNotificationsService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SingleMailNotificationsService.name]: typeof SingleMailNotificationsService;
    }
  }
}
