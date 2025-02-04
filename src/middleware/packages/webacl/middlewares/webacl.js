const urlJoin = require('url-join');
const { throw403 } = require('@semapps/middlewares');
const { arrayOf, defaultContainerOptions } = require('@semapps/ldp');
const { getSlugFromUri } = require('../utils');

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

const addRightsToNewResource = async (ctx, resourceUri, webId) => {
  const { newResourcesPermissions } = await ctx.call('ldp.registry.getByUri', { resourceUri });
  const newRights =
    typeof newResourcesPermissions === 'function' ? newResourcesPermissions(webId, ctx) : newResourcesPermissions;

  await ctx.call(
    'webacl.resource.addRights',
    {
      webId: 'system',
      resourceUri,
      newRights
    },
    {
      meta: {
        skipObjectsWatcher: true
      }
    }
  );
};

const addRightsToNewUser = async (ctx, userUri) => {
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
 * Check, if an URI is attached to `ctx.authorization.capability`.
 * If the capability is valid and enables access to the resource, return true.
 * @param {string} mode The `acl:mode` to check for (e.g. `acl:Read`).
 * @returns {Promise<boolean>} true, if capability enables access to the resource, false otherwise.
 */
const hasValidCapability = async (capDocument, resourceUri, mode) => {
  // Check, if the capability's ACLs allow access to the resource.
  if (
    capDocument &&
    arrayOf(capDocument.type).includes('acl:Authorization') &&
    arrayOf(capDocument['acl:mode']).includes(mode) &&
    arrayOf(capDocument['acl:accessTo']).includes(resourceUri)
  ) {
    return true;
  }
  return false;
};

/**
 * Middleware that ensures that requests are conforming ACL records.
 * @type {import('moleculer').Middleware}
 */
const WebAclMiddleware = ({ baseUrl, podProvider = false, graphName = 'http://semapps.org/webacl' }) => ({
  name: 'WebAclMiddleware',
  async started() {
    if (!baseUrl) throw new Error('The baseUrl config is missing for the WebACL middleware');
  },
  localAction: (next, action) => {
    if (action.name === 'ldp.resource.get') {
      /*
       * VERIFY AUTHORIZATIONS
       * This allows us to quickly check the permissions for GET operations using the Redis cache
       * This way, we don't need to add the webId in the Redis cache key and it is more efficient
       */
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        const bypass = () => {
          ctx.params.aclVerified = true;
          return next(ctx);
        };

        if (webId === 'system') {
          return bypass();
        }

        const resourceUri = ctx.params.resourceUri || ctx.params.resource.id || ctx.params.resource['@id'];

        if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
          // Bypass if mirrored resource as WebACL are not activated in mirror graph
          if ((await ctx.call('ldp.remote.getGraph', { resourceUri })) === 'http://semapps.org/mirror') {
            return bypass();
          }
          return next(ctx);
        }

        // If the logged user is fetching is own POD, bypass ACL check
        // End with a trailing slash, otherwise "bob" will have access to the pod of "bobby" !
        if (podProvider && resourceUri.startsWith(`${webId}/`)) {
          return bypass();
        }

        const result = await ctx.call('webacl.resource.hasRights', {
          resourceUri,
          rights: { read: true }, // Check only the read permissions to improve performances
          webId
        });

        if (result.read) {
          return bypass();
        }

        // Check, if there is a valid capability.
        if (ctx.meta.authorization?.capability) {
          if (await hasValidCapability(ctx.meta.authorization.capability, resourceUri, 'acl:Read')) {
            return bypass();
          }
        }

        throw403();
      };
    } else if (modifyActions.includes(action.name)) {
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let actionReturnValue;

        /*
         * BEFORE HOOKS
         */
        switch (action.name) {
          case 'ldp.resource.create': {
            const resourceUri = ctx.params.resource['@id'] || ctx.params.resource.id;
            // Do not add ACLs if this is a mirrored resource as WebACL are not activated on the mirror graph
            if (
              (await ctx.call('ldp.remote.isRemote', { resourceUri })) &&
              (await ctx.call('ldp.remote.getGraph', { resourceUri })) === 'http://semapps.org/mirror'
            )
              return next(ctx);
            // We must add the permissions before inserting the resource
            await addRightsToNewResource(ctx, resourceUri, webId);
            break;
          }

          case 'ldp.container.create': {
            // On start, container permissions are passed as parameters because the registry is not up yet
            let permissions;
            if (ctx.params.options?.permissions) {
              permissions = ctx.params.options?.permissions;
            } else {
              const options = await ctx.call('ldp.registry.getByUri', { containerUri: ctx.params.containerUri });
              permissions = options?.permissions || defaultContainerOptions.permissions;
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
                  resourceUri: ctx.params.resource['@id'] || ctx.params.resource.id
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
            // When a remote resource is stored in the default graph, give read permission to the logged user
            if (!ctx.params.mirrorGraph && webId && webId !== 'system' && webId !== 'anon') {
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
      return async ctx => {
        if (podProvider) {
          const webId = ctx.params.webId || ctx.meta.webId || 'anon';
          const dataset = ctx.params.dataset || ctx.meta.dataset;

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

module.exports = WebAclMiddleware;
