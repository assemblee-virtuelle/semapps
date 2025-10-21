import urlJoin from 'url-join';
import { defaultContainerOptions } from '@semapps/ldp';
import { getSlugFromUri } from '../utils.ts';

const modifyActions = [
  'ldp.resource.create',
  'ldp.container.create',
  'activitypub.collection.post',
  'activitypub.object.createTombstone',
  'webid.createWebId',
  'ldp.remote.store',
  'ldp.remote.delete',
  'ldp.resource.delete'
];

const tripleStoreActions = ['triplestore.insert', 'triplestore.query', 'triplestore.update', 'triplestore.dropAll'];

const addRightsToNewUser = async (ctx: any, userUri: any) => {
  // Manually add the permissions for the user resource now that we have its webId
  // First delete the default permissions added by the middleware when we called ldp.resource.create
  await ctx.call(
    'webacl.resource.deleteAllRights',
    { resourceUri: userUri },
    { meta: { webId: 'system', skipObjectsWatcher: true } }
  );

  // TODO find the permissions to set from the users container
  // const { newResourcesPermissions } = await ctx.call('ldp.registry.getByUri', { resourceUri: userUri });
  // const newRights =
  //   typeof newResourcesPermissions === 'function' ? newResourcesPermissions(userUri) : newResourcesPermissions;

  await ctx.call(
    'webacl.resource.addRights',
    {
      webId: 'system',
      resourceUri: userUri,
      newRights: {
        anon: {
          read: true
        },
        user: {
          uri: userUri,
          read: true,
          write: true,
          control: true
        }
      }
    },
    {
      meta: {
        skipObjectsWatcher: true
      }
    }
  );
};

/**
 * Middleware that ensures that requests are conforming ACL records.
 */
const WebAclMiddleware = ({ baseUrl, podProvider = false, graphName = 'http://semapps.org/webacl' }: any) => ({
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
            // On start, resource permissions are passed as parameters because the registry is not up yet
            let permissions;
            if (ctx.params.registration) {
              // Use the permissions param (and not newResourcesPermission) because this is for controlled resources
              permissions = ctx.params.registration?.permissions || defaultContainerOptions.permissions;
            } else {
              const registration = await ctx.call('ldp.registry.getByUri', { resourceUri: ctx.params.resourceUri });
              permissions = registration?.newResourcesPermissions || defaultContainerOptions.permissions;
            }

            // We must add the permissions before inserting the resource
            await ctx.call(
              'webacl.resource.addRights',
              {
                webId: 'system',
                resourceUri: ctx.params.resourceUri,
                newRights: typeof permissions === 'function' ? permissions(webId, ctx) : permissions
              },
              {
                meta: {
                  skipObjectsWatcher: true
                }
              }
            );

            break;
          }

          case 'ldp.container.create': {
            // On start, container permissions are passed as parameters because the registry is not up yet
            let permissions;
            if (ctx.params.registration) {
              permissions = ctx.params.registration?.permissions || defaultContainerOptions.permissions;
            } else {
              const registration = await ctx.call('ldp.registry.getByUri', { containerUri: ctx.params.containerUri });
              permissions = registration?.permissions || defaultContainerOptions.permissions;
            }

            await ctx.call(
              'webacl.resource.addRights',
              {
                resourceUri: ctx.params.containerUri,
                newRights: typeof permissions === 'function' ? permissions(webId, ctx) : permissions,
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
            case 'ldp.container.create':
              await ctx.call(
                'webacl.resource.deleteAllRights',
                { resourceUri: ctx.params.containerUri },
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

          case 'webid.createWebId':
            await addRightsToNewUser(ctx, actionReturnValue);
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

          case 'ldp.remote.store': {
            const resourceUri = ctx.params.resourceUri || ctx.params.resource.id || ctx.params.resource['@id'];
            // When a remote resource is stored locally, give read permission to the logged user
            if (webId && webId !== 'system' && webId !== 'anon') {
              const dataset = podProvider ? getSlugFromUri(webId) : undefined;
              await ctx.call(
                'webacl.resource.addRights',
                {
                  resourceUri,
                  newRights: {
                    user: {
                      uri: webId,
                      read: true
                    }
                  },
                  webId: 'system'
                },
                { meta: { dataset, skipObjectsWatcher: true } }
              );
            }
            break;
          }

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
        if (podProvider) {
          const webId = ctx.params.webId || ctx.meta.webId || 'anon';
          const dataset = ctx.params.dataset || ctx.meta.dataset;

          if (!dataset) throw new Error(`The dataset param or meta is missing when calling ${action.name}`);

          // If the webId is the owner of the Pod, bypass WAC checks
          if (urlJoin(baseUrl, dataset) === webId) {
            ctx.params.webId = 'system';
          }
        }
        return next(ctx);
      };
    }

    // Do not use the middleware for this action
    return next;
  }
});

export default WebAclMiddleware;
