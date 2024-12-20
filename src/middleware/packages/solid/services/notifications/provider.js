const QueueMixin = require('moleculer-bull');
const { notify } = require('@semapps/ontologies');
const WebhookChannelService = require('./channels/webhook-channel');
const WebSocketChannelService = require('./channels/websocket-channel');

module.exports = {
  name: 'solid-notifications.provider',
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
        name: 'solid-notifications.provider.webhook',
        mixins: [WebhookChannelService, QueueMixin(queueServiceUrl)],
        settings: { baseUrl, settingsDataset }
      });
    }

    if (channels.websocket) {
      this.broker.createService({
        name: 'solid-notifications.provider.websocket',
        mixins: [WebSocketChannelService],
        settings: { baseUrl, settingsDataset }
      });
    }
  },
  async started() {
    await this.broker.call('ontologies.register', notify);
  }
};
