import path from 'path';
import DbService from 'moleculer-db';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema, defineAction, Errors as MoleculerErrors } from 'moleculer';

const { MoleculerError, ServiceSchemaError } = MoleculerErrors;

const WebhooksService = {
  name: 'webhooks' as const,
  mixins: [DbService],
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null,
    allowedActions: [],
    context: { '@vocab': 'http://semapps.org/ns/core#' }
  },
  dependencies: ['api', 'ldp'],
  async started() {
    this.settings.allowedActions.forEach((actionName: any) => {
      if (!this.actions[actionName]) {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        throw new ServiceSchemaError(`Missing action "${actionName}" in service settings!`);
      }
    });
    const basePath = await this.broker.call('ldp.getBasePath');
    for (const route of await this.actions.getApiRoutes(basePath)) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    process: defineAction({
      async handler(ctx) {
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
      }
    }),

    generate: defineAction({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
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
      }
    }),

    getApiRoutes: defineAction({
      handler(basePath) {
        return [
          // Unsecured routes
          {
            // @ts-expect-error TS(2345): Argument of type 'Context<Optionalize<{ [x: string... Remove this comment to see the full error message
            path: path.join(basePath, '/webhooks'),
            name: 'webhooks-process' as const,
            bodyParsers: { json: true },
            authorization: false,
            authentication: true,
            aliases: {
              'POST /:hash': 'webhooks.process'
            }
          },
          // Secured routes
          {
            // @ts-expect-error TS(2345): Argument of type 'Context<Optionalize<{ [x: string... Remove this comment to see the full error message
            path: path.join(basePath, '/webhooks'),
            name: 'webhooks-generate' as const,
            bodyParsers: { json: true },
            authorization: true,
            authentication: false,
            aliases: {
              'POST /': 'webhooks.generate'
            }
          }
        ];
      }
    })
  },
  queues: {
    webhooks: {
      name: '*' as const,
      // @ts-expect-error TS(7023): 'process' implicitly has return type 'any' because... Remove this comment to see the full error message
      async process(job: any) {
        // @ts-expect-error TS(7022): 'result' implicitly has type 'any' because it does... Remove this comment to see the full error message
        const result = await this.actions[job.name](job.data);

        job.progress(100);

        return {
          result
        };
      }
    }
  }
} satisfies ServiceSchema;

export default WebhooksService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebhooksService.name]: typeof WebhooksService;
    }
  }
}
