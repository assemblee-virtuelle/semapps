const { throw403 } = require('@semapps/middlewares');

const actionsToVerify = {
  // Resources
  'ldp.resource.get': { minimumRight: 'read', verifyOn: 'resource' },
  'ldp.resource.patch': { minimumRight: 'append', verifyOn: 'resource' },
  'ldp.resource.put': { minimumRight: 'write', verifyOn: 'resource' },
  'ldp.resource.delete': { minimumRight: 'write', verifyOn: 'resource' },
  // Container
  'ldp.resource.post': { minimumRight: 'append', verifyOn: 'container' }
};

const rightsLevel = ['read', 'append', 'write', 'control'];

const WebAclMiddleware = {
  name: 'WebAclMiddleware',
  localAction: (wrapWebAclMiddleware = (next, action) => {
    if (Object.keys(actionsToVerify).includes(action.name)) {
      return async ctx => {
        const webId = ctx.params.webId || ctx.meta.webId || 'anon';
        let authorized = false;

        if (webId === 'system') {
          authorized = true;
        } else {
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
          ctx.params.aclVerified = true;
          return next(ctx);
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
