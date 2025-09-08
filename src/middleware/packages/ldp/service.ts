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
      preferredViewForResource,
      resourcesWithContainerPath,
      binary
    } = this.settings;

    this.broker.createService({
      mixins: [LdpContainerService],
      settings: {
        baseUrl,
        podProvider
      },
      hooks: this.schema.hooksContainer || {}
    });

    this.broker.createService({
      mixins: [LdpResourceService],
      settings: {
        baseUrl,
        podProvider,
        preferredViewForResource,
        resourcesWithContainerPath,
        binary
      },
      hooks: this.schema.hooksResource || {}
    });

    this.broker.createService({
      mixins: [LdpRemoteService],
      settings: {
        baseUrl,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [LdpRegistryService],
      settings: {
        baseUrl,
        containers,
        defaultOptions: defaultContainerOptions,
        podProvider
      }
    });

    this.broker.createService({
      mixins: [LdpApiService],
      settings: {
        baseUrl,
        podProvider
      }
    });

    this.broker.createService({ mixins: [PermissionsService] });

    this.broker.createService({ mixins: [LdpLinkHeaderService] });

    // Only create this service if a cacher is defined
    if (this.broker.cacher) {
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
