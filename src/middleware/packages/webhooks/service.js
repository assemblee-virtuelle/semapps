const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const { MoleculerError, ServiceSchemaError } = require('moleculer').Errors;
const { TripleStoreAdapter } = require('@semapps/ldp');

const WebhooksService = {
  name: 'webhooks',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null,
    allowedActions: [],
    context: { '@vocab': 'http://semapps.org/ns/core#' }
  },
  async started() {
    this.settings.allowedActions.forEach(actionName => {
      if (!this.actions[actionName]) {
        throw new ServiceSchemaError(`Missing action "${actionName}" in service settings!`);
      }
    });
  },
  actions: {
    async process(ctx) {
      const { hash, ...data } = ctx.params;
      try {
        const webhook = await this.actions.get({ id: hash });
        if (this.createJob) {
          this.createJob('webhooks', webhook.action, { data, user: webhook.user });
        } else {
          // If no queue service is defined, run webhook immediately
          return await this.actions[webhook.action]({ data, user: webhook.user });
        }
      } catch (e) {
        console.error(e);
        ctx.meta.$statusCode = 404;
      }
    },
    async generate(ctx) {
      let userUri = ctx.meta.webId || ctx.params.userUri,
        action = ctx.params.action;

      if (!userUri || !action || !this.settings.allowedActions.includes(action)) {
        throw new MoleculerError('Bad request', 400, 'BAD_REQUEST');
      }

      const webhook = await this.actions.create({
        '@type': 'Webhook',
        action,
        user: userUri
      });

      return webhook['@id'];
    },
    getApiRoutes() {
      return [
        // Unsecured routes
        {
          bodyParsers: { json: true },
          authorization: false,
          authentication: true,
          aliases: {
            'POST webhooks/:hash': 'webhooks.process'
          }
        },
        // Secured routes
        {
          bodyParsers: { json: true },
          authorization: true,
          authentication: false,
          aliases: {
            'POST webhooks': 'webhooks.generate'
          }
        }
      ];
    }
  },
  queues: {
    webhooks: {
      name: '*',
      async process(job) {
        const result = await this.actions[job.name](job.data);

        job.progress(100);

        return {
          result
        };
      }
    }
  }
};

module.exports = WebhooksService;
