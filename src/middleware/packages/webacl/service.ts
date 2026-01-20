import { acl, vcard, rdfs } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import WebAclResourceService from './services/resource/index.ts';
import WebAclCacheService from './services/cache/index.ts';
import WebAclGroupService from './services/group/index.ts';
import WebAclAuthorizerService from './services/authorizer/index.ts';
import getRoutes from './routes/getRoutes.ts';

const WebAclService = {
  name: 'webacl' as const,
  settings: {
    baseUrl: null,
    superAdmins: []
  },
  dependencies: ['api', 'ontologies'],
  async created() {
    const { baseUrl, superAdmins } = this.settings;

    // @ts-expect-error TS(2322): Type '{ name: "webacl.resource"; settings: { baseUrl:... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [WebAclResourceService],
      settings: {
        baseUrl
      }
    });

    // @ts-expect-error TS(2322): Type '{ name: "webacl.group"; settings: { baseUrl:... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [WebAclGroupService],
      settings: {
        baseUrl,
        superAdmins
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "webacl.author... Remove this comment to see the full error message
    this.broker.createService({ mixins: [WebAclAuthorizerService] });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "webacl.cache"... Remove this comment to see the full error message
      this.broker.createService({ mixins: [WebAclCacheService] });
    }
  },
  async started() {
    const { pathname: basePath } = new URL(this.settings.baseUrl);

    for (const route of getRoutes(basePath)) {
      await this.broker.call('api.addRoute', { route });
    }

    await this.broker.call('ontologies.register', acl);
    await this.broker.call('ontologies.register', vcard);
    await this.broker.call('ontologies.register', rdfs);
  }
} satisfies ServiceSchema;

export default WebAclService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebAclService.name]: typeof WebAclService;
    }
  }
}
