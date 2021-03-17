const WebAclResourceService = require('./services/resource');
const WebAclGroupService = require('./services/group');
const { parseHeader, negotiateContentType, negotiateAccept } = require('@semapps/middlewares');

module.exports = {
  name: 'webacl',
  settings: {
    baseUrl: null,
    graphName: '<http://semapps.org/webacl>',
    superAdmins: []
  },
  dependencies: ['api'],
  async created() {
    const { baseUrl, graphName, superAdmins } = this.schema.settings;

    await this.broker.createService(WebAclResourceService, {
      settings: {
        baseUrl,
        graphName
      }
    });

    await this.broker.createService(WebAclGroupService, {
      settings: {
        baseUrl,
        graphName,
        superAdmins
      }
    });
  },
  async started() {
    const routes = await this.actions.getApiRoutes();
    for (let route of routes) {
      await this.broker.call('api.addRoute', { route });
    }
  },
  actions: {
    async getApiRoutes(ctx) {
      const middlewares = [parseHeader, negotiateContentType, negotiateAccept];

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
          onBeforeCall(ctx, route, req) {
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
