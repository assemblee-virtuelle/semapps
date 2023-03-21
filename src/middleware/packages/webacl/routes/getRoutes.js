const { parseHeader, negotiateContentType, negotiateAccept, parseJson } = require('@semapps/middlewares');

const onError = (req, res, err) => {
  let { type, code, message, data, name } = err;
  res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ type, code, message, data, name }));
};

const getRoutes = () => {
  const middlewares = [parseHeader, parseJson, negotiateContentType, negotiateAccept];

  return [
    {
      path: '/_acl',
      name: 'acl',
      authorization: false,
      authentication: true,
      bodyParsers: {
        json: false,
        urlencoded: false,
        text: {
          type: ['text/turtle', 'application/ld+json']
        }
      },
      onBeforeCall(ctx, route, req) {
        ctx.meta.body = req.body;
      },
      aliases: {
        'PATCH /:slugParts*': [parseHeader, 'webacl.resource.api_addRights'],
        'PUT /:slugParts*': [parseHeader, 'webacl.resource.api_setRights'],
        'GET /:slugParts*': [...middlewares, 'webacl.resource.api_getRights']
      },
      onError
    },
    {
      path: '/_rights',
      name: 'acl-rights',
      authorization: false,
      authentication: true,
      aliases: {
        'GET /:slugParts*': [...middlewares, 'webacl.resource.api_hasRights'],
        'POST /:slugParts*': [...middlewares, 'webacl.resource.api_hasRights']
      },
      bodyParsers: {
        json: false
      },
      onError
    },
    {
      path: '/_groups',
      name: 'acl-groups',
      authorization: false,
      authentication: true,
      aliases: {
        'PATCH /:id': ['webacl.group.api_addMember'],
        'POST /': ['webacl.group.api_create'],
        'GET /:id': ['webacl.group.api_getMembers'],
        'GET /': ['webacl.group.api_getGroups'],
        'DELETE /:id': ['webacl.group.api_delete'],
        'POST /:id': ['webacl.group.api_removeMember']
      },
      bodyParsers: {
        json: true
      },
      onError
    }
  ];
};

module.exports = getRoutes;
