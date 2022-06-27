const { throw403 } = require('@semapps/middlewares');
const { getContainerFromUri } = require('../utils');
const { defaultContainerRights, defaultCollectionRights } = require('../defaultRights');

const modifyActions = [
  'ldp.resource.create',
  'ldp.container.create',
  'activitypub.collection.create',
  'activitypub.activity.create',
  'webid.create',
  'ldp.resource.delete'
];

const addRightsToNewResource = async (ctx, resourceUri, webId) => {
  const { newResourcesPermissions } = await ctx.call('ldp.registry.getByUri', { resourceUri });
  const newRights =
    typeof newResourcesPermissions === 'function' ? newResourcesPermissions(webId) : newResourcesPermissions;

  await ctx.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri,
    newRights
  });
};

const addRightsToNewUser = async (ctx, userUri) => {
  // Manually add the permissions for the user resource now that we have its webId
  // First delete the default permissions added by the middleware when we called ldp.resource.create
  await ctx.call('webacl.resource.deleteAllRights', { resourceUri: userUri }, { meta: { webId: 'system' } });

  // TODO find the permissions to set from the users container
  // const { newResourcesPermissions } = await ctx.call('ldp.registry.getByUri', { resourceUri: userUri });
  // const newRights =
  //   typeof newResourcesPermissions === 'function' ? newResourcesPermissions(userUri) : newResourcesPermissions;

  await ctx.call('webacl.resource.addRights', {
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
  });
};

// List of containers with default anon read, so that we can bypass permissions check for the resources it contains
// TODO invalidate this cache when default permissions are changed
let containersWithDefaultAnonRead = [];

const WebAclMiddleware = config => ({
  name: 'WebAclMiddleware',
  async started(broker) {
    if (!config.podProvider) {
      const containers = await broker.call('ldp.container.getAll');
      for (let containerUri of containers) {
        const authorizations = await broker.call('triplestore.query', {
          query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX acl: <http://www.w3.org/ns/auth/acl#>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
          SELECT ?auth
          WHERE {
            GRAPH <http://semapps.org/webacl> {
              ?auth a acl:Authorization ;
                acl:default <${containerUri}> ;
                acl:agentClass foaf:Agent ;
                acl:mode acl:Read .
            }
          }
        `,
          webId: 'system'
        });

        if (authorizations.length > 0) {
          containersWithDefaultAnonRead.push(containerUri);
        }
      }
    }
  },
  localAction: (wrapWebAclMiddleware = (next, action) => {
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

        if (ctx.meta.isMirror) return bypass();

        // If the logged user is fetching is own POD, bypass ACL check
        // End with a trailing slash, otherwise "bob" will have access to the pod of "bobby" !
        if (config.podProvider && resourceUri.startsWith(webId + '/')) {
          return bypass();
        }

        // if mirrored resource, bypass

        const containerUri = getContainerFromUri(resourceUri);
        if (containersWithDefaultAnonRead.includes(containerUri)) {
          return bypass();
        }

        const result = await ctx.call('webacl.resource.hasRights', {
          resourceUri,
          rights: { read: true }, // Check only the read permissions to improve performances
          webId
        });

        if (result.read) {
          return bypass();
        } else {
          throw403();
        }
      };
    } else if (modifyActions.includes(action.name)) {
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let actionReturnValue;

        /*
         * BEFORE HOOKS
         */
        switch (action.name) {
          case 'ldp.resource.create':
            if (ctx.meta.forceMirror) return next(ctx);
            // We must add the permissions before inserting the resource
            await addRightsToNewResource(ctx, ctx.params.resource['@id'] || ctx.params.resource.id, webId);
            break;

          case 'activitypub.collection.create':
            const { permissions } = await ctx.call('activitypub.registry.getByUri', {
              collectionUri: ctx.params.collectionUri
            });
            const collectionRights = typeof permissions === 'function' ? permissions(webId) : permissions;

            // We must add the permissions before inserting the collection
            await ctx.call('webacl.resource.addRights', {
              resourceUri: ctx.params.collectionUri,
              newRights: ctx.params.rights || collectionRights || defaultCollectionRights(webId),
              webId: 'system'
            });
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
                { resourceUri: ctx.params.resource['@id'] || ctx.params.resource.id },
                { meta: { webId: 'system' } }
              );
              break;
            case 'activitypub.collection.create':
              await ctx.call(
                'webacl.resource.deleteAllRights',
                { resourceUri: ctx.params.collectionUri },
                { meta: { webId: 'system' } }
              );
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
              { meta: { webId: 'system' } }
            );
            break;

          case 'ldp.container.create':
            const { permissions } = await ctx.call('ldp.registry.getByUri', {
              containerUri: ctx.params.containerUri
            });
            const containerRights = typeof permissions === 'function' ? permissions(webId) : permissions;

            await ctx.call('webacl.resource.addRights', {
              resourceUri: ctx.params.containerUri,
              newRights: ctx.params.rights || containerRights || defaultContainerRights(webId),
              webId: 'system'
            });
            break;

          case 'webid.create':
            await addRightsToNewUser(ctx, actionReturnValue);
            break;

          case 'activitypub.activity.create':
            const activity = await ctx.call('activitypub.activity.get', {
              resourceUri: actionReturnValue.resourceUri,
              webId: 'system'
            });
            const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });

            // Give read rights to the activity's recipients
            // TODO improve performances by passing all users at once
            // https://github.com/assemblee-virtuelle/semapps/issues/908
            for (let recipient of recipients) {
              await ctx.call('webacl.resource.addRights', {
                resourceUri: actionReturnValue.resourceUri,
                additionalRights: {
                  user: {
                    uri: recipient,
                    read: true
                  }
                },
                webId: 'system'
              });
            }

            // If activity is public, give anonymous read right
            if (await ctx.call('activitypub.activity.isPublic', { activity })) {
              await ctx.call('webacl.resource.addRights', {
                resourceUri: actionReturnValue.resourceUri,
                additionalRights: {
                  anon: {
                    read: true
                  }
                },
                webId: 'system'
              });
            }
        }

        return actionReturnValue;
      };
    }

    // Do not use the middleware for this action
    return next;
  })
});

module.exports = WebAclMiddleware;
