import { ServiceSchema, defineAction } from 'moleculer';

const WebaclCacheSchema = {
  name: 'webacl.cache' as const,
  actions: {
    invalidateResourceRights: defineAction({
      // Invalidate the WebACL cache of the given resource
      // If specificUriOnly is false, it will invalidate all resources starting with the given URI
      async handler(ctx) {
        if (this.broker.cacher) {
          const { uri, specificUriOnly } = ctx.params;
          await this.broker.cacher.clean(`webacl.resource.getRights:${uri}${specificUriOnly ? '|**' : '**'}`);
          await this.broker.cacher.clean(`webacl.resource.hasRights:${uri}${specificUriOnly ? '|**' : '**'}`);
        }
      }
    }),

    invalidateAllUserRights: defineAction({
      // Invalidate all WebACL cache for the given user
      async handler(ctx) {
        if (this.broker.cacher) {
          const { uri } = ctx.params;
          await this.broker.cacher.clean(`webacl.resource.getRights:**${uri}**`);
          await this.broker.cacher.clean(`webacl.resource.hasRights:**${uri}**`);
        }
      }
    }),

    invalidateAllUserRightsOnPod: defineAction({
      async handler(ctx) {
        if (this.broker.cacher) {
          const { webId, podOwner } = ctx.params;
          await this.broker.cacher.clean(`webacl.resource.getRights:${podOwner}|**|${webId}`);
          await this.broker.cacher.clean(`webacl.resource.hasRights:${podOwner}|**|${webId}`);
          await this.broker.cacher.clean(`webacl.resource.getRights:${podOwner}/**|**|${webId}`);
          await this.broker.cacher.clean(`webacl.resource.hasRights:${podOwner}/**|**|${webId}`);
        }
      }
    }),

    generateForUser: defineAction({
      async handler(ctx) {
        const { webId } = ctx.params;
        this.logger.info(`Generating cache for user ${webId}`);
        const containers = await ctx.call('ldp.container.getAll');
        for (const containerUri of containers) {
          this.logger.info(`Generating cache for container ${containerUri}`);
          const resources = await ctx.call('ldp.container.getUris', { containerUri });
          for (const resourceUri of resources) {
            await ctx.call('webacl.resource.hasRights', {
              resourceUri,
              rights: { read: true },
              webId
            });
          }
        }
      }
    }),

    generateForAll: defineAction({
      async handler(ctx) {
        const { usersContainer } = ctx.params;
        const users = await ctx.call('ldp.container.getUris', { containerUri: usersContainer });
        for (const webId of users) {
          await this.actions.generateForUser({ webId }, { parentCtx: ctx });
        }
      }
    })
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
      const { uri, isContainer } = ctx.params;
      await this.actions.invalidateResourceRights({ uri, specificUriOnly: !isContainer }, { parentCtx: ctx });
    },
    async 'webacl.resource.user-deleted'(ctx) {
      const { webId } = ctx.params;
      await this.actions.invalidateAllUserRights({ uri: webId }, { parentCtx: ctx });
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
} satisfies ServiceSchema;

export default WebaclCacheSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [WebaclCacheSchema.name]: typeof WebaclCacheSchema;
    }
  }
}
