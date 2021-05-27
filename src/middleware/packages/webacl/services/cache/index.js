module.exports = {
  name: 'webacl.cache',
  actions: {
    // Invalidate the WebACL cache of the given resource
    // If specificUriOnly is false, it will invalidate all resources starting with the given URI
    async invalidateResourceRights(ctx) {
      if (this.broker.cacher) {
        const { uri, specificUriOnly } = ctx.params;
        await this.broker.cacher.clean(`webacl.resource.getRights:${uri}${specificUriOnly ? '|**' : '**'}`);
        await this.broker.cacher.clean(`webacl.resource.hasRights:${uri}${specificUriOnly ? '|**' : '**'}`);
      }
    },
    // Invalidate all WebACL cache for the given user
    async invalidateAllUserRights(ctx) {
      if (this.broker.cacher) {
        const { uri } = ctx.params;
        await this.broker.cacher.clean(`webacl.resource.getRights:**${uri}**`);
        await this.broker.cacher.clean(`webacl.resource.hasRights:**${uri}**`);
      }
    }
  },
  events: {
    async 'webacl.resource.updated'(ctx) {
      const { uri, isContainer, defaultRightsUpdated } = ctx.params;
      await this.actions.invalidateResourceRights(
        { uri, specificUriOnly: !isContainer || !defaultRightsUpdated },
        { parentCtx: ctx }
      );
    },
    async 'webacl.resource.deleted'(ctx) {
      const { uri } = ctx.params;
      await this.actions.invalidateResourceRights({ uri, specificUriOnly: false }, { parentCtx: ctx });
    },
    async 'webacl.group.member-added'(ctx) {
      const { groupUri, memberUri } = ctx.params;
      await this.actions.invalidateResourceRights({ uri: groupUri, specificUriOnly: true }, { parentCtx: ctx });
      await this.actions.invalidateAllUserRights({ uri: memberUri }, { parentCtx: ctx });
    },
    async 'webacl.group.member-removed'(ctx) {
      const { groupUri, memberUri } = ctx.params;
      await this.actions.invalidateResourceRights({ uri: groupUri, specificUriOnly: true }, { parentCtx: ctx });
      await this.actions.invalidateAllUserRights({ uri: memberUri }, { parentCtx: ctx });
    }
  }
};
