const { getContainerFromUri } = require('../../utils');

module.exports = {
  name: 'ldp.cache-cleaner',
  actions: {
    async cleanResource(ctx) {
      if (this.broker.cacher) {
        const { resourceUri } = ctx.params;
        await this.broker.cacher.clean(`ldp.resource.get:${resourceUri}**`);

        // Also clean the container containing the resource
        // TODO search all containers containing the resource
        const containerUri = getContainerFromUri(resourceUri);
        await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
      }
    },
    async cleanContainer(ctx) {
      if (this.broker.cacher) {
        const { containerUri } = ctx.params;
        await this.broker.cacher.clean(`ldp.container.get:${containerUri}**`);
      }
    }
  },
  events: {
    async 'ldp.resource.deleted'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.cleanResource({ resourceUri }, { parentCtx: ctx });
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri } = ctx.params;
      await this.actions.cleanResource({ resourceUri }, { parentCtx: ctx });
    },
    async 'ldp.container.attached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
    },
    async 'ldp.container.detached'(ctx) {
      const { containerUri } = ctx.params;
      await this.actions.cleanContainer({ containerUri }, { parentCtx: ctx });
    }
  }
};
