import path from 'path';
import { parseHeader, negotiateContentType, negotiateAccept, parseJson } from '@semapps/middlewares';

const onError = (req, res, err) => {
  const { type, code, message, data, name } = err;
  res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ type, code, message, data, name }));
};

const getRoutes = (basePath, podProvider) => {
  const middlewares = [parseHeader, parseJson, negotiateContentType, negotiateAccept];

  return [
    {
      path: path.join(basePath, '/_acl'),
      name: 'acl' as const,
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
      path: path.join(basePath, '/_rights'),
      name: 'acl-rights' as const,
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
      path: path.join(basePath, podProvider ? '/_groups/:username([^/._][^/]+)' : '/_groups'),
      name: 'acl-groups' as const,
      authorization: false,
      authentication: true,
      aliases: {
        'POST /': [parseHeader, 'webacl.group.api_create'],
        'GET /:id+': ['webacl.group.api_getMembers'],
        'GET /': ['webacl.group.api_getGroups'],
        'DELETE /:id+': ['webacl.group.api_delete'],
        'PATCH /:id+': ['webacl.group.api_addMember'],
        'PUT /:id+': ['webacl.group.api_removeMember']
      },
      bodyParsers: {
        json: true
      },
      onError
    }
  ];
};

export default getRoutes;
