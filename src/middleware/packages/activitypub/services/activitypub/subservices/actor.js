const fetch = require('node-fetch');
const urlJoin = require('url-join');
const { namedNode, literal, triple, variable } = require('@rdfjs/data-model');
const { MIME_TYPES } = require('@semapps/mime-types');
const { ACTOR_TYPES, AS_PREFIX } = require('../../../constants');
const { defaultToArray, getSlugFromUri, waitForResource } = require('../../../utils');

/** @type {import('moleculer').ServiceSchema} */
const ActorService = {
  name: 'activitypub.actor',
  dependencies: ['activitypub.collection', 'ldp', 'signature'],
  settings: {
    baseUri: null,
    selectActorData: null,
    podProvider: false
  },
  actions: {
    async get(ctx) {
      const { actorUri, webId } = ctx.params;
      if (!this.isRemoteUri(actorUri, ctx.meta.dataset)) {
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
    },
    async getProfile(ctx) {
      const { actorUri, webId } = ctx.params;
      const actor = await this.actions.get({ actorUri, webId }, { parentCtx: ctx });
      // If the URL is not in the same domain as the actor, it is most likely not a profile
      if (actor.url && new URL(actor.url).host === new URL(actorUri).host) {
        return await ctx.call('ldp.resource.get', { resourceUri: actor.url, accept: MIME_TYPES.JSON, webId });
      }
    },
    async appendActorData(ctx) {
      const { actorUri } = ctx.params;
      const userData = await this.actions.get({ actorUri, webId: 'system' }, { parentCtx: ctx });
      const propertiesToAdd = this.settings.selectActorData ? this.settings.selectActorData(userData) : {};

      if (!propertiesToAdd['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']) {
        // Ensure at least one actor type, otherwise ActivityPub-specific properties (inbox, public key...) will not be added
        const resourceType = defaultToArray(userData.type || userData['@type']);
        const includeActorType = resourceType
          ? resourceType.some(type => Object.values(ACTOR_TYPES).includes(type))
          : false;
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
    },
    async addEndpoint(ctx) {
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
    },
    async awaitCreateComplete(ctx) {
      const { actorUri, additionalKeys = [], delayMs = 1000, maxTries = 20 } = ctx.params;
      const keysToCheck = ['publicKey', 'outbox', 'inbox', 'followers', 'following', ...additionalKeys];

      return await waitForResource(
        delayMs,
        keysToCheck,
        maxTries,
        async () => await this.actions.get({ actorUri, webId: 'system' }, { parentCtx: ctx, meta: { $cache: false } })
      );
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
  methods: {
    isRemoteUri(uri, dataset) {
      if (this.settings.podProvider && !dataset) return true; // If no dataset is set, assume actor is remote
      return (
        !urlJoin(uri, '/').startsWith(this.settings.baseUri) ||
        (this.settings.podProvider && !urlJoin(uri, '/').startsWith(`${urlJoin(this.settings.baseUri, dataset)}/`))
      );
    },
    isActor(resource) {
      return defaultToArray(resource['@type'] || resource.type || []).some(type =>
        Object.values(ACTOR_TYPES).includes(type)
      );
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, newData } = ctx.params;
      if (this.isActor(newData)) {
        await this.actions.appendActorData({ actorUri: resourceUri }, { parentCtx: ctx });
        await ctx.call('signature.keypair.generate', { actorUri: resourceUri });
        await ctx.call('signature.keypair.attachPublicKey', { actorUri: resourceUri });
      }
    },
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, oldData } = ctx.params;
      if (this.isActor(oldData)) {
        await ctx.call('signature.keypair.delete', { actorUri: resourceUri });
      }
    },
    async 'auth.registered'(ctx) {
      const { webId } = ctx.params;
      await this.actions.appendActorData({ actorUri: webId }, { parentCtx: ctx });
    }
  }
};

module.exports = ActorService;
