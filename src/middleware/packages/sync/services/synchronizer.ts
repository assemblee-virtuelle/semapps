import { arrayOf } from '@semapps/ldp';
import { ACTIVITY_TYPES, OBJECT_TYPES, ActivitiesHandlerMixin } from '@semapps/activitypub';
import { ServiceSchema } from 'moleculer';

const SynchronizerService = {
  name: 'synchronizer' as const,
  mixins: [ActivitiesHandlerMixin],
  settings: {
    podProvider: false,
    synchronizeContainers: true,
    attachToLocalContainers: false
  },
  async started() {
    if (!this.settings.podProvider) {
      await this.broker.waitForServices('activitypub.relay');
      this.relayActor = await this.broker.call('activitypub.relay.getActor');
    }
  },
  methods: {
    async isValid(activity, recipientUri) {
      if (this.settings.podProvider) {
        const account = await this.broker.call('auth.account.findByWebId', { webId: recipientUri });
        if (!account) {
          this.logger.warn(`No local Pod found for webId ${recipientUri}`);
          return false;
        } else {
          // TODO Check that emitter is in contacts ?
          return true;
        }
      } else {
        // Check that the recipient is the relay actor
        if (recipientUri !== this.relayActor.id) return false;

        // Check that the activity emitter is being followed by the relay actor
        return await this.broker.call('activitypub.follow.isFollowing', {
          follower: recipientUri,
          following: activity.actor
        });
      }
    },
    // Return true if the resource is on the same server as the actor
    isLocal(url, actorUri) {
      if (this.settings.podProvider) {
        const { origin, pathname } = new URL(actorUri);
        const aclBase = `${origin}/_acl${pathname}`; // URL of type http://localhost:3000/_acl/alice
        const aclGroupBase = `${origin}/_groups${pathname}`; // URL of type http://localhost:3000/_groups/alice
        return (
          url === actorUri ||
          url.startsWith(`${actorUri}/`) ||
          url === aclBase ||
          url.startsWith(`${aclBase}/`) ||
          url === aclGroupBase ||
          url.startsWith(`${aclGroupBase}/`)
        );
      } else {
        const { origin } = new URL(actorUri);
        return url.startsWith(origin);
      }
    }
  },
  activities: {
    create: {
      match: {
        type: ACTIVITY_TYPES.CREATE
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'isValid' does not exist on type '{ match... Remove this comment to see the full error message
        if (await this.isValid(activity, recipientUri)) {
          for (let resource of arrayOf(activity.object)) {
            const resourceUri = typeof resource === 'string' ? resource : resource['@id'] || resource.id;

            // Ignore if the resource is on the same server
            // @ts-expect-error TS(2339): Property 'isLocal' does not exist on type '{ match... Remove this comment to see the full error message
            if (!this.isLocal(resourceUri, recipientUri)) {
              resource = await ctx.call(
                'ldp.remote.store',
                typeof resource === 'string'
                  ? {
                      resourceUri: resource,
                      webId: recipientUri
                    }
                  : {
                      resource: { '@context': activity['@context'], ...resource },
                      webId: recipientUri
                    }
              );

              const type = resource['@type'] || resource.type;

              // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
              if (activity.target && this.settings.synchronizeContainers) {
                for (const containerUri of arrayOf(activity.target)) {
                  await ctx.call('ldp.container.attach', {
                    containerUri,
                    resourceUri,
                    webId: recipientUri
                  });
                }
              }

              // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
              if (this.settings.attachToLocalContainers) {
                let containerUri;

                // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
                if (this.settings.podProvider) {
                  // If this is a Pod provider, try to find the container with the type-registrations service
                  [containerUri] = await ctx.call('type-registrations.findContainersUris', {
                    type,
                    webId: recipientUri
                  });
                } else {
                  // Otherwise try to find it with the LdpRegistry
                  const container = await ctx.call('ldp.registry.getByType', { type });
                  if (container) {
                    containerUri = await ctx.call('ldp.registry.getUri', {
                      path: container.path,
                      webId: recipientUri
                    });
                  }
                }

                if (containerUri) {
                  await ctx.call('ldp.container.attach', { containerUri, resourceUri, webId: recipientUri });
                } else {
                  // @ts-expect-error TS(2339): Property 'logger' does not exist on type '{ match:... Remove this comment to see the full error message
                  this.logger.warn(
                    `Cannot attach resource ${resourceUri} of type "${type}", no matching local containers were found`
                  );
                }
              }
            }
          }
        }
      }
    },
    update: {
      match: {
        type: ACTIVITY_TYPES.UPDATE
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'isValid' does not exist on type '{ match... Remove this comment to see the full error message
        if (await this.isValid(activity, recipientUri)) {
          for (let resource of arrayOf(activity.object)) {
            resource = await ctx.call(
              'ldp.remote.store',
              typeof resource === 'string'
                ? {
                    resourceUri: resource,
                    webId: recipientUri
                  }
                : {
                    resource: { '@context': activity['@context'], ...resource },
                    webId: recipientUri
                  }
            );
          }
        }
      }
    },
    delete: {
      match: {
        type: ACTIVITY_TYPES.DELETE
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'isValid' does not exist on type '{ match... Remove this comment to see the full error message
        if (await this.isValid(activity, recipientUri)) {
          for (const resource of arrayOf(activity.object)) {
            const resourceUri = typeof resource === 'string' ? resource : resource.id || resource['@id'];

            // Skip if the actor is asking to delete himself
            if (resourceUri === activity.actor) return;

            // If the remote resource is attached to a local container, it will be automatically detached
            try {
              await ctx.call('ldp.remote.delete', {
                resourceUri,
                webId: recipientUri
              });
            } catch (e) {
              // @ts-expect-error TS(2339): Property 'logger' does not exist on type '{ match:... Remove this comment to see the full error message
              this.logger.warn(
                // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
                `Remote resource ${resourceUri} not deleted as it was not found on local dataset. Error ${e.message}`
              );
            }

            // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
            if (activity.target && this.settings.synchronizeContainers) {
              for (const containerUri of arrayOf(activity.target)) {
                await ctx.call('ldp.container.detach', {
                  containerUri,
                  resourceUri,
                  webId: recipientUri
                });
              }
            }
          }
        }
      }
    },
    announceAddToContainer: {
      match: {
        type: ACTIVITY_TYPES.ADD,
        object: {
          type: OBJECT_TYPES.RELATIONSHIP
        }
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
        if (this.settings.synchronizeContainers) {
          // @ts-expect-error TS(2339): Property 'isValid' does not exist on type '{ match... Remove this comment to see the full error message
          if (await this.isValid(activity, recipientUri)) {
            const predicate = await ctx.call('jsonld.parser.expandPredicate', {
              predicate: activity.object.relationship,
              context: activity['@context']
            });
            if (predicate === 'http://www.w3.org/ns/ldp#contains') {
              await ctx.call('ldp.container.attach', {
                containerUri: activity.object.subject,
                resourceUri: activity.object.object,
                webId: recipientUri
              });
            }
          }
        }
      }
    },
    announceRemoveFromContainer: {
      match: {
        type: ACTIVITY_TYPES.REMOVE,
        object: {
          type: OBJECT_TYPES.RELATIONSHIP
        }
      },
      async onReceive(ctx: any, activity: any, recipientUri: any) {
        // @ts-expect-error TS(2339): Property 'settings' does not exist on type '{ matc... Remove this comment to see the full error message
        if (this.settings.synchronizeContainers) {
          // @ts-expect-error TS(2339): Property 'isValid' does not exist on type '{ match... Remove this comment to see the full error message
          if (await this.isValid(activity, recipientUri)) {
            const predicate = await ctx.call('jsonld.parser.expandPredicate', {
              predicate: activity.object.relationship,
              context: activity['@context']
            });
            if (predicate === 'http://www.w3.org/ns/ldp#contains') {
              await ctx.call('ldp.container.detach', {
                containerUri: activity.object.subject,
                resourceUri: activity.object.object,
                webId: recipientUri
              });
            }
          }
        }
      }
    }
  }
} satisfies ServiceSchema;

export default SynchronizerService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [SynchronizerService.name]: typeof SynchronizerService;
    }
  }
}
