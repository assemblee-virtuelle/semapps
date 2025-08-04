import path from 'path';
import DbService from 'moleculer-db';
const { MoleculerError, ServiceSchemaError } = require('moleculer').Errors;
import { TripleStoreAdapter } from '@semapps/triplestore';

const WebhooksService = {
  name: 'webhooks',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null,
    allowedActions: [],
    context: { '@vocab': 'http://semapps.org/ns/core#' }
  },
  dependencies: ['api', 'ldp'],
  async started() {
    this.settings.allowedActions.forEach(actionName => {
      if (!this.actions[actionName]) {
        throw new ServiceSchemaError(`Missing action "${actionName}" in service settings!`);
      }
    });
    const basePath = await this.broker.call('ldp.getBasePath');
    for (const route of await this.actions.getApiRoutes(basePath)) {
      await this.broker.call('api.addRoute', { route });
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

      if (!userUri || userUri === 'anon' || !action || !this.settings.allowedActions.includes(action)) {
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
    getApiRoutes(basePath) {
      return [
        // Unsecured routes
        {
          path: path.join(basePath, '/webhooks'),
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
          path: path.join(basePath, '/webhooks'),
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

export default WebhooksService;
