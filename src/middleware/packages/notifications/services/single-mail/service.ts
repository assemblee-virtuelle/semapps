import urlJoin from 'url-join';
import path from 'path';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import MailService from 'moleculer-mail';
import { getSlugFromUri } from '@semapps/ldp';
import { ServiceSchema, defineServiceEvent } from 'moleculer';

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

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
    'activitypub.inbox.received': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'activity' does not exist on type 'Servic... Remove this comment to see the full error message
        const { activity, recipients } = ctx.params;

        // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
        if (this.settings.delay) {
          // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
          await delay(this.settings.delay);
        }

        for (const recipientUri of recipients) {
          const account = await ctx.call('auth.account.findByWebId', { webId: recipientUri });

          if (account) {
            // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
            ctx.meta.webId = recipientUri;
            // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
            ctx.meta.dataset = this.settings.podProvider ? getSlugFromUri(recipientUri) : undefined;

            // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
            const locale = account?.preferredLocale || this.settings.defaultLocale;
            const notification = await ctx.call('activity-mapping.map', { activity, locale });

            // @ts-expect-error TS(2339): Property 'filterNotification' does not exist on ty... Remove this comment to see the full error message
            if (notification && (await this.filterNotification(notification, activity, recipientUri))) {
              if (notification.actionLink)
                // @ts-expect-error TS(2339): Property 'formatLink' does not exist on type 'Serv... Remove this comment to see the full error message
                notification.actionLink = await this.formatLink(notification.actionLink, recipientUri);

              // @ts-expect-error TS(2339): Property 'queueMail' does not exist on type 'Servi... Remove this comment to see the full error message
              await this.queueMail(ctx, notification.key, {
                to: account.email,
                locale,
                data: {
                  ...notification,
                  // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
                  color: this.settings.color,
                  descriptionWithBr: notification.description
                    ? notification.description.replace(/\r\n|\r|\n/g, '<br />')
                    : undefined
                }
              });
            }
          } else {
            // @ts-expect-error TS(2339): Property 'logger' does not exist on type 'ServiceE... Remove this comment to see the full error message
            this.logger.warn(`No account found for local recipient ${recipientUri}`);
          }
        }
      }
    })
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
      // @ts-expect-error TS(7023): 'process' implicitly has return type 'any' because... Remove this comment to see the full error message
      async process(job: any) {
        job.progress(0);
        // @ts-expect-error TS(7022): 'result' implicitly has type 'any' because it does... Remove this comment to see the full error message
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
