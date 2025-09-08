import fetch from 'node-fetch';
import N3 from 'n3';
import { ACTIVITY_TYPES, OBJECT_TYPES, ActivitiesHandlerMixin, matchActivity } from '@semapps/activitypub';
import { ServiceSchema } from 'moleculer';

const { DataFactory } = N3;
const { triple, namedNode } = DataFactory;

const InferenceRemoteSchema = {
  name: 'inference.remote' as const,
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
        // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
        subject: { type: 'string', optional: false },
        // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
        predicate: { type: 'string', optional: false },
        // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
        object: { type: 'string', optional: false },
        // @ts-expect-error TS(2322): Type '{ type: "boolean"; optional: false; }' is no... Remove this comment to see the full error message
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
                // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
                `Error while connecting to remove server for offering inverse relationship: ${e.message}`
              );
            }
          }
        }
      }
    }
  },
  activities: {
    offerInference: {
      async match(activity: any, fetcher: any) {
        let { match, dereferencedActivity } = await matchActivity(
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
        );

        if (!match) {
          ({ match, dereferencedActivity } = await matchActivity(
            {
              type: ACTIVITY_TYPES.OFFER,
              object: {
                type: ACTIVITY_TYPES.REMOVE,
                object: {
                  type: OBJECT_TYPES.RELATIONSHIP
                }
              }
            },
            dereferencedActivity, // Use the newly dereferenced activity to improve perf
            fetcher
          ));
        }

        return { match, dereferencedActivity };
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
        if (this.settings.acceptFromRemoteServers && recipientUri === this.relayActor.id) {
          const relationship = activity.object.object;
          if (relationship.subject && relationship.relationship && relationship.object) {
            if (await ctx.call('ldp.remote.isRemote', { resourceUri: relationship.subject })) {
              // @ts-expect-error TS(2339): Property 'logger' does not exist on type '{ match(... Remove this comment to see the full error message
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

            // @ts-expect-error TS(2339): Property 'broker' does not exist on type '{ match(... Remove this comment to see the full error message
            if (this.broker.cacher) {
              await ctx.call('ldp.cache.invalidateResource', { resourceUri: relationship.subject });
            }
          }
        }
      }
    }
  }
} satisfies ServiceSchema;

export default InferenceRemoteSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [InferenceRemoteSchema.name]: typeof InferenceRemoteSchema;
    }
  }
}
