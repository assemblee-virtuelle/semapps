import path from 'path';

import { parseHeader, parseRawBody, negotiateContentType, negotiateAccept, parseJson } from '@semapps/middlewares';

const onError = (req: any, res: any, err: any) => {
  const { type, code, message, data, name } = err;
  res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({ type, code, message, data, name }));
};

const getRoutes = (basePath: any, podProvider: any) => {
  const middlewares = [parseHeader, negotiateContentType, negotiateAccept, parseRawBody, parseJson];

  return [
    {
      path: path.join(basePath, '/_acl'),
      name: 'acl',
      authorization: false,
      authentication: true,
      bodyParsers: false,
      aliases: {
        'PATCH /:slugParts*': [...middlewares, 'webacl.resource.api_addRights'],
        'PUT /:slugParts*': [...middlewares, 'webacl.resource.api_setRights'],
        'GET /:slugParts*': [...middlewares, 'webacl.resource.api_getRights']
      },
      onError
    },
    {
      path: path.join(basePath, '/_rights'),
      name: 'acl-rights',
      authorization: false,
      authentication: true,
      aliases: {
        'GET /:slugParts*': [...middlewares, 'webacl.resource.api_hasRights'],
        'POST /:slugParts*': [...middlewares, 'webacl.resource.api_hasRights']
      },
      bodyParsers: false,
      onError
    },
    {
      path: path.join(basePath, podProvider ? '/_groups/:username([^/._][^/]+)' : '/_groups'),
      name: 'acl-groups',
      authorization: false,
      authentication: true,
      aliases: {
        'POST /': [...middlewares, 'webacl.group.api_create'],
        'GET /:id+': [...middlewares, 'webacl.group.api_getMembers'],
        'GET /': [...middlewares, 'webacl.group.api_getGroups'],
        'DELETE /:id+': [...middlewares, 'webacl.group.api_delete'],
        'PATCH /:id+': [...middlewares, 'webacl.group.api_addMember'],
        'PUT /:id+': [...middlewares, 'webacl.group.api_removeMember']
      },
      bodyParsers: false,
      onError
    }
  ];
};

export default getRoutes;
