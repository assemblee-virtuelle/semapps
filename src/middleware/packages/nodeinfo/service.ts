const path = require('path');
const urlJoin = require('url-join');

const NodeinfoService = {
  name: 'nodeinfo',
  settings: {
    baseUrl: null,
    software: {
      name: undefined,
      version: undefined,
      repository: undefined,
      homepage: undefined
    },
    protocols: [],
    services: {
      inbound: [],
      outbound: []
    },
    openRegistrations: true,
    metadata: {}
  },
  dependencies: ['api'],
  created() {
    this.links = [];
  },
  async started() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting is missing from nodeinfo service');
    const { pathname: basePath } = new URL(this.settings.baseUrl);

    await this.broker.call('api.addRoute', {
      route: {
        name: 'nodeinfo-links',
        path: '/.well-known/nodeinfo', // .well-known links must use the root path
        authorization: false,
        authentication: false,
        aliases: {
          'GET /': 'nodeinfo.getLinks'
        }
      }
    });

    await this.broker.call('api.addRoute', {
      route: {
        name: 'nodeinfo-schema',
        path: path.join(basePath, '/nodeinfo/2.1'),
        authorization: false,
        authentication: false,
        aliases: {
          'GET /': 'nodeinfo.getSchema'
        }
      }
    });

    this.actions.addLink({
      rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
      href: urlJoin(this.settings.baseUrl, 'nodeinfo/2.1')
    });
  },
  actions: {
    addLink(ctx) {
      const { rel, href } = ctx.params;
      this.links.push({ rel, href });
    },
    getLinks() {
      return {
        links: this.links
      };
    },
    async getSchema(ctx) {
      const users = await this.actions.getUsersCount({}, { parentCtx: ctx });
      return {
        version: '2.1',
        software: this.settings.software,
        protocols: this.settings.protocols,
        services: this.settings.services,
        openRegistrations: this.settings.openRegistrations,
        usage: { users },
        metadata: this.settings.metadata
      };
    },
    // Overwrite this method to return your users count
    async getUsersCount() {
      return {
        total: 0,
        activeHalfYear: 0,
        activeMonth: 0
      };
    }
  }
};

module.exports = NodeinfoService;
