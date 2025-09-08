<<<<<<< HEAD
// @ts-expect-error TS(2305): Module '"@semapps/ontologies"' has no exported mem... Remove this comment to see the full error message
=======
>>>>>>> 2.0
import { ldp, semapps } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import LdpApiService from './services/api/index.ts';
import LdpContainerService from './services/container/index.ts';
import LdpCacheService from './services/cache/index.ts';
import LdpLinkHeaderService from './services/link-header/index.ts';
import LdpRegistryService from './services/registry/index.ts';
import LdpRemoteService from './services/remote/index.ts';
import LdpResourceService from './services/resource/index.ts';
import PermissionsService from './services/permissions/index.ts';

const LdpSchema = {
  name: 'ldp' as const,
  settings: {
    baseUrl: null,
    containers: [],
    podProvider: false,
<<<<<<< HEAD
=======
    mirrorGraphName: 'http://semapps.org/mirror',
>>>>>>> 2.0
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
<<<<<<< HEAD
=======
      mirrorGraphName,
>>>>>>> 2.0
      preferredViewForResource,
      resourcesWithContainerPath,
      binary
    } = this.settings;

    this.broker.createService({
      // @ts-expect-error TS(2322): Type '{ name: "ldp.container"; settings: { baseUrl... Remove this comment to see the full error message
      mixins: [LdpContainerService],
      settings: {
        baseUrl,
<<<<<<< HEAD
        podProvider
=======
        podProvider,
        mirrorGraphName
>>>>>>> 2.0
      },
      hooks: this.schema.hooksContainer || {}
    });

    this.broker.createService({
      // @ts-expect-error TS(2322): Type '{ name: "ldp.resource"; settings: { baseUrl:... Remove this comment to see the full error message
      mixins: [LdpResourceService],
      settings: {
        baseUrl,
        podProvider,
<<<<<<< HEAD
=======
        mirrorGraphName,
>>>>>>> 2.0
        preferredViewForResource,
        resourcesWithContainerPath,
        binary
      },
      hooks: this.schema.hooksResource || {}
    });

    this.broker.createService({
      // @ts-expect-error TS(2322): Type '{ name: "ldp.remote"; mixins: any[]; setting... Remove this comment to see the full error message
      mixins: [LdpRemoteService],
      settings: {
        baseUrl,
<<<<<<< HEAD
        podProvider
=======
        podProvider,
        mirrorGraphName
>>>>>>> 2.0
      }
    });

    this.broker.createService({
      // @ts-expect-error TS(2322): Type '{ name: "ldp.registry"; settings: { baseUrl:... Remove this comment to see the full error message
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

<<<<<<< HEAD
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "permissions";... Remove this comment to see the full error message
    this.broker.createService({ mixins: [PermissionsService] });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ldp.link-head... Remove this comment to see the full error message
=======
    // @ts-expect-error TS(2322): Type '{ name: "permissions"; actions: { addAuthori... Remove this comment to see the full error message
    this.broker.createService({ mixins: [PermissionsService] });

    // @ts-expect-error TS(2322): Type '{ name: "ldp.link-header"; actions: { get: A... Remove this comment to see the full error message
>>>>>>> 2.0
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
    getBaseUrl: {
      handler() {
        return this.settings.baseUrl;
      }
    },

    getBasePath: {
      handler() {
        const { pathname } = new URL(this.settings.baseUrl);
        return pathname;
      }
    },

    getSetting: {
      handler(ctx) {
        const { key } = ctx.params;
        return this.settings[key];
      }
    }
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
