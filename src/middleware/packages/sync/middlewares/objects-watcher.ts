import { PUBLIC_URI, ACTIVITY_TYPES } from '@semapps/activitypub';
import { Middleware, ServiceBroker } from 'moleculer';

interface MiddlewareConfig {
  baseUrl?: string;
  postWithoutRecipients?: boolean;
  transientActivities?: boolean;
}

const handledLdpActions = ['ldp.container.post', 'ldp.resource.put', 'ldp.resource.patch', 'ldp.resource.delete'];

const handledWacActions = [
  'webacl.resource.addRights',
  'webacl.resource.setRights',
  'webacl.resource.removeRights',
  'webacl.resource.deleteAllRights'
];

const ObjectsWatcherMiddleware = (config: MiddlewareConfig = {}): Middleware => {
  const { baseUrl, postWithoutRecipients = false, transientActivities = false } = config;
  let cacherActivated = false;

  if (!baseUrl) throw new Error('The baseUrl setting is missing from ObjectsWatcherMiddleware');

  const isHandled = (actionName: any) => {
    // In a Pod provider config, we want to handle only LDP-related actions
    // The AnnouncerService takes care of resources sharing with other users
    return handledLdpActions.includes(actionName);
  };

  const clearWebAclCache = async (ctx: any, resourceUri: any, containerUri: any) => {
    if (cacherActivated) {
      // TODO Use WebAclMiddleware instead of events to clear cache immediately
      // https://github.com/assemblee-virtuelle/semapps/issues/1127
      if (containerUri) {
        await ctx.call('webacl.cache.invalidateResourceRights', { uri: containerUri, specificUriOnly: false });
      } else {
        await ctx.call('webacl.cache.invalidateResourceRights', { uri: resourceUri, specificUriOnly: true });
      }
    }
  };

  const getRecipients = async (ctx: ServiceBroker, resourceUri: string) => {
    const isPublic: boolean = await ctx.call('webacl.resource.isPublic', { resourceUri });
    const actor: any = await ctx.call('webid.get'); // Get actor based on ctx.meta.dataset
    const usersWithReadRights: string[] = await ctx.call('webacl.resource.getUsersWithReadRights', { resourceUri });
    const recipients = usersWithReadRights.filter(u => u !== actor.id);
    if (isPublic) {
      return [...recipients, actor.followers, PUBLIC_URI];
    }
    return recipients;
  };

  const outboxPost = async (ctx: ServiceBroker, recipients: string[], activity: any) => {
    if (recipients.length > 0 || postWithoutRecipients) {
      const actor: any = await ctx.call('webid.get'); // Get actor based on ctx.meta.dataset

      if (actor.outbox) {
        return await ctx.call(
          'activitypub.outbox.post',
          {
            collectionUri: actor.outbox,
            transient: transientActivities,
            '@context': 'https://www.w3.org/ns/activitystreams',
            ...activity,
            bto: recipients.length > 0 ? recipients : undefined
          },
          { meta: { webId: actor.id, doNotProcessObject: true } }
        );
      }
    }
  };

  return {
    name: 'ObjectsWatcherMiddleware',
    localAction: (next: any, action: any) => {
      if (isHandled(action.name)) {
        return async (ctx: any) => {
          if (ctx.meta.skipObjectsWatcher === true) return await next(ctx);

          let actionReturnValue;
          let resourceUri;
          let containerUri;
          let oldContainers;
          let oldRecipients: any;

          switch (action.name) {
            case 'ldp.container.post':
              containerUri = ctx.params.containerUri;
              break;

            case 'ldp.resource.patch':
              resourceUri = ctx.params.resourceUri;
              break;

            case 'ldp.resource.put':
              resourceUri = ctx.params.resource.id || ctx.params.resource['@id'];
              break;

            case 'ldp.resource.delete':
              resourceUri = ctx.params.resourceUri;
              break;

            case 'webacl.resource.addRights':
            case 'webacl.resource.setRights':
            case 'webacl.resource.removeRights':
            case 'webacl.resource.deleteAllRights':
              // If we are modifying rights of an ACL group, ignore
              if (new URL(ctx.params.resourceUri).pathname.startsWith('/_groups/')) return await next(ctx);
              const containerExist = await ctx.call('ldp.container.exist', { containerUri: ctx.params.resourceUri });
              if (containerExist) {
                // We don't want to announce containers right changes
                return await next(ctx);
              } else {
                resourceUri = ctx.params.resourceUri;
              }
              break;
          }

          // We never want to watch remote resources
          if (resourceUri && (await ctx.call('ldp.remote.isRemote', { resourceUri }))) return await next(ctx);

          /*
           * BEFORE HOOKS
           */
          switch (action.name) {
            case 'ldp.resource.delete':
              oldContainers = await ctx.call('ldp.resource.getContainers', { resourceUri: ctx.params.resourceUri });
              oldRecipients = await getRecipients(ctx, ctx.params.resourceUri);
              break;

            case 'webacl.resource.addRights':
              if (ctx.params.additionalRights || ctx.params.addedRights) {
                oldRecipients = await getRecipients(ctx, ctx.params.resourceUri);
              }
              break;

            case 'webacl.resource.setRights':
            case 'webacl.resource.removeRights':
              oldRecipients = await getRecipients(ctx, ctx.params.resourceUri);
              break;

            case 'webacl.resource.deleteAllRights': {
              // Ensure the resource has not already been deleted (this action is used by the WebAclMiddleware when resources are deleted)
              const containerExist = await ctx.call('ldp.container.exist', { containerUri: ctx.params.resourceUri });
              const resourceExist = await ctx.call('ldp.resource.exist', {
                resourceUri: ctx.params.resourceUri,
                acceptTombstones: false, // Ignore Tombstones
                webId: 'system'
              });
              if (containerExist || resourceExist) {
                oldRecipients = await getRecipients(ctx, ctx.params.resourceUri);
              }
              break;
            }
          }

          /*
           * ACTION CALL
           */
          actionReturnValue = await next(ctx);

          /*
           * AFTER HOOKS
           */
          switch (action.name) {
            case 'ldp.container.post': {
              const recipients = await getRecipients(ctx, actionReturnValue);
              outboxPost(ctx, recipients, {
                type: ACTIVITY_TYPES.CREATE,
                object: actionReturnValue,
                target: ctx.params.containerUri
              });
              break;
            }

            case 'ldp.resource.patch': {
              const recipients = await getRecipients(ctx, ctx.params.resourceUri);
              outboxPost(ctx, recipients, {
                type: ACTIVITY_TYPES.UPDATE,
                object: ctx.params.resourceUri
              });
              break;
            }

            case 'ldp.resource.put': {
              const resourceUri = ctx.params.resource.id || ctx.params.resource['@id'];
              const recipients = await getRecipients(ctx, resourceUri);
              outboxPost(ctx, recipients, {
                type: ACTIVITY_TYPES.UPDATE,
                object: resourceUri
              });
              break;
            }

            case 'ldp.resource.delete': {
              outboxPost(ctx, oldRecipients, {
                type: ACTIVITY_TYPES.DELETE,
                object: ctx.params.resourceUri,
                target: oldContainers
              });
              break;
            }

            case 'webacl.resource.addRights': {
              if (ctx.params.additionalRights || ctx.params.addedRights) {
                // Clear cache now otherwise getRecipients() may return the old cache rights
                await clearWebAclCache(ctx, resourceUri, containerUri);
                const newRecipients = await getRecipients(ctx, ctx.params.resourceUri);
                const recipientsAdded = newRecipients.filter((u: any) => !oldRecipients.includes(u));
                if (recipientsAdded.length > 0) {
                  const containers = await ctx.call('ldp.resource.getContainers', {
                    resourceUri: ctx.params.resourceUri
                  });
                  outboxPost(ctx, recipientsAdded, {
                    type: ACTIVITY_TYPES.CREATE,
                    object: ctx.params.resourceUri,
                    target: containers
                  });
                }
              }
              break;
            }

            case 'webacl.resource.setRights': {
              // Clear cache now otherwise getRecipients() may return the old cache rights
              await clearWebAclCache(ctx, resourceUri, containerUri);
              const newRecipients = await getRecipients(ctx, ctx.params.resourceUri);
              const containers = await ctx.call('ldp.resource.getContainers', { resourceUri: ctx.params.resourceUri });

              const recipientsAdded = newRecipients.filter((u: any) => !oldRecipients.includes(u));
              if (recipientsAdded.length > 0) {
                outboxPost(ctx, recipientsAdded, {
                  type: ACTIVITY_TYPES.CREATE,
                  object: ctx.params.resourceUri,
                  target: containers
                });
              }

              const recipientsRemoved = oldRecipients.filter((u: any) => !newRecipients.includes(u));
              if (recipientsRemoved.length > 0) {
                outboxPost(ctx, recipientsRemoved, {
                  type: ACTIVITY_TYPES.DELETE,
                  object: ctx.params.resourceUri,
                  target: containers
                });
              }

              if (actionReturnValue.isContainer && actionReturnValue.addDefaultPublicRead) {
                const subUris = await ctx.call('ldp.container.getUris', { containerUri: ctx.params.resourceUri });
                // TODO check that sub-resources did not already have public read rights individually (must be done before)
                outboxPost(ctx, {
                  type: ACTIVITY_TYPES.CREATE,
                  object: subUris,
                  target: ctx.params.resourceUri
                });
              }

              if (actionReturnValue.isContainer && actionReturnValue.removeDefaultPublicRead) {
                const subUris = await ctx.call('ldp.container.getUris', { containerUri: ctx.params.resourceUri });
                // TODO check that sub-resources did not already have public read rights individually (must be done before)
                outboxPost(ctx, {
                  type: ACTIVITY_TYPES.DELETE,
                  object: subUris,
                  target: ctx.params.resourceUri
                });
              }

              break;
            }

            case 'webacl.resource.deleteAllRights':
            case 'webacl.resource.removeRights': {
              // If oldRecipients is not initialized, it means the resource has been deleted
              if (oldRecipients) {
                // Clear cache now otherwise getRecipients() may return the old cache rights
                await clearWebAclCache(ctx, resourceUri, containerUri);
                const newRecipients = await getRecipients(ctx, ctx.params.resourceUri);
                const recipientsRemoved = oldRecipients.filter((u: any) => !newRecipients.includes(u));
                if (recipientsRemoved.length > 0 && !newRecipients.includes(PUBLIC_URI)) {
                  const containers = await ctx.call('ldp.resource.getContainers', {
                    resourceUri: ctx.params.resourceUri
                  });
                  outboxPost(ctx, recipientsRemoved, {
                    type: ACTIVITY_TYPES.DELETE,
                    object: ctx.params.resourceUri,
                    target: containers
                  });
                }
                break;
              }
            }
          }

          return actionReturnValue;
        };
      }

      // Do not use the middleware for this action
      return next;
    }
  };
};

export default ObjectsWatcherMiddleware;
