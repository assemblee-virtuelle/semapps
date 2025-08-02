import { acl, vcard, rdfs } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import WebAclResourceService from './services/resource/index.ts';
import WebAclCacheService from './services/cache/index.ts';
import WebAclGroupService from './services/group/index.ts';
import WebAclAuthorizerService from './services/authorizer/index.ts';
import getRoutes from './routes/getRoutes.ts';

const WebaclSchema = {
  name: 'webacl' as const,
  settings: {
    baseUrl: null,
    graphName: 'http://semapps.org/webacl',
    podProvider: false,
    superAdmins: []
  },
  dependencies: ['api', 'ontologies'],
  async created() {
    const { baseUrl, graphName, podProvider, superAdmins } = this.settings;

    this.broker.createService({
      // @ts-expect-error TS(2322): Type '{ name: "webacl.resource"; settings: { baseU... Remove this comment to see the full error message
      mixins: [WebAclResourceService],
      settings: {
        baseUrl,
        graphName,
        podProvider
      }
    });

    this.broker.createService({
      // @ts-expect-error TS(2322): Type '{ name: "webacl.group"; settings: { baseUrl:... Remove this comment to see the full error message
      mixins: [WebAclGroupService],
      settings: {
        baseUrl,
        graphName,
        podProvider,
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

    for (const route of getRoutes(basePath, this.settings.podProvider)) {
      await this.broker.call('api.addRoute', { route });
    }

    await this.broker.call('ontologies.register', acl);
    await this.broker.call('ontologies.register', vcard);
    await this.broker.call('ontologies.register', rdfs);
  }
} satisfies ServiceSchema;

export default WebaclSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebaclSchema.name]: typeof WebaclSchema;
    }
  }
}
