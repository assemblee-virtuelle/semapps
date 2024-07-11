const fetch = require('node-fetch');
const N3 = require('n3');
const { ACTIVITY_TYPES, OBJECT_TYPES, ActivitiesHandlerMixin, matchActivity } = require('@semapps/activitypub');
const urlJoin = require('url-join');

const { DataFactory } = N3;
const { triple, namedNode } = DataFactory;

module.exports = {
  name: 'inference.remote',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    baseUrl: null,
    acceptFromRemoteServers: true,
    offerToRemoteServers: true
  },
  dependencies: ['activitypub.relay'],
  async started() {
    this.relayActor = await this.broker.call('activitypub.relay.getActor');
  },
  actions: {
    offerInference: {
      visibility: 'public',
      params: {
        subject: { type: 'string', optional: false },
        predicate: { type: 'string', optional: false },
        object: { type: 'string', optional: false },
        add: { type: 'boolean', optional: false }
      },
      async handler(ctx) {
        if (this.settings.offerToRemoteServers) {
          const serverDomainName = new URL(ctx.params.subject).host;
          const remoteRelayActorUri = await ctx.call('webfinger.getRemoteUri', {
            account: `relay@${serverDomainName}`
          });

          if (remoteRelayActorUri) {
            await ctx.call('activitypub.outbox.post', {
              collectionUri: this.relayActor.outbox,
              '@context': 'https://www.w3.org/ns/activitystreams',
              actor: this.relayActor.id,
              type: ACTIVITY_TYPES.OFFER,
              object: {
                type: ctx.params.add ? ACTIVITY_TYPES.ADD : ACTIVITY_TYPES.REMOVE,
                object: {
                  type: OBJECT_TYPES.RELATIONSHIP,
                  subject: ctx.params.subject,
                  relationship: ctx.params.predicate,
                  object: ctx.params.object
                }
              },
              to: [remoteRelayActorUri]
            });
          } else {
            // no relay actor on the other side, let's try a PUT instead
            try {
              const response = await fetch(ctx.params.subject, {
                method: 'GET',
                headers: {
                  Accept: 'application/ld+json'
                }
              });
              if (response.ok) {
                let json = await response.json();

                if (ctx.params.add) {
                  json[ctx.params.predicate] = { id: ctx.params.object };
                } else {
                  const expanded_resource = await ctx.call('jsonld.parser.expand', { input: json });
                  delete expanded_resource[0]?.[ctx.params.predicate];
                  json = await ctx.call('jsonld.compact', { input: expanded_resource, context: json['@context'] });
                }
                await fetch(ctx.params.subject, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/ld+json'
                  },
                  body: JSON.stringify(json)
                });
              }
            } catch (e) {
              this.logger.warn(
                `Error while connecting to remove server for offering inverse relationship: ${e.message}`
              );
            }
          }
        }
      }
    }
  },
  methods: {
    isRemoteUri(uri) {
      return !urlJoin(uri, '/').startsWith(this.settings.baseUrl);
    }
  },
  activities: {
    offerInference: {
      async match(activity, fetcher) {
        return (
          (await matchActivity(
            {
              type: ACTIVITY_TYPES.OFFER,
              object: {
                type: ACTIVITY_TYPES.ADD,
                object: {
                  type: OBJECT_TYPES.RELATIONSHIP
                }
              }
            },
            activity,
            fetcher
          )) ||
          (await matchActivity(
            {
              type: ACTIVITY_TYPES.OFFER,
              object: {
                type: ACTIVITY_TYPES.REMOVE,
                object: {
                  type: OBJECT_TYPES.RELATIONSHIP
                }
              }
            },
            activity,
            fetcher
          ))
        );
      },
      async onReceive(ctx, activity, recipientUri) {
        if (this.settings.acceptFromRemoteServers && recipientUri === this.relayActor.id) {
          const relationship = activity.object.object;
          if (relationship.subject && relationship.relationship && relationship.object) {
            if (this.isRemoteUri(relationship.subject)) {
              this.logger.warn('Attempt at offering an inverse relationship on a remote resource. Aborting...');
              return;
            }

            // Remove prefix from predicate if it exists
            relationship.relationship = await ctx.call('jsonld.parser.expandPredicate', {
              predicate: relationship.relationship,
              context: activity['@context']
            });

            // TODO ensure that the object exist and has a remote relationship

            const triples = [
              triple(
                namedNode(relationship.subject),
                namedNode(relationship.relationship),
                namedNode(relationship.object)
              )
            ];

            await ctx.call('ldp.resource.patch', {
              resourceUri: relationship.subject,
              triplesToAdd: activity.object.type === ACTIVITY_TYPES.ADD ? triples : [],
              triplesToRemove: activity.object.type === ACTIVITY_TYPES.REMOVE ? triples : [],
              // We want this operation to be ignored by the InferenceService
              // Otherwise it will send back an offer to add the inverse relationship
              skipInferenceCheck: true,
              webId: 'system'
            });

            if (this.broker.cacher) {
              await ctx.call('ldp.cache.invalidateResource', { resourceUri: relationship.subject });
            }
          }
        }
      }
    }
  }
};
