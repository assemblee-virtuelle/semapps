const QueueMixin = require('moleculer-bull');
const { notify } = require('@semapps/ontologies');
const WebhookChannelService = require('./channels/webhook-channel');
const WebSocketChannelService = require('./channels/websocket-channel');

module.exports = {
  name: 'solid-notifications.provider',
  settings: {
    baseUrl: null,
    queueServiceUrl: null,
    channels: {
      webhook: true,
      websocket: true
    }
  },
  dependencies: ['api', 'ontologies'],
  async created() {
    const { baseUrl, queueServiceUrl, channels } = this.settings;
    if (!baseUrl) throw new Error(`The baseUrl setting is required`);
    if (channels.webhook && !queueServiceUrl)
      throw new Error(`The queueServiceUrl setting is required if webhooks are activated`);

    if (channels.webhook) {
      this.broker.createService({
        name: 'solid-notifications.provider.webhook',
        mixins: [WebhookChannelService, QueueMixin(queueServiceUrl)],
        settings: { baseUrl }
      });
    }

    if (channels.websocket) {
      this.broker.createService({
        name: 'solid-notifications.provider.websocket',
        mixins: [WebSocketChannelService],
        settings: { baseUrl }
      });
    }
  },
  async started() {
    await this.broker.call('ontologies.register', notify);
  }
};
