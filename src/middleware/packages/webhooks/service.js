const { JsonLdStorageMixin } = require('@semapps/ldp');

const WebhooksService = {
  name: 'webhooks',
  mixins: [JsonLdStorageMixin],
  collection: 'webhooks',
  dependencies: ['activitypub.outbox', 'activitypub.actor'],
  settings: {
    baseUri: null,
    containerUri: null,
    context: null
  },
  async started() {
    this.settings.containerUri = this.settings.baseUri + 'webhooks/';
    this.settings.context = {
      '@vocab': this.settings.baseUri + 'ontology/semapps#'
    };
    this.settings.actorsContainer = await this.broker.call('activitypub.actor.getContainerUri');
  },
  actions: {
    async process(ctx) {
      const { hash, ...data } = ctx.params;
      const webhook = await this.actions.get({ id: hash });
      if (webhook) {
        const transformedData = this.transformData(data, webhook.user);

        return await ctx.call('activitypub.outbox.post', {
          collectionUri: webhook.user + '/outbox',
          '@context': 'https://www.w3.org/ns/activitystreams',
          ...transformedData
        });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async generate(ctx) {
      const user = ctx.params.userUri.startsWith('http')
        ? ctx.params.userUri
        : this.settings.actorsContainer + ctx.params.userUri;
      return this.actions.create({
        '@type': 'Webhook',
        user
      });
    }
  },
  methods: {
    // Custom user fonction to transform received data
    transformData(data, user) {
      return data;
    }
  }
};

module.exports = WebhooksService;
