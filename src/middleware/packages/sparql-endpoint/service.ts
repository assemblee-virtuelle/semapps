import path from 'path';
import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import getRoute from './getRoute.ts';

const SparqlEndpointService = {
  name: 'sparqlEndpoint' as const,
  settings: {
    defaultAccept: 'text/turtle',
    ignoreAcl: false,
    podProvider: false
  },
  dependencies: ['triplestore', 'api', 'ldp'],
  async started() {
    const basePath = await this.broker.call('ldp.getBasePath');
    if (this.settings.podProvider) {
      await this.broker.call('api.addRoute', {
        route: getRoute(path.join(basePath, '/:username([^/.][^/]+)/sparql')),
        toBottom: false
      });
    } else {
      await this.broker.call('api.addRoute', { route: getRoute(path.join(basePath, '/sparql')), toBottom: false });
    }
  },
  actions: {
    query: {
      async handler(ctx) {
        const query = ctx.params.query || ctx.params.body;
        // @ts-expect-error
        const accept = ctx.params.accept || ctx.meta.headers?.accept || this.settings.defaultAccept;

        if (this.settings.podProvider) {
          const [account] = await ctx.call('auth.account.find', { query: { username: ctx.params.username } });
          if (!account) throw new Error(`No account found with username ${ctx.params.username}`);

          // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
          if (account.webId !== ctx.meta.webId && account.webId !== ctx.meta.impersonatedUser) {
            throw new Error(`You can only query your own SPARQL endpoint`);
          }
        }

        const response = await ctx.call('triplestore.query', {
          query,
          accept,
          dataset: this.settings.podProvider ? ctx.params.username : undefined,
          // In Pod provider config, query as system when the Pod owner is querying his own data
          // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
          webId: this.settings.ignoreAcl ? 'system' : ctx.meta.webId
        });

        // @ts-expect-error TS(2339): Property '$responseType' does not exist on type '{... Remove this comment to see the full error message
        if (ctx.meta.$responseType === undefined) {
          // @ts-expect-error TS(2339): Property '$responseType' does not exist on type '{... Remove this comment to see the full error message
          ctx.meta.$responseType = ctx.meta.responseType || accept;
        }

        return response;
      }
    }
  },
  events: {
    'auth.registered': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'webId' does not exist on type 'Optionali... Remove this comment to see the full error message
        const { webId } = ctx.params;
        // @ts-expect-error TS(2339): Property 'settings' does not exist on type 'Servic... Remove this comment to see the full error message
        if (this.settings.podProvider) {
          await ctx.call('activitypub.actor.addEndpoint', {
            actorUri: webId,
            predicate: 'http://rdfs.org/ns/void#sparqlEndpoint',
            endpoint: urlJoin(webId, 'sparql')
          });
        }
      }
    }
  }
} satisfies ServiceSchema;

export default SparqlEndpointService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SparqlEndpointService.name]: typeof SparqlEndpointService;
    }
  }
}
