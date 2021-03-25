module.exports = {
  name: 'webacl.cache-cleaner',
  actions: {
    async cleanRights(ctx) {
      if (this.broker.cacher) {
        const { uri } = ctx.params;
        // If the URI is a container, it will automatically delete the rights of all its contained resources
        await this.broker.cacher.clean(`webacl.resource.getRights:${uri}**`);
        await this.broker.cacher.clean(`webacl.resource.hasRights:${uri}**`);
      }
    }
  },
  events: {
    async 'webacl.resource.updated'(ctx) {
      const { uri } = ctx.params;
      await this.actions.cleanRights({ uri }, { parentCtx: ctx });
    },
    async 'webacl.resource.deleted'(ctx) {
      const { uri } = ctx.params;
      await this.actions.cleanRights({ uri }, { parentCtx: ctx });
    }
  }
};
