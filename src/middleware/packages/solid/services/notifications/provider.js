const urlJoin = require('url-join');
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
  dependencies: ['api', 'ldp.link-header', 'ontologies'],
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

    await this.broker.call('ldp.link-header.register', { actionName: 'solid-notifications.provider.getLink' });

    await this.broker.call('api.addRoute', {
      route: {
        name: 'solid',
        path: '/.well-known/solid',
        authorization: false,
        authentication: false,
        aliases: {
          'GET /': 'solid-notifications.provider.discover'
        }
      }
    });
  },
  actions: {
    discover(ctx) {
      // TODO Handle content negotiation
      ctx.meta.$responseType = 'application/ld+json';
      // Cache for 1 days.
      ctx.meta.$responseHeaders = { 'Cache-Control': 'public, max-age=86400' };

      const subscriptions = [];
      if (this.settings.channels.webhook)
        subscriptions.push(urlJoin(this.settings.baseUrl, '.notifications', 'WebSocketChannel2023'));
      if (this.settings.channels.websocket)
        subscriptions.push(urlJoin(this.settings.baseUrl, '.notifications', 'WebhookChannel2023'));

      return {
        '@context': { notify: 'http://www.w3.org/ns/solid/notifications#' },
        '@id': urlJoin(this.settings.baseUrl, '.well-known', 'solid'),
        '@type': 'http://www.w3.org/ns/pim/space#Storage',
        'notify:subscription': subscriptions
      };
    },
    getLink() {
      return {
        uri: urlJoin(this.settings.baseUrl, '.well-known', 'solid'),
        rel: 'http://www.w3.org/ns/solid/terms#storageDescription'
      };
    }
  }
};
