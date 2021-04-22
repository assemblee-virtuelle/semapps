module.exports = {
  name: 'webacl.cache-cleaner',
  actions: {
    // Invalidate the WebACL cache of the given resource
    // If specificUriOnly is false, it will invalidate all resources starting with the given URI
    async cleanResourceRights(ctx) {
      if (this.broker.cacher) {
        const { uri, specificUriOnly } = ctx.params;
        await this.broker.cacher.clean(`webacl.resource.getRights:${uri}${specificUriOnly ? '|**' : '**'}`);
        await this.broker.cacher.clean(`webacl.resource.hasRights:${uri}${specificUriOnly ? '|**' : '**'}`);
      }
    },
    // Invalidate all WebACL cache for the given user
    async cleanAllUserRights(ctx) {
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
      await this.actions.cleanResourceRights(
        { uri, specificUriOnly: !isContainer || !defaultRightsUpdated },
        { parentCtx: ctx }
      );
    },
    async 'webacl.resource.deleted'(ctx) {
      const { uri } = ctx.params;
      await this.actions.cleanResourceRights({ uri, specificUriOnly: false }, { parentCtx: ctx });
    },
    async 'webacl.group.member-added'(ctx) {
      const { groupUri, memberUri } = ctx.params;
      await this.actions.cleanResourceRights({ uri: groupUri, specificUriOnly: true }, { parentCtx: ctx });
      await this.actions.cleanAllUserRights({ uri: memberUri }, { parentCtx: ctx });
    },
    async 'webacl.group.member-removed'(ctx) {
      const { groupUri, memberUri } = ctx.params;
      await this.actions.cleanResourceRights({ uri: groupUri, specificUriOnly: true }, { parentCtx: ctx });
      await this.actions.cleanAllUserRights({ uri: memberUri }, { parentCtx: ctx });
    }
  }
};
