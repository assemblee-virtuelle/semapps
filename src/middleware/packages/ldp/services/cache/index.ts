import { MIME_TYPES } from '@semapps/mime-types';
import { ServiceSchema, defineAction } from 'moleculer';

const LdpCacheSchema = {
  name: 'ldp.cache' as const,
  dependencies: ['ldp.container'],
  actions: {
    generate: defineAction({
      async handler(ctx) {
        const containersUris = await ctx.call('ldp.container.getAll');
        for (const containerUri of containersUris) {
          try {
            await ctx.call('ldp.container.get', { containerUri, accept: MIME_TYPES.JSON });
            this.logger.info(`Generated cache for container ${containerUri}`);
          } catch (e) {
            this.logger.warn(`Error when generating cache for container ${containerUri}`);
            console.error(e);
          }
        }
      }
    }),

    invalidateResource: defineAction({
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
    }),

    invalidateContainer: defineAction({
      async handler(ctx) {
        if (this.broker.cacher) {
          const { containerUri } = ctx.params;
          await this.broker.cacher.clean(`ldp.container.get:${containerUri}**`);
          await this.broker.cacher.clean(`ldp.resource.getTypes:${containerUri}**`);
        }
      }
    })
  },
  events: {
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
    },
    async 'ldp.container.attached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.patched'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.deleted'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.detached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.remote.deleted'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
    },
    async 'ldp.remote.stored'(ctx) {
      const { resourceUri, dataset } = ctx.params;
      await this.actions.invalidateResource({ resourceUri, dataset }, { parentCtx: ctx });
    },
    // Invalidate cache also when ACL rights are changed
    async 'webacl.resource.updated'(ctx) {
      const { uri, isContainer, dataset } = ctx.params;
      if (isContainer) {
        await this.actions.invalidateContainer({ containerUri: uri }, { parentCtx: ctx });
      } else {
        await this.actions.invalidateResource({ resourceUri: uri, dataset }, { parentCtx: ctx });
      }
    },
    async 'webacl.resource.deleted'(ctx) {
      const { uri, isContainer, dataset } = ctx.params;
      if (isContainer) {
        await this.actions.invalidateContainer({ containerUri: uri }, { parentCtx: ctx });
      } else {
        await this.actions.invalidateResource({ resourceUri: uri, dataset }, { parentCtx: ctx });
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
