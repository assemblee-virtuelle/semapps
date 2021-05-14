const { throw403 } = require('@semapps/middlewares');
const { getSlugFromUri } = require('../utils');

const handledActions = [
  'ldp.resource.get',
  'ldp.resource.patch',
  'ldp.resource.put',
  'ldp.resource.delete',
  'ldp.resource.post',
  'ldp.container.create',
  'activitypub.collection.create'
];

const actionsToVerify = {
  // Resources
  'ldp.resource.get': { minimumRight: 'read', verifyOn: 'resource' },
  'ldp.resource.patch': { minimumRight: 'append', verifyOn: 'resource' },
  'ldp.resource.put': { minimumRight: 'append', verifyOn: 'resource' },
  'ldp.resource.delete': { minimumRight: 'write', verifyOn: 'resource' },
  // Container
  'ldp.resource.post': { minimumRight: 'append', verifyOn: 'container' }
};

const rightsLevel = ['read', 'append', 'write', 'control'];

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

const WebAclMiddleware = {
  name: 'WebAclMiddleware',
  localAction: (wrapWebAclMiddleware = (next, action) => {
    if (handledActions.includes(action.name)) {
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let authorized = true,
          newResourceUri,
          actionReturnValue;

        /*
         * VERIFY AUTHORIZATIONS
         * This allows us to quickly check the permissions using the Redis cache on webacl.resource.hasRights
         * This way, we don't need to add the webId in the Redis cache key and it is more efficient
         */
        if (webId !== 'system' && actionsToVerify[action.name]) {
          const { minimumRight, verifyOn } = actionsToVerify[action.name];
          const result = await ctx.call('webacl.resource.hasRights', {
            resourceUri:
              verifyOn === 'resource'
                ? ctx.params.resourceUri || ctx.params.resource.id || ctx.params.resource['@id']
                : ctx.params.containerUri,
            webId
          });

          // We must check that at least one of these right is true
          // For example if the minimumRight is 'append', we check that either append, write or control are true
          const rightsToCheck = rightsLevel.slice(rightsLevel.indexOf(minimumRight));
          authorized = rightsToCheck.some(rightKey => result[rightKey] === true);
        }

        if (authorized) {
          // This can be used by actions, for example to use a 'system' webId in order to improve performances
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
