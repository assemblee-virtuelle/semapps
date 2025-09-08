import fetch from 'node-fetch';
import NotificationChannelMixin from './notification-channel.mixin.ts';
import { ServiceSchema } from 'moleculer';

const queueOptions =
  process.env.NODE_ENV === 'test'
    ? {}
    : {
        // Keep completed jobs for 3 days
        removeOnComplete: { age: 259200 },
        // Try again after 3 minutes and until 48 hours later
        // Method to calculate it: Math.round((Math.pow(2, attemptsMade) - 1) * delay)
        attempts: 10,
        backoff: { type: 'exponential', delay: '180000' }
      };

/** @type {import('moleculer').ServiceSchema} */
const WebhookChannel2023Service = {
  name: 'solid-notifications.provider.webhook' as const,
  mixins: [NotificationChannelMixin],
  settings: {
    channelType: 'WebhookChannel2023',
    sendOrReceive: 'send',
    baseUrl: null,
    typeIndex: 'private',
    endpoint: {
      path: '/.notifications/WebhookChannel2023',
      initialData: {
        'notify:channelType': 'notify:WebhookChannel2023',
        'notify:feature': ['notify:endAt', 'notify:rate', 'notify:startAt', 'notify:state']
      }
    }
  },
  created() {
    if (!this.createJob) throw new Error('The QueueMixin must be configured with this service');
  },
  actions: {
    getAppChannels: {
      async handler(ctx) {
        const { appUri, webId } = ctx.params;
        const { origin: appOrigin } = new URL(appUri);
        return this.channels.filter(c => c.webId === webId && c.sendTo.startsWith(appOrigin));
      }
    },

    deleteAppChannels: {
      async handler(ctx) {
        const { appUri, webId } = ctx.params;
        const appChannels = await this.actions.getAppChannels({ appUri, webId }, { parentCtx: ctx });
        for (const appChannel of appChannels) {
          await this.actions.delete({ resourceUri: appChannel.id, webId: appChannel.webId });
        }
      }
    }
  },
  methods: {
    onEvent(channel, activity) {
      this.createJob('webhookPost', channel.sendTo, { channel, activity }, queueOptions);
    }
  },
  queues: {
    webhookPost: {
      name: '*',
      async process(job) {
        const { channel, activity } = job.data;

        try {
          const response = await fetch(channel.sendTo, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/ld+json'
            },
            body: JSON.stringify({
              ...activity,
              published: new Date().toISOString()
            })
          });

          if (response.status >= 400) {
            await this.actions.delete({ resourceUri: channel.id, webId: channel.webId });
            throw new Error(
              `Webhook ${channel.sendTo} returned a ${response.status} error (${response.statusText}). It has been deleted.`
            );
          } else {
            job.progress(100);
          }

          return { ok: response.ok, status: response.status, statusText: response.statusText };
        } catch (e) {
          if (job.attemptsMade + 1 >= job.opts.attempts) {
            this.logger.warn(`Webhook ${channel.sendTo} failed ${job.opts.attempts} times, deleting it...`);
            // DO NOT DELETE YET TO IMPROVE MONITORING
            // await this.actions.delete({ resourceUri: channel.id, webId: channel.webId });
          }

          throw new Error(`Posting to webhook ${channel.sendTo} failed. Error: ${e.message}`);
        }
      }
    }
  }
} satisfies ServiceSchema;

export default WebhookChannel2023Service;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebhookChannel2023Service.name]: typeof WebhookChannel2023Service;
    }
  }
}
