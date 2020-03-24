const { MoleculerError, ServiceSchemaError } = require('moleculer').Errors;
const { JsonLdStorageMixin } = require('@semapps/ldp');

const WebhooksService = {
  name: 'webhooks',
  mixins: [JsonLdStorageMixin],
  collection: 'webhooks',
  settings: {
    // To be set by user
    baseUri: null,
    usersContainer: null,
    allowedActions: [],
    // Set automatically
    containerUri: null,
    context: null
  },
  async started() {
    this.settings.allowedActions.forEach(actionName => {
      if (!this.actions[actionName]) {
        throw new ServiceSchemaError(`Missing action "${actionName}" in service settings!`);
      }
    });
    this.settings.containerUri = this.settings.baseUri + 'webhooks/';
    this.settings.context = {
      '@vocab': this.settings.baseUri + 'ontology/semapps#'
    };
  },
  actions: {
    async process(ctx) {
      const { hash, ...data } = ctx.params;
      const webhook = await this.actions.get({ id: hash });
      if (webhook) {
        return await this.actions[webhook.action]({ data, user: webhook.user });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async generate(ctx) {
      let userId = ctx.meta.webId || ctx.params.userId,
        action = ctx.params.action;

      if (!userId || !action || !this.settings.allowedActions.includes(action)) {
        throw new MoleculerError('Bad request', 400, 'BAD_REQUEST');
      }

      if (!userId.startsWith('http')) userId = this.settings.usersContainer + userId;

      const webhook = await this.actions.create({
        '@type': 'Webhook',
        action,
        user: userId
      });

      return webhook['@id'];
    }
  }
};

module.exports = WebhooksService;
