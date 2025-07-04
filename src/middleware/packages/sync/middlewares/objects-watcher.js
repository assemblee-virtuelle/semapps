const { PUBLIC_URI, ACTIVITY_TYPES } = require('@semapps/activitypub');

const handledLdpActions = ['ldp.container.post', 'ldp.resource.put', 'ldp.resource.patch', 'ldp.resource.delete'];

const handledWacActions = [
  'webacl.resource.addRights',
  'webacl.resource.setRights',
  'webacl.resource.removeRights',
  'webacl.resource.deleteAllRights'
];

const ObjectsWatcherMiddleware = (config = {}) => {
  const { baseUrl, podProvider = false, postWithoutRecipients = false, transientActivities = false } = config;
  let relayActor;
  let excludedContainersPathRegex = [];
  let initialized = false;
  let cacherActivated = false;

  if (!baseUrl) throw new Error('The baseUrl setting is missing from ObjectsWatcherMiddleware');

  const isHandled = actionName => {
    // In a Pod provider config, we want to handle only LDP-related actions
    // The AnnouncerService takes care of resources sharing with other users
    if (podProvider) {
      return handledLdpActions.includes(actionName);
    } else {
      return handledLdpActions.includes(actionName) || handledWacActions.includes(actionName);
    }
  };

  /** Get owner WebID of resource (by looking at the slash URI). */
  const getActor = async (ctx, resourceUri) => {
    if (podProvider) {
      const url = new URL(resourceUri);
      const podOwnerUri = `${url.origin}/${url.pathname.split('/')[1]}`;
      return await ctx.call('activitypub.actor.awaitCreateComplete', { actorUri: podOwnerUri });
    }
    return relayActor;
  };

  const clearWebAclCache = async (ctx, resourceUri, containerUri) => {
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

  const getRecipients = async (ctx, resourceUri) => {
    const isPublic = await ctx.call('webacl.resource.isPublic', { resourceUri });
    const actor = await getActor(ctx, resourceUri);
    const usersWithReadRights = await ctx.call('webacl.resource.getUsersWithReadRights', { resourceUri });
    const recipients = usersWithReadRights.filter(u => u !== actor.id);
    if (isPublic) {
      return [...recipients, actor.followers, PUBLIC_URI];
    }
    return recipients;
  };

  const isExcluded = containersUris => {
    return containersUris.some(uri =>
      excludedContainersPathRegex.some(pathRegex => pathRegex.test(new URL(uri).pathname))
    );
  };

  const outboxPost = async (ctx, resourceUri, recipients, activity) => {
    if (recipients.length > 0 || postWithoutRecipients) {
      const actor = await getActor(ctx, resourceUri);

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
  };

  return {
    name: 'ObjectsWatcherMiddleware',
    async started(broker) {
      if (!podProvider) {
        await broker.waitForServices('activitypub.relay');
        relayActor = await broker.call('activitypub.relay.getActor');
      }

      const containers = await broker.call('ldp.registry.list');
      for (const container of Object.values(containers)) {
        if (container.excludeFromMirror === true && !excludedContainersPathRegex.includes(container.pathRegex)) {
          excludedContainersPathRegex.push(container.pathRegex);
        }
      }

      initialized = true;
      cacherActivated = !!broker.cacher;
    },
    localAction: (next, action) => {
      if (isHandled(action.name)) {
        return async ctx => {
          // Don't handle actions until middleware is fully started
          // Otherwise, the creation of the relay actor calls the middleware before it started
          if (!initialized) return await next(ctx);

          if (ctx.meta.skipObjectsWatcher === true) return await next(ctx);

          let actionReturnValue;
          let resourceUri;
          let containerUri;
          let oldContainers;
          let oldRecipients;

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

          const containers = containerUri
            ? [containerUri]
            : await ctx.call('ldp.resource.getContainers', { resourceUri });
          if (isExcluded(containers)) return await next(ctx);

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

            case 'webacl.resource.deleteAllRights':
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
              outboxPost(ctx, actionReturnValue, recipients, {
                type: ACTIVITY_TYPES.CREATE,
                object: actionReturnValue,
                target: ctx.params.containerUri
              });
              break;
            }

            case 'ldp.resource.patch': {
              const recipients = await getRecipients(ctx, ctx.params.resourceUri);
              outboxPost(ctx, ctx.params.resourceUri, recipients, {
                type: ACTIVITY_TYPES.UPDATE,
                object: ctx.params.resourceUri
              });
              break;
            }

            case 'ldp.resource.put': {
              const resourceUri = ctx.params.resource.id || ctx.params.resource['@id'];
              const recipients = await getRecipients(ctx, resourceUri);
              outboxPost(ctx, resourceUri, recipients, {
                type: ACTIVITY_TYPES.UPDATE,
                object: resourceUri
              });
              break;
            }

            case 'ldp.resource.delete': {
              outboxPost(ctx, ctx.params.resourceUri, oldRecipients, {
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
                const recipientsAdded = newRecipients.filter(u => !oldRecipients.includes(u));
                if (recipientsAdded.length > 0) {
                  const containers = await ctx.call('ldp.resource.getContainers', {
                    resourceUri: ctx.params.resourceUri
                  });
                  outboxPost(ctx, ctx.params.resourceUri, recipientsAdded, {
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

              const recipientsAdded = newRecipients.filter(u => !oldRecipients.includes(u));
              if (recipientsAdded.length > 0) {
                outboxPost(ctx, ctx.params.resourceUri, recipientsAdded, {
                  type: ACTIVITY_TYPES.CREATE,
                  object: ctx.params.resourceUri,
                  target: containers
                });
              }

              const recipientsRemoved = oldRecipients.filter(u => !newRecipients.includes(u));
              if (recipientsRemoved.length > 0) {
                outboxPost(ctx, ctx.params.resourceUri, recipientsRemoved, {
                  type: ACTIVITY_TYPES.DELETE,
                  object: ctx.params.resourceUri,
                  target: containers
                });
              }

              if (actionReturnValue.isContainer && actionReturnValue.addDefaultPublicRead) {
                const subUris = await ctx.call('ldp.container.getUris', { containerUri: ctx.params.resourceUri });
                // TODO check that sub-resources did not already have public read rights individually (must be done before)
                outboxPost(ctx, ctx.params.resourceUri, {
                  type: ACTIVITY_TYPES.CREATE,
                  object: subUris,
                  target: ctx.params.resourceUri
                });
              }

              if (actionReturnValue.isContainer && actionReturnValue.removeDefaultPublicRead) {
                const subUris = await ctx.call('ldp.container.getUris', { containerUri: ctx.params.resourceUri });
                // TODO check that sub-resources did not already have public read rights individually (must be done before)
                outboxPost(ctx, ctx.params.resourceUri, {
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
                const recipientsRemoved = oldRecipients.filter(u => !newRecipients.includes(u));
                if (recipientsRemoved.length > 0 && !newRecipients.includes(PUBLIC_URI)) {
                  const containers = await ctx.call('ldp.resource.getContainers', {
                    resourceUri: ctx.params.resourceUri
                  });
                  outboxPost(ctx, ctx.params.resourceUri, recipientsRemoved, {
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
    },
    localEvent(next, event) {
      if (event.name === 'ldp.registry.registered') {
        return async ctx => {
          const { container } = ctx.params;
          if (container.excludeFromMirror === true && !excludedContainersPathRegex.includes(container.pathRegex)) {
            excludedContainersPathRegex.push(container.pathRegex);
          }
          return next(ctx);
        };
      }
      return next;
    }
  };
};

module.exports = ObjectsWatcherMiddleware;
