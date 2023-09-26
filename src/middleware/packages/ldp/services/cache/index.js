const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'ldp.cache',
  dependencies: ['ldp.container'],
  actions: {
    async generate(ctx) {
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
    },
    async invalidateResource(ctx) {
      if (this.broker.cacher) {
        const { resourceUri } = ctx.params;
        await this.broker.cacher.clean(`ldp.resource.get:${resourceUri}**`);

        // Also clean the containers containing the resource
        // For deleted resources, no container will be found (containers will be invalidated through the ldp.resource.detached event)
        for (const containerUri of await ctx.call('ldp.resource.getContainers', { resourceUri })) {
          await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
        }
      }
    },
    async invalidateContainer(ctx) {
      if (this.broker.cacher) {
        const { containerUri } = ctx.params;
        await this.broker.cacher.clean(`ldp.container.get:${containerUri}**`);
      }
    }
  },
  events: {
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.invalidateResource({ resourceUri }, { parentCtx: ctx });
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.invalidateResource({ resourceUri }, { parentCtx: ctx });
    },
    async 'ldp.resource.patched'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.invalidateResource({ resourceUri }, { parentCtx: ctx });
    },
    async 'ldp.container.attached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.patched'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.detached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.invalidateContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.remote.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.invalidateResource({ resourceUri }, { parentCtx: ctx });
    },
    async 'ldp.remote.stored'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.invalidateResource({ resourceUri }, { parentCtx: ctx });
    },
    // Invalidate cache also when ACL rights are changed
    async 'webacl.resource.updated'(ctx) {
      const { uri, isContainer } = ctx.params;
      if (isContainer) {
        await this.actions.invalidateContainer({ containerUri: uri }, { parentCtx: ctx });
      } else {
        await this.actions.invalidateResource({ resourceUri: uri }, { parentCtx: ctx });
      }
    },
    async 'webacl.resource.deleted'(ctx) {
      const { uri, isContainer } = ctx.params;
      if (isContainer) {
        await this.actions.invalidateContainer({ containerUri: uri }, { parentCtx: ctx });
      } else {
        await this.actions.invalidateResource({ resourceUri: uri }, { parentCtx: ctx });
      }
    }
  }
};
