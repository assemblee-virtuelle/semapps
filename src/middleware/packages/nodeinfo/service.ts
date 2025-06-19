import path from 'path';
import urlJoin from 'url-join';
import { ServiceSchema, defineAction } from 'moleculer';

const NodeinfoService = {
  name: 'nodeinfo' as const,
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
        name: 'nodeinfo-links' as const,
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
        name: 'nodeinfo-schema' as const,
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
    addLink: defineAction({
      handler(ctx) {
        const { rel, href } = ctx.params;
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.links.push({ rel, href });
      }
    }),

    getLinks: defineAction({
      handler() {
        return {
          links: this.links
        };
      }
    }),

    getSchema: defineAction({
      async handler(ctx) {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const users = await this.actions.getUsersCount({}, { parentCtx: ctx });
        return {
          version: '2.1' as const,
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          software: this.settings.software,
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          protocols: this.settings.protocols,
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          services: this.settings.services,
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          openRegistrations: this.settings.openRegistrations,
          usage: { users },
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          metadata: this.settings.metadata
        };
      }
    }),

    getUsersCount: defineAction({
      // Overwrite this method to return your users count
      async handler() {
        return {
          total: 0,
          activeHalfYear: 0,
          activeMonth: 0
        };
      }
    })
  }
} satisfies ServiceSchema;

export default NodeinfoService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [NodeinfoService.name]: typeof NodeinfoService;
    }
  }
}
