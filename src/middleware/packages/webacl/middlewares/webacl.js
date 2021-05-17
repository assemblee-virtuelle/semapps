const { throw403 } = require('@semapps/middlewares');
const { getSlugFromUri, getContainerFromUri } = require('../utils');

const handledActions = [
  'ldp.resource.get',
  'ldp.resource.patch',
  'ldp.resource.put',
  'ldp.resource.delete',
  'ldp.resource.post',
  'ldp.container.create',
  'activitypub.collection.create'
];

// TODO add different permissions depending on the webId ?
const addRightsToNewCollection = async (ctx, collectionUri, webId) => {
  await ctx.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: collectionUri,
    newRights: {
      anon: {
        write: true
      }
    }
  });
};

const addRightsToNewResource = async (ctx, resourceUri, webId) => {
  let newRights = {};

  switch (webId) {
    case 'anon':
      newRights.anon = {
        read: true,
        write: true
      };
      break;

    case 'system':
      newRights.anon = {
        read: true
      };
      newRights.anyUser = {
        read: true,
        write: true
      };
      break;

    default:
      newRights.anon = {
        read: true
      };
      newRights.anyUser = {
        read: true
      };
      newRights.user = {
        uri: webId,
        read: true,
        write: true,
        control: true
      };
      break;
  }

  await ctx.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri,
    newRights
  });
};

const addRightsToNewContainer = async (ctx, containerUri, webId) => {
  let newRights = {};

  switch (webId) {
    case 'anon':
      newRights.anon = {
        read: true,
        append: true
      };
      break;

    case 'system':
      newRights.anon = {
        read: true
      };
      newRights.anyUser = {
        read: true,
        write: true
      };
      break;

    default:
      newRights.user = {
        uri: webId,
        read: true,
        write: true,
        control: true
      };
      break;
  }

  await ctx.call('webacl.resource.addRights', {
    webId: 'system',
    resourceUri: containerUri,
    newRights
  });
};

// List of containers with default anon read, so that we can bypass permissions check for the resources it contains
// TODO invalidate this cache when default permissions are changed
let containersWithDefaultAnonRead = [];

const WebAclMiddleware = {
  name: 'WebAclMiddleware',
  async started(broker) {
    const containers = await broker.call('ldp.container.getAll');
    for( let containerUri of containers ) {
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

      if( authorizations.length > 0 ) {
        containersWithDefaultAnonRead.push(containerUri);
      }
    }
  },
  localAction: (wrapWebAclMiddleware = (next, action) => {
    if (handledActions.includes(action.name)) {
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let authorized = true,
          newResourceUri,
          actionReturnValue;

        /*
         * VERIFY AUTHORIZATIONS
         * This allows us to quickly check the permissions for GET operations using the Redis cache
         * This way, we don't need to add the webId in the Redis cache key and it is more efficient
         */
        if (webId !== 'system' && action.name === 'ldp.resource.get') {
          const resourceUri = ctx.params.resourceUri || ctx.params.resource.id || ctx.params.resource['@id'];
          const containerUri = getContainerFromUri(resourceUri);

          if( containersWithDefaultAnonRead.includes(containerUri) ) {
            authorized = true;
          } else {
            const result = await ctx.call('webacl.resource.hasRights', {
              resourceUri,
              rights: { read: true }, // Check only the read permissions to improve performances
              webId
            });
            authorized = result.read;
          }
        }

        if (authorized) {
          // This is used by the ldp.resource.get action to avoid checking twice the permissions
          ctx.params.aclVerified = true;

          /*
           * BEFORE HOOKS
           */
          switch (action.name) {
            case 'ldp.resource.post':
              // Use the same method as ldp.resource.post to generate the URI
              newResourceUri = await ctx.call('ldp.resource.generateId', {
                containerUri: ctx.params.containerUri,
                slug: ctx.params.slug
              });
              // Ensure the action will use the same slug (this is necessary if the slug was generated automatically)
              ctx.params.slug = getSlugFromUri(newResourceUri);
              // We must add the permissions before inserting the resource
              await addRightsToNewResource(ctx, newResourceUri, webId);
              break;

            case 'activitypub.collection.create':
              // We must add the permissions before inserting the collection
              await addRightsToNewCollection(ctx, ctx.params.collectionUri, webId);
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
              case 'ldp.resource.post':
                await ctx.call(
                  'webacl.resource.deleteAllRights',
                  { resourceUri: newResourceUri },
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
              await addRightsToNewContainer(ctx, ctx.params.containerUri, webId);
              break;
          }

          return actionReturnValue;
        } else {
          throw403();
        }
      };
    }

    // Do not use the middleware for this action
    return next;
  })
};

module.exports = WebAclMiddleware;
