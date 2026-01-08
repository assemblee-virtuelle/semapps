import path from 'path';
import urlJoin from 'url-join';
import { Account } from '@semapps/auth';
import { voidOntology } from '@semapps/ontologies';
import { ServiceSchema, Context } from 'moleculer';
import getRoute from './getRoute.ts';

const SparqlEndpointService = {
  name: 'sparqlEndpoint' as const,
  settings: {
    defaultAccept: 'text/turtle',
    ignoreAcl: false
  },
  dependencies: ['triplestore', 'api', 'ldp', 'ontologies'],
  async started() {
    await this.broker.call('ontologies.register', voidOntology);
    const basePath: string = await this.broker.call('ldp.getBasePath');
    await this.broker.call('api.addRoute', {
      route: getRoute(path.join(basePath, '/:username([^/._][^/]+)/sparql')),
      toBottom: false
    });
  },
  actions: {
    query: {
      async handler(ctx) {
        const query = ctx.params.query || ctx.meta.rawBody;
        const accept = ctx.params.accept || ctx.meta.headers?.accept || this.settings.defaultAccept;

        const [account]: Account[] = await ctx.call('auth.account.find', { query: { username: ctx.params.username } });
        if (!account) throw new Error(`No account found with username ${ctx.params.username}`);

        if (account.webId !== ctx.meta.webId && account.webId !== ctx.meta.impersonatedUser) {
          throw new Error(`You can only query your own SPARQL endpoint`);
        }

        const response = await ctx.call('triplestore.query', {
          query,
          accept,
          dataset: ctx.params.username,
          // In Pod provider config, query as system when the Pod owner is querying his own data
          webId: this.settings.ignoreAcl ? 'system' : ctx.meta.webId
        });

        if (ctx.meta.$responseType === undefined) {
          ctx.meta.$responseType = ctx.meta.responseType || accept;
        }

        return response;
      }
    }
  },
  events: {
    'auth.account.created': {
      async handler(ctx: Context<{ webId: string }>) {
        const { webId } = ctx.params;
        const services: ServiceSchema[] = await ctx.call('$node.services');
        if (services.some(s => s.name === 'activitypub.actor')) {
          const baseUrl: string = await ctx.call('solid-storage.getBaseUrl');
          await ctx.call('activitypub.actor.addEndpoint', {
            actorUri: webId,
            predicate: 'http://rdfs.org/ns/void#sparqlEndpoint',
            endpoint: urlJoin(baseUrl, 'sparql')
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
