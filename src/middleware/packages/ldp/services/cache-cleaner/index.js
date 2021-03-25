const { getContainerFromUri } = require('../../utils');

module.exports = {
  name: 'ldp.cache-cleaner',
  actions: {
    async cleanResource(ctx) {
      if (this.broker.cacher) {
        const { resourceUri } = ctx.params;
        await this.broker.cacher.clean(`ldp.resource.get:${resourceUri}**`);

        // Also clean the container containing the resource
        const containerUri = getContainerFromUri(resourceUri);
        await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
      }
    },
    async cleanContainer(ctx) {
      if (this.broker.cacher) {
        const { containerUri } = ctx.params;
        await this.broker.cacher.clean(`ldp.container.get:${containerUri}**`);
      }
    },
    // Invalidate resource or container
    // If the resource is a container, invalidate all the container resources
    async cleanAll(ctx) {
      if (this.broker.cacher) {
        const { uri } = ctx.params;
        const isContainer = await ctx.call('ldp.container.exist', { containerUri: uri }, { meta: { webId: 'system' } });

        if (isContainer) {
          await this.actions.cleanContainer({ containerUri: uri }, { parentCtx: ctx });
          await this.actions.cleanResource({ resourceUri: uri }, { parentCtx: ctx });
        } else {
          await this.actions.cleanResource({ resourceUri: uri }, { parentCtx: ctx });
        }
      }
    }
  },
  events: {
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      const containerUri = getContainerFromUri(resourceUri);
      await this.actions.cleanResource({ resourceUri }, { parentCtx: ctx });
      await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri } = ctx.params;
      const containerUri = getContainerFromUri(resourceUri);
      await this.actions.cleanResource({ resourceUri }, { parentCtx: ctx });
      await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.attached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.detached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
    },
    // Invalidate cache also when ACL rights are changed
    async 'webacl.resource.updated'(ctx) {
      const { uri } = ctx.params;
      await this.actions.cleanAll({ uri }, { parentCtx: ctx });
    },
    async 'webacl.resource.deleted'(ctx) {
      const { uri } = ctx.params;
      await this.actions.cleanAll({ uri }, { parentCtx: ctx });
    }
  }
};
