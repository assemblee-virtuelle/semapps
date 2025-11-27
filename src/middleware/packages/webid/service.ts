import { foaf, schema } from '@semapps/ontologies';
import { ControlledResourceMixin, DereferenceMixin, waitForResource } from '@semapps/ldp';
import { ServiceSchema } from 'moleculer';
import getRedirectRoute from './routes/getRedirectRoute.ts';

const WebIdService = {
  name: 'webid' as const,
  mixins: [ControlledResourceMixin, DereferenceMixin],
  settings: {
    path: '/webid',
    types: ['http://xmlns.com/foaf/0.1/Agent'],
    permissions: {
      anon: {
        read: true
      }
    },
    typeIndex: 'public',
    // DereferenceMixin
    dereferencePlan: [
      {
        property: 'publicKey'
      },
      { property: 'assertionMethod' }
    ]
  },
  dependencies: ['ontologies', 'api', 'ldp'],
  async started() {
    await this.broker.call('ontologies.register', foaf);
    await this.broker.call('ontologies.register', schema);

    const basePath: string = await this.broker.call('ldp.getBasePath');

    await this.broker.call('api.addRoute', { route: getRedirectRoute(basePath) });
  },
  actions: {
    redirectToWebId: {
      async handler(ctx) {
        const webId = await ctx.call('webid.getUri');
        ctx.meta.$statusCode = 301;
        ctx.meta.$location = webId;
      }
    },
    awaitCreateComplete: {
      async handler(ctx) {
        const { additionalKeys = [], delayMs = 1000, maxTries = 20 } = ctx.params;
        const keysToCheck = ['publicKey', ...additionalKeys];

        return await waitForResource(
          delayMs,
          keysToCheck,
          maxTries,
          async () => await this.actions.get({}, { parentCtx: ctx, meta: { $cache: false } })
        );
      }
    }
  }
} satisfies ServiceSchema;

export default WebIdService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebIdService.name]: typeof WebIdService;
    }
  }
}
