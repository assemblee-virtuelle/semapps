import fetch from 'node-fetch';
import rdf from '@rdfjs/data-model';
import { getDatasetFromUri } from '@semapps/ldp';
import { Account } from '@semapps/auth';
import { ServiceSchema, Context } from 'moleculer';
import { AS_PREFIX } from '../../../constants.ts';
import { waitForResource } from '../../../utils.ts';

const ActorService = {
  name: 'activitypub.actor' as const,
  dependencies: ['activitypub.collection', 'ldp', 'signature'],
  actions: {
    get: {
      async handler(ctx) {
        const { actorUri, webId } = ctx.params;
        // Check if the actor is remote
        if (!(await ctx.call('ldp.remote.isRemote', { resourceUri: actorUri }))) {
          try {
            // Don't return immediately the promise, or we won't be able to catch errors
            const actor = await ctx.call('webid.get', { resourceUri: actorUri, webId });
            return actor;
          } catch (e) {
            console.error(e);
            return false;
          }
        } else {
          const response = await fetch(actorUri, { headers: { Accept: 'application/json' } });
          if (!response.ok) return false;
          const actor = await response.json();
          return actor;
        }
      }
    },

    getProfile: {
      async handler(ctx) {
        const { actorUri, webId } = ctx.params;
        const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
        // If the URL is not in the same domain as the actor, it is most likely not a profile
        if (actor.url && new URL(actor.url).host === new URL(actorUri).host) {
          return await ctx.call('ldp.resource.get', { resourceUri: actor.url, webId });
        }
      }
    },

    appendActorData: {
      async handler(ctx) {
        const { actorUri } = ctx.params;

        const propertiesToAdd = {
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': `${AS_PREFIX}Person`,
          'https://www.w3.org/ns/activitystreams#preferredUsername': getDatasetFromUri(actorUri)
        };

        await ctx.call('ldp.resource.patch', {
          resourceUri: actorUri,
          triplesToAdd: Object.entries(propertiesToAdd).map(([predicate, subject]) =>
            rdf.quad(
              rdf.namedNode(actorUri),
              rdf.namedNode(predicate),
              typeof subject === 'string' && subject.startsWith('http')
                ? rdf.namedNode(subject)
                : rdf.literal(subject as string)
            )
          ),
          webId: 'system'
        });
      }
    },

    addEndpoint: {
      async handler(ctx) {
        const { actorUri, predicate, endpoint } = ctx.params;

        const account: Account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        const dataset = account.username;

        await ctx.call('triplestore.update', {
          query: {
            type: 'update',
            updates: [
              {
                updateType: 'insertdelete',
                insert: [
                  {
                    type: 'graph',
                    name: rdf.namedNode(actorUri),
                    triples: [
                      rdf.quad(
                        rdf.namedNode(actorUri),
                        rdf.namedNode('https://www.w3.org/ns/activitystreams#endpoints'),
                        rdf.variable('endpoints')
                      ),
                      rdf.quad(rdf.variable('endpoints'), rdf.namedNode(predicate), rdf.namedNode(endpoint))
                    ]
                  }
                ],
                delete: [],
                where: [
                  {
                    type: 'optional',
                    patterns: [
                      {
                        type: 'graph',
                        name: rdf.namedNode(actorUri),
                        triples: [
                          rdf.quad(
                            rdf.namedNode(actorUri),
                            rdf.namedNode('https://www.w3.org/ns/activitystreams#endpoints'),
                            rdf.variable('b0')
                          )
                        ]
                      }
                    ]
                  },
                  {
                    type: 'bind',
                    variable: rdf.variable('endpoints'),
                    expression: {
                      type: 'operation',
                      operator: 'if',
                      args: [
                        {
                          type: 'operation',
                          operator: 'bound',
                          args: [rdf.variable('b0')]
                        },
                        rdf.variable('b0'),
                        {
                          type: 'operation',
                          operator: 'BNODE',
                          args: []
                        }
                      ]
                    }
                  }
                ]
              }
            ]
          },
          webId: 'system',
          dataset
        });
      }
    },

    awaitCreateComplete: {
      async handler(ctx) {
        const { actorUri, additionalKeys = [], delayMs = 1000, maxTries = 20 } = ctx.params;
        const keysToCheck = ['publicKey', 'outbox', 'inbox', 'followers', 'following', ...additionalKeys];

        return await waitForResource(
          delayMs,
          keysToCheck,
          maxTries,
          async () => await this.actions.get({ actorUri, webId: 'system' }, { parentCtx: ctx, meta: { $cache: false } })
        );
      }
    },

    getCollectionUri: {
      cache: true,
      async handler(ctx) {
        const { actorUri, predicate, webId } = ctx.params;
        const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
        return actor && actor[predicate];
      }
    }
  },
  events: {
    'auth.account.created': {
      async handler(ctx: Context<any>) {
        const { webId } = ctx.params;
        await this.actions.appendActorData({ actorUri: webId }, { parentCtx: ctx });
      }
    }
  }
} satisfies ServiceSchema;

export default ActorService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ActorService.name]: typeof ActorService;
    }
  }
}
