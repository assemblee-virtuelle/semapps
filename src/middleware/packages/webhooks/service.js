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
  dependencies: ['api'],
  async started() {
    this.settings.allowedActions.forEach(actionName => {
      if (!this.actions[actionName]) {
        throw new ServiceSchemaError(`Missing action "${actionName}" in service settings!`);
      }
    });
    const routes = await this.actions.getApiRoutes();
    for (const route of routes) {
      await this.broker.call('api.addRoute', {
        route
      });
    }
  },
  actions: {
    async process(ctx) {
      const { hash, ...data } = ctx.params;
      let webhook;

      try {
        webhook = await this.actions.get({ id: hash }, { parentCtx: ctx });
      } catch (e) {
        throw new MoleculerError('Webhook not found', 404, 'NOT_FOUND');
      }

      if (this.createJob) {
        this.createJob('webhooks', webhook.action, { data, user: webhook.user });
      } else {
        // If no queue service is defined, run webhook immediately
        return await this.actions[webhook.action]({ data, user: webhook.user }, { parentCtx: ctx });
      }
    },
    async generate(ctx) {
      const userUri = ctx.meta.webId || ctx.params.userUri;
      const { action } = ctx.params;

      if (!userUri || !action || !this.settings.allowedActions.includes(action)) {
        throw new MoleculerError('Bad request', 400, 'BAD_REQUEST');
      }

      const webhook = await this.actions.create(
        {
          '@type': 'Webhook',
          action,
          user: userUri
        },
        { parentCtx: ctx }
      );

      return webhook['@id'];
    },
    getApiRoutes() {
      return [
        // Unsecured routes
        {
          path: '/webhooks',
          name: 'webhooks-process',
          bodyParsers: { json: true },
          authorization: false,
          authentication: true,
          aliases: {
            'POST /:hash': 'webhooks.process'
          }
        },
        // Secured routes
        {
          path: '/webhooks',
          name: 'webhooks-generate',
          bodyParsers: { json: true },
          authorization: true,
          authentication: false,
          aliases: {
            'POST /': 'webhooks.generate'
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
