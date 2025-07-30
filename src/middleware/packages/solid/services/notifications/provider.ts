// @ts-expect-error TS(7016): Could not find a declaration file for module 'mole... Remove this comment to see the full error message
import QueueMixin from 'moleculer-bull';
import { notify } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import WebhookChannelService from './channels/webhook-channel.ts';
import WebSocketChannelService from './channels/websocket-channel.ts';

const SolidNotificationsProviderSchema = {
  name: 'solid-notifications.provider' as const,
  settings: {
    baseUrl: null,
    settingsDataset: null,
    queueServiceUrl: null,
    channels: {
      webhook: true,
      websocket: true
    }
  },
  dependencies: ['api', 'ontologies'],
  async created() {
    const { baseUrl, settingsDataset, queueServiceUrl, channels } = this.settings;
    if (!baseUrl) throw new Error(`The baseUrl setting is required`);
    if (!settingsDataset) throw new Error(`The settingsDataset setting is required`);
    if (channels.webhook && !queueServiceUrl)
      throw new Error(`The queueServiceUrl setting is required if webhooks are activated`);

    if (channels.webhook) {
      this.broker.createService({
        name: 'solid-notifications.provider.webhook' as const,
        mixins: [WebhookChannelService, QueueMixin(queueServiceUrl)],
        settings: { baseUrl, settingsDataset }
      });
    }

    if (channels.websocket) {
      this.broker.createService({
        name: 'solid-notifications.provider.websocket' as const,
        mixins: [WebSocketChannelService],
        settings: { baseUrl, settingsDataset }
      });
    }
  },
  async started() {
    await this.broker.call('ontologies.register', notify);
  }
} satisfies ServiceSchema;

export default SolidNotificationsProviderSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SolidNotificationsProviderSchema.name]: typeof SolidNotificationsProviderSchema;
    }
  }
}
