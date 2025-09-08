import { ServiceSchema } from 'moleculer';

const LdpCacheSchema = {
  name: 'ldp.cache' as const,
  dependencies: ['ldp.container'],
  actions: {
    generate: {
      async handler(ctx) {
        const containersUris = await ctx.call('ldp.container.getAll');
        for (const containerUri of containersUris) {
          try {
            await ctx.call('ldp.container.get', { containerUri });
            this.logger.info(`Generated cache for container ${containerUri}`);
          } catch (e) {
            this.logger.warn(`Error when generating cache for container ${containerUri}`);
            console.error(e);
          }
        }
      }
    },

    invalidateResource: {
      async handler(ctx) {
        if (this.broker.cacher) {
          const { resourceUri, dataset } = ctx.params;
          await this.broker.cacher.clean(`ldp.resource.get:${resourceUri}**`);
          await this.broker.cacher.clean(`ldp.resource.getTypes:${resourceUri}**`);

          // Also invalidate the cache of the containers containing the resource
          // For deleted resources, no container will be found (containers will be invalidated through the ldp.resource.detached event)
          for (const containerUri of await ctx.call('ldp.resource.getContainers', { resourceUri, dataset })) {
            await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
          }
        }
      }
    },

    invalidateContainer: {
      async handler(ctx) {
        if (this.broker.cacher) {
          const { containerUri } = ctx.params;
          await this.broker.cacher.clean(`ldp.container.get:${containerUri}**`);
          await this.broker.cacher.clean(`ldp.resource.getTypes:${containerUri}**`);
        }
      }
    }
  },
  events: {
    'ldp.resource.deleted': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    },

    'ldp.resource.updated': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    },

    'ldp.resource.patched': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    },

    'ldp.container.attached': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'containerUri' does not exist on type 'Op... Remove this comment to see the full error message
        const { containerUri } = ctx.params;
        await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
      }
    },

    'ldp.container.patched': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'containerUri' does not exist on type 'Op... Remove this comment to see the full error message
        const { containerUri } = ctx.params;
        await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
      }
    },

    'ldp.container.deleted': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'containerUri' does not exist on type 'Op... Remove this comment to see the full error message
        const { containerUri } = ctx.params;
        await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
      }
    },

    'ldp.container.detached': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'containerUri' does not exist on type 'Op... Remove this comment to see the full error message
        const { containerUri } = ctx.params;
        await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
      }
    },

    'ldp.remote.deleted': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    },

    'ldp.remote.stored': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    },

    'webacl.resource.updated': {
      // Invalidate cache also when ACL rights are changed
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'uri' does not exist on type 'Optionalize... Remove this comment to see the full error message
        const { uri, isContainer, dataset } = ctx.params;
        if (isContainer) {
          await this.actions.invalidateContainer({ containerUri: uri }, { parentCtx: ctx });
        } else {
          await this.actions.invalidateResource({ resourceUri: uri, dataset }, { parentCtx: ctx });
        }
      }
    },

    'webacl.resource.deleted': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'uri' does not exist on type 'Optionalize... Remove this comment to see the full error message
        const { uri, isContainer, dataset } = ctx.params;
        if (isContainer) {
          await this.actions.invalidateContainer({ containerUri: uri }, { parentCtx: ctx });
        } else {
          // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
          await this.actions.invalidateResource({ resourceUri: uri, dataset }, { parentCtx: ctx });
        }
      }
    }
  }
} satisfies ServiceSchema;

export default LdpCacheSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpCacheSchema.name]: typeof LdpCacheSchema;
    }
  }
}
