const { MIME_TYPES } = require('@semapps/mime-types');
const { throw403 } = require('@semapps/middlewares');

const actionsToVerify = {
  // Resources
  'ldp.resource.get': { requiredRights: { read: true }, verifyOn: 'resource' },
  'ldp.resource.patch': { requiredRights: { append: true }, verifyOn: 'resource' },
  'ldp.resource.put': { requiredRights: { write: true }, verifyOn: 'resource' },
  'ldp.resource.delete': { requiredRights: { write: true }, verifyOn: 'resource' },
  // Container
  'ldp.resource.post': { requiredRights: { append: true }, verifyOn: 'container' },
  // 'ldp.container.get': { requiredRights: { read: true }, verifyOn: 'container' },
};

const WebAclMiddleware = {
  name: "WebAclMiddleware",
  localAction: wrapWebAclMiddleware = (next, action) => {
    if( Object.keys(actionsToVerify).includes(action.name) ) {
      return async ctx => {
        const { requiredRights, verifyOn } = actionsToVerify[action.name];

        const result = await ctx.call('webacl.resource.hasRights', {
          resourceUri: verifyOn === 'resource' ? ctx.params.resourceUri : ctx.params.containerUri,
          rights: requiredRights,
          accept: MIME_TYPES.JSON,
          webId: ctx.meta.webId
        });

        const authorized = Object.keys(requiredRights).every(rightKey => result[rightKey] === true);

        if( authorized ) {
          ctx.params.aclVerified = true;
          return next(ctx);
        } else {
          throw new throw403();
        }
      }
    }

    // Do not use the middleware for this action
    return next;
  }
};

module.exports = WebAclMiddleware;
