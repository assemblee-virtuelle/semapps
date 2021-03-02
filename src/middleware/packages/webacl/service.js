const urlJoin = require('url-join');
const WebACLResourceService = require('./services/resource');
const WebACLGroupService = require('./services/group');

const { parseHeader, negotiateContentType, negotiateAccept, parseJson } = require('@semapps/middlewares');

const middlewares = [
  parseHeader,
  negotiateContentType,
  negotiateAccept
  //parseJson,
];

module.exports = {
  name: 'webacl',
  settings: {
    baseUrl: null,
    graphName: null
  },
  dependencies: ['ldp', 'triplestore'],
  async created() {
    const { baseUrl, graphName } = this.schema.settings;

    await this.broker.createService(WebACLResourceService, {
      settings: {
        baseUrl,
        graphName
      }
    });

    await this.broker.createService(WebACLGroupService, {
      settings: {
        baseUrl,
        graphName
      }
    });
  },
  actions: {
    async getApiRoutes(ctx) {
      return [
        {
          authorization: false,
          authentication: true,
          bodyParsers: {
            json: false,
            urlencoded: false,
            text: {
              type: ['text/turtle', 'application/ld+json']
            }
          },
          onBeforeCall(ctx, route, req, res) {
            ctx.meta.body = req.body;
          },
          aliases: {
            'PATCH /_acl/:slugParts*': [parseHeader, 'webacl.resource.api_addRights'],
            'PUT /_acl/:slugParts*': [parseHeader, 'webacl.resource.api_setRights']
          },
          onError(req, res, err) {
            let { type, code, message, data, name } = err;
            res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
              'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ type, code, message, data, name }));
          }
        },
        {
          authorization: false,
          authentication: true,
          aliases: {
            'GET /_acl/:slugParts*': [...middlewares, 'webacl.resource.api_getRights'],
            'GET /_rights/:slugParts*': [...middlewares, 'webacl.resource.api_hasRights'],
            'POST /_rights/:slugParts*': [...middlewares, 'webacl.resource.api_hasRights'],
            'PATCH /_group/:id': ['webacl.group.api_addMember'],
            'POST /_group': ['webacl.group.api_create'],
            'GET /_group/:id': ['webacl.group.api_getMembers'],
            'GET /_group': ['webacl.group.api_getGroups'],
            'DELETE /_group/:id': ['webacl.group.api_delete'],
            'POST /_group/:id': ['webacl.group.api_removeMember']
          },
          bodyParsers: {
            json: true
          },
          onError(req, res, err) {
            let { type, code, message, data, name } = err;
            res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', {
              'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ type, code, message, data, name }));
          }
        }
      ];
    }
  }
};
