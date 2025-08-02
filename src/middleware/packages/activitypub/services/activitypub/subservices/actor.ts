import fetch from 'node-fetch';
import { namedNode, literal, triple, variable } from '@rdfjs/data-model';
import { MIME_TYPES } from '@semapps/mime-types';
import { arrayOf } from '@semapps/ldp';
import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';
import { ACTOR_TYPES, AS_PREFIX } from '../../../constants.ts';
import { getSlugFromUri, waitForResource } from '../../../utils.ts';

/** @type {import('moleculer').ServiceSchema} */
const ActorService = {
  name: 'activitypub.actor' as const,
  dependencies: ['activitypub.collection', 'ldp', 'signature'],
  settings: {
    baseUri: null,
    selectActorData: null,
    podProvider: false
  },
  actions: {
    get: defineAction({
      async handler(ctx) {
        const { actorUri, webId } = ctx.params;
        // If dataset is not in the meta, assume that actor is remote
        if (ctx.meta.dataset && !(await ctx.call('ldp.remote.isRemote', { resourceUri: actorUri }))) {
          try {
            // Don't return immediately the promise, or we won't be able to catch errors
            const actor = await ctx.call('ldp.resource.get', { resourceUri: actorUri, accept: MIME_TYPES.JSON, webId });
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
    }),

    getProfile: defineAction({
      async handler(ctx) {
        const { actorUri, webId } = ctx.params;
        const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
        // If the URL is not in the same domain as the actor, it is most likely not a profile
        if (actor.url && new URL(actor.url).host === new URL(actorUri).host) {
          return await ctx.call('ldp.resource.get', { resourceUri: actor.url, accept: MIME_TYPES.JSON, webId });
        }
      }
    }),

    appendActorData: defineAction({
      async handler(ctx) {
        const { actorUri } = ctx.params;
        const userData = await this.actions.get({ actorUri, webId: 'system' }, { parentCtx: ctx });
        const propertiesToAdd = this.settings.selectActorData ? this.settings.selectActorData(userData) : {};

        if (!propertiesToAdd['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']) {
          // Ensure at least one actor type, otherwise ActivityPub-specific properties (inbox, public key...) will not be added
          const resourceType = arrayOf(userData.type || userData['@type']);
          const includeActorType = resourceType.some(type => Object.values(ACTOR_TYPES).includes(type));
          if (!includeActorType) {
            propertiesToAdd['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] = `${AS_PREFIX}Person`;
          }
        }

        if (!propertiesToAdd['https://www.w3.org/ns/activitystreams#preferredUsername']) {
          propertiesToAdd['https://www.w3.org/ns/activitystreams#preferredUsername'] = getSlugFromUri(
            userData.id || userData['@id']
          );
        }

        if (Object.keys(propertiesToAdd).length > 0) {
          await ctx.call('ldp.resource.patch', {
            resourceUri: actorUri,
            triplesToAdd: Object.entries(propertiesToAdd).map(([predicate, subject]) =>
              triple(
                namedNode(actorUri),
                namedNode(predicate),
                typeof subject === 'string' && subject.startsWith('http') ? namedNode(subject) : literal(subject)
              )
            ),
            webId: 'system'
          });
        }
      }
    }),

    addEndpoint: defineAction({
      async handler(ctx) {
        const { actorUri, predicate, endpoint } = ctx.params;

        const account = await ctx.call('auth.account.findByWebId', { webId: actorUri });
        const dataset = account.username;

        await ctx.call('triplestore.update', {
          query: {
            type: 'update',
            updates: [
              {
                updateType: 'insertdelete',
                insert: [
                  {
                    type: 'bgp',
                    triples: [
                      triple(
                        namedNode(actorUri),
                        namedNode('https://www.w3.org/ns/activitystreams#endpoints'),
                        variable('endpoints')
                      ),
                      triple(variable('endpoints'), namedNode(predicate), namedNode(endpoint))
                    ]
                  }
                ],
                delete: [],
                where: [
                  {
                    type: 'optional',
                    patterns: [
                      {
                        type: 'bgp',
                        triples: [
                          triple(
                            namedNode(actorUri),
                            namedNode('https://www.w3.org/ns/activitystreams#endpoints'),
                            variable('b0')
                          )
                        ]
                      }
                    ]
                  },
                  {
                    type: 'bind',
                    variable: variable('endpoints'),
                    expression: {
                      type: 'operation',
                      operator: 'if',
                      args: [
                        {
                          type: 'operation',
                          operator: 'bound',
                          args: [variable('b0')]
                        },
                        variable('b0'),
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
    }),

    awaitCreateComplete: defineAction({
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
    }),

    getCollectionUri: defineAction({
      cache: true,
      async handler(ctx) {
        const { actorUri, predicate, webId } = ctx.params;
        const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
        return actor && actor[predicate];
      }
    })
  },
  methods: {
    isActor(resource) {
      return arrayOf(resource['@type'] || resource.type).some(type => Object.values(ACTOR_TYPES).includes(type));
    }
  },
  events: {
    'ldp.resource.created': defineServiceEvent({
      async handler(ctx) {
        const { resourceUri, newData } = ctx.params;
        if (this.isActor(newData)) {
          await this.actions.appendActorData({ actorUri: resourceUri }, { parentCtx: ctx });
          await ctx.call('signature.keypair.generate', { actorUri: resourceUri });
          await ctx.call('signature.keypair.attachPublicKey', { actorUri: resourceUri });
        }
      }
    }),

    'ldp.resource.deleted': defineServiceEvent({
      async handler(ctx) {
        const { resourceUri, oldData } = ctx.params;
        if (this.isActor(oldData)) {
          await ctx.call('keys.deleteAllKeysForWebId', { webId: resourceUri });
        }
      }
    }),

    'auth.registered': defineServiceEvent({
      async handler(ctx) {
        const { webId } = ctx.params;
        await this.actions.appendActorData({ actorUri: webId }, { parentCtx: ctx });
      }
    })
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
