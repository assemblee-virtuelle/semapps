import urlJoin from 'url-join';
import { defaultContainerOptions } from '@semapps/ldp';
import { Middleware } from 'moleculer';

const modifyActions = [
  'ldp.resource.create',
  'ldp.container.create',
  'activitypub.collection.post',
  'activitypub.object.createTombstone',
  'ldp.remote.delete',
  'ldp.resource.delete'
];

const tripleStoreActions = ['triplestore.insert', 'triplestore.query', 'triplestore.update', 'triplestore.dropAll'];

/**
 * Middleware that ensures that requests are conforming ACL records.
 */
const WebAclMiddleware = ({ baseUrl }: { baseUrl: string }): Middleware => ({
  name: 'WebAclMiddleware' as const,
  async started() {
    if (!baseUrl) throw new Error('The baseUrl config is missing for the WebACL middleware');
  },
  localAction: (next: any, action: any) => {
    if (modifyActions.includes(action.name)) {
      return async (ctx: any) => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let actionReturnValue;

        /*
         * BEFORE HOOKS
         */
        switch (action.name) {
          case 'ldp.resource.create': {
            let permissions;
            if (ctx.params.registration) {
              permissions =
                ctx.params.registration?.newResourcesPermissions || defaultContainerOptions.newResourcesPermissions;
            } else {
              const registration = await ctx.call('ldp.registry.getByUri', { resourceUri: ctx.params.resourceUri });
              permissions = registration?.newResourcesPermissions || defaultContainerOptions.newResourcesPermissions;
            }

            // We must add the permissions before inserting the resource
            await ctx.call(
              'webacl.resource.addRights',
              {
                webId: 'system',
                resourceUri: ctx.params.resourceUri,
                newRights: typeof permissions === 'function' ? permissions(webId) : permissions
              },
              {
                meta: {
                  skipObjectsWatcher: true
                }
              }
            );

            break;
          }

          default:
            break;
        }

        /*
         * ACTION CALL
         */
        try {
          actionReturnValue = await next(ctx);
        } catch (e) {
          // Remove the permissions which were added just before
          switch (action.name) {
            case 'ldp.resource.create':
              await ctx.call(
                'webacl.resource.deleteAllRights',
                {
                  resourceUri: ctx.params.resourceUri
                },
                {
                  meta: {
                    skipObjectsWatcher: true
                  }
                }
              );
              break;
            default:
              break;
          }
          throw e;
        }

        /*
         * AFTER HOOKS
         */
        switch (action.name) {
          case 'ldp.container.create': {
            const containerUri = actionReturnValue;

            let permissions;
            if (ctx.params.registration) {
              permissions = ctx.params.registration?.permissions || defaultContainerOptions.permissions;
            } else {
              const registration = await ctx.call('ldp.registry.getByUri', { containerUri });
              permissions = registration?.permissions || defaultContainerOptions.permissions;
            }

            await ctx.call(
              'webacl.resource.addRights',
              {
                resourceUri: containerUri,
                newRights: typeof permissions === 'function' ? permissions(webId) : permissions,
                webId: 'system'
              },
              {
                meta: {
                  skipObjectsWatcher: true
                }
              }
            );
            break;
          }

          case 'ldp.resource.delete':
            await ctx.call(
              'webacl.resource.deleteAllRights',
              { resourceUri: ctx.params.resourceUri },
              {
                meta: {
                  skipObjectsWatcher: true
                }
              }
            );
            break;

          case 'ldp.remote.delete':
            await ctx.call(
              'webacl.resource.deleteAllRights',
              { resourceUri: ctx.params.resourceUri },
              {
                meta: {
                  skipObjectsWatcher: true
                }
              }
            );
            break;

          case 'activitypub.object.createTombstone':
            // Tombstones should be public
            await ctx.call(
              'webacl.resource.addRights',
              {
                resourceUri: ctx.params.resourceUri,
                additionalRights: {
                  anon: {
                    read: true
                  }
                },
                webId: 'system'
              },
              {
                meta: {
                  skipObjectsWatcher: true
                }
              }
            );
            break;

          case 'activitypub.collection.post': {
            // If a `permissions` param is passed when creating the collection, delete the permissions added before creation
            // (through the `newResourcesPermissions` of the collection container) and add these permissions instead
            if (ctx.params.permissions) {
              await ctx.call(
                'webacl.resource.deleteAllRights',
                { resourceUri: actionReturnValue },
                {
                  meta: {
                    skipObjectsWatcher: true
                  }
                }
              );

              const permissions =
                typeof ctx.params.permissions === 'function'
                  ? ctx.params.permissions(ctx.params.webId || ctx.meta.webId || 'anon')
                  : ctx.params.permissions;

              await ctx.call(
                'webacl.resource.addRights',
                {
                  resourceUri: actionReturnValue,
                  additionalRights: permissions,
                  webId: 'system'
                },
                {
                  meta: {
                    skipObjectsWatcher: true
                  }
                }
              );
            }
            break;
          }

          default:
            break;
        }

        return actionReturnValue;
      };
    } else if (tripleStoreActions.includes(action.name)) {
      return async (ctx: any) => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        const dataset = ctx.params.dataset || ctx.meta.dataset;

        if (!dataset) throw new Error(`The dataset param or meta is missing when calling ${action.name}`);

        // If the webId is the owner of the Pod, bypass WAC checks
        if (urlJoin(baseUrl, dataset) === webId) {
          ctx.params.webId = 'system';
        }

        return next(ctx);
      };
    }

    // Do not use the middleware for this action
    return next;
  }
});

export default WebAclMiddleware;
