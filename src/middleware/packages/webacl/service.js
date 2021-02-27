const urlJoin = require('url-join');
const WebACLResourceService = require('./services/resource');
const WebACLGroupService = require('./services/group');

const {
  parseHeader,
  negotiateContentType,
  negotiateAccept,
  parseJson,
} = require('@semapps/middlewares');

const middlewares = [
  parseHeader,
  negotiateContentType,
  negotiateAccept,
  //parseJson,
];

module.exports = {
  name: 'webacl',
  settings: {
    baseUrl: null,
    graphName: null,
  },
  dependencies: ['ldp','triplestore'],
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
          aliases: {
            'GET /_acl/:slugParts*': [...middlewares, 'webacl.resource.api_getRights'],
            'GET /_rights/:slugParts*': [...middlewares, 'webacl.resource.api_hasRights'],
            'POST /_rights/:slugParts*': [...middlewares, 'webacl.resource.api_hasRights'],
          },
          bodyParsers: {
            json: true
          },
          onError (req, res, err) {
            let { type, code, message, data, name } = err
            res.writeHead(Number(code) || 500, data && data.status ? data.status : 'Server error', { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ type, code, message, data, name }))
          }
        },
      ]
    }
  }
};
