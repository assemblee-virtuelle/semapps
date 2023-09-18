const { throw403 } = require('@semapps/middlewares');
const { getContainerFromUri, isRemoteUri, getSlugFromUri } = require('../utils');
const { defaultContainerRights, defaultCollectionRights } = require('../defaultRights');

const modifyActions = [
  'ldp.resource.create',
  'ldp.container.create',
  'activitypub.collection.create',
  'activitypub.activity.create',
  'activitypub.activity.attach',
  'webid.create',
  'ldp.remote.store',
  'ldp.remote.delete',
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
const containersWithDefaultAnonRead = [];

const WebAclMiddleware = ({ baseUrl, podProvider = false, graphName = 'http://semapps.org/webacl' }) => ({
  name: 'WebAclMiddleware',
  async started(broker) {
    if (!baseUrl) throw new Error('The baseUrl config is missing for the WebACL middleware');
    if (!podProvider) {
      await broker.waitForServices(['ldp.container', 'triplestore']);
      const containers = await broker.call('ldp.container.getAll');
      for (const containerUri of containers) {
        const authorizations = await broker.call('triplestore.query', {
          query: `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX acl: <http://www.w3.org/ns/auth/acl#>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT ?auth
            WHERE {
              GRAPH <${graphName}> {
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

        if (isRemoteUri(resourceUri, ctx.meta.dataset, { baseUrl, podProvider })) {
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
        }
        throw403();
      };
    }
    if (modifyActions.includes(action.name)) {
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let actionReturnValue;

        /*
         * BEFORE HOOKS
         */
        switch (action.name) {
          case 'ldp.resource.create':
            const resourceUri = ctx.params.resource['@id'] || ctx.params.resource.id;
            // Do not add ACLs if this is a mirrored resource as WebACL are not activated on the mirror graph
            if (
              isRemoteUri(resourceUri, ctx.meta.dataset, { baseUrl, podProvider }) &&
              (await ctx.call('ldp.remote.getGraph', { resourceUri })) === 'http://semapps.org/mirror'
            )
              return next(ctx);
            // We must add the permissions before inserting the resource
            await addRightsToNewResource(ctx, resourceUri, webId);
            break;

          case 'ldp.container.create': {
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
          }

          case 'activitypub.collection.create': {
            const { permissions } = ctx.params?.config || {};
            const collectionRights = typeof permissions === 'function' ? permissions(webId) : permissions;

            // We must add the permissions before inserting the collection
            await ctx.call('webacl.resource.addRights', {
              resourceUri: ctx.params.collectionUri,
              newRights: ctx.params.rights || collectionRights || defaultCollectionRights(webId),
              webId: 'system'
            });
            break;
          }
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
            case 'ldp.container.create':
              await ctx.call(
                'webacl.resource.deleteAllRights',
                { resourceUri: ctx.params.containerUri },
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

          case 'ldp.remote.delete':
            await ctx.call(
              'webacl.resource.deleteAllRights',
              { resourceUri: ctx.params.resourceUri },
              { meta: { webId: 'system' } }
            );
            break;

          case 'webid.create':
            await addRightsToNewUser(ctx, actionReturnValue);
            break;

          case 'ldp.remote.store': {
            const webId = ctx.params.webId || ctx.meta.webId;
            const resourceUri = ctx.params.resourceUri || ctx.params.resource.id || ctx.params.resource['@id'];
            // When a remote resource is stored in the default graph, give read permission to the logged user
            if (!ctx.params.mirrorGraph && webId && webId !== 'system' && webId !== 'anon') {
              const dataset = podProvider ? getSlugFromUri(webId) : undefined;
              await ctx.call(
                'webacl.resource.addRights',
                {
                  resourceUri,
                  additionalRights: {
                    user: {
                      uri: webId,
                      read: true
                    }
                  },
                  webId: 'system'
                },
                { meta: { dataset } }
              );
            }
            break;
          }

          case 'activitypub.activity.create':
          case 'activitypub.activity.attach':
            const activity = await ctx.call('activitypub.activity.get', {
              resourceUri: actionReturnValue.resourceUri,
              webId: ctx.params.webId || 'system'
            });

            const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });

            // When a new activity is created, ensure the emitter has read rights also
            if (action.name === 'activitypub.activity.create') {
              if (!recipients.includes(activity.actor)) recipients.push(activity.actor);
            }

            // Give read rights to the activity's recipients
            // TODO improve performances by passing all users at once
            // https://github.com/assemblee-virtuelle/semapps/issues/908
            for (const recipient of recipients) {
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
  }
});

module.exports = WebAclMiddleware;
