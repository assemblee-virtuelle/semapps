// @ts-expect-error TS(2305): Module '"@semapps/ontologies"' has no exported mem... Remove this comment to see the full error message
import { ldp, semapps } from '@semapps/ontologies';
import { ServiceSchema, defineAction } from 'moleculer';
import LdpApiService from './services/api/index.ts';
import LdpContainerService from './services/container/index.ts';
import LdpCacheService from './services/cache/index.ts';
import LdpLinkHeaderService from './services/link-header/index.ts';
import LdpRegistryService from './services/registry/index.ts';
import LdpRemoteService from './services/remote/index.ts';
import LdpResourceService from './services/resource/index.ts';

const LdpSchema = {
  name: 'ldp' as const,
  settings: {
    baseUrl: null,
    containers: [],
    podProvider: false,
    mirrorGraphName: 'http://semapps.org/mirror',
    defaultContainerOptions: {},
    preferredViewForResource: null,
    resourcesWithContainerPath: true,
    binary: {
      maxSize: '50Mb'
    }
  },
  dependencies: ['ldp.container', 'ldp.resource', 'ldp.registry', 'ontologies', 'jsonld'],
  async created() {
    const {
      baseUrl,
      containers,
      podProvider,
      defaultContainerOptions,
      mirrorGraphName,
      preferredViewForResource,
      resourcesWithContainerPath,
      binary
    } = this.settings;

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.container... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [LdpContainerService],
      settings: {
        baseUrl,
        podProvider,
        mirrorGraphName
      },
      hooks: this.schema.hooksContainer || {}
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.resource"... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [LdpResourceService],
      settings: {
        baseUrl,
        podProvider,
        mirrorGraphName,
        preferredViewForResource,
        resourcesWithContainerPath,
        binary
      },
      hooks: this.schema.hooksResource || {}
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.remote"; ... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [LdpRemoteService],
      settings: {
        baseUrl,
        podProvider,
        mirrorGraphName
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.registry"... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [LdpRegistryService],
      settings: {
        baseUrl,
        containers,
        defaultOptions: defaultContainerOptions,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.api"; set... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [LdpApiService],
      settings: {
        baseUrl,
        podProvider
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.link-head... Remove this comment to see the full error message
    this.broker.createService({ mixins: [LdpLinkHeaderService] });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.cache"; d... Remove this comment to see the full error message
      this.broker.createService({ mixins: [LdpCacheService] });
    }
  },
  async started() {
    await this.broker.call('ontologies.register', ldp);
    // Used by binaries
    await this.broker.call('ontologies.register', semapps);
  },
  actions: {
    getBaseUrl: defineAction({
      handler() {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return this.settings.baseUrl;
      }
    }),

    getBasePath: defineAction({
      handler() {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const { pathname } = new URL(this.settings.baseUrl);
        return pathname;
      }
    }),

    getSetting: defineAction({
      handler(ctx) {
        const { key } = ctx.params;
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        return this.settings[key];
      }
    })
  }
} satisfies ServiceSchema;

export default LdpSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpSchema.name]: typeof LdpSchema;
    }
  }
}
