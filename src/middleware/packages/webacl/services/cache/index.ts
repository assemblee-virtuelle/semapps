import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';

const WebaclCacheSchema = {
  name: 'webacl.cache' as const,
  actions: {
    invalidateResourceRights: defineAction({
      // Invalidate the WebACL cache of the given resource
      // If specificUriOnly is false, it will invalidate all resources starting with the given URI
      async handler(ctx) {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (this.broker.cacher) {
          const { uri, specificUriOnly } = ctx.params;
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.getRights:${uri}${specificUriOnly ? '|**' : '**'}`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.hasRights:${uri}${specificUriOnly ? '|**' : '**'}`);
        }
      }
    }),

    invalidateAllUserRights: defineAction({
      // Invalidate all WebACL cache for the given user
      async handler(ctx) {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (this.broker.cacher) {
          const { uri } = ctx.params;
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.getRights:**${uri}**`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.hasRights:**${uri}**`);
        }
      }
    }),

    invalidateAllUserRightsOnPod: defineAction({
      async handler(ctx) {
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (this.broker.cacher) {
          const { webId, podOwner } = ctx.params;
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.getRights:${podOwner}|**|${webId}`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.hasRights:${podOwner}|**|${webId}`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.getRights:${podOwner}/**|**|${webId}`);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.broker.cacher.clean(`webacl.resource.hasRights:${podOwner}/**|**|${webId}`);
        }
      }
    }),

    generateForUser: defineAction({
      async handler(ctx) {
        const { webId } = ctx.params;
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.logger.info(`Generating cache for user ${webId}`);
        const containers = await ctx.call('ldp.container.getAll');
        for (const containerUri of containers) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.actions.generateForUser({ webId }, { parentCtx: ctx });
        }
      }
    })
  },
  events: {
    'webacl.resource.updated': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'uri' does not exist on type 'ServiceEven... Remove this comment to see the full error message
        const { uri, isContainer, defaultRightsUpdated } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateResourceRights(
          { uri, specificUriOnly: !isContainer || !defaultRightsUpdated },
          { parentCtx: ctx }
        );
      }
    }),

    'webacl.resource.deleted': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'uri' does not exist on type 'ServiceEven... Remove this comment to see the full error message
        const { uri, isContainer } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateResourceRights({ uri, specificUriOnly: !isContainer }, { parentCtx: ctx });
      }
    }),

    'webacl.resource.user-deleted': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'webId' does not exist on type 'ServiceEv... Remove this comment to see the full error message
        const { webId } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateAllUserRights({ uri: webId }, { parentCtx: ctx });
      }
    }),

    'webacl.group.member-added': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'groupUri' does not exist on type 'Servic... Remove this comment to see the full error message
        const { groupUri, memberUri } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateResourceRights({ uri: groupUri, specificUriOnly: true }, { parentCtx: ctx });
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateAllUserRights({ uri: memberUri }, { parentCtx: ctx });
      }
    }),

    'webacl.group.member-removed': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'groupUri' does not exist on type 'Servic... Remove this comment to see the full error message
        const { groupUri, memberUri } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateResourceRights({ uri: groupUri, specificUriOnly: true }, { parentCtx: ctx });
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        await this.actions.invalidateAllUserRights({ uri: memberUri }, { parentCtx: ctx });
      }
    })
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
