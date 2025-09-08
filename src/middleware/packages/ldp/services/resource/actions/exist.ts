import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    acceptTombstones: { type: 'boolean', default: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, acceptTombstones } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const exist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri });

    // If resource exists but we don't want tombstones, check the resource type
    if (exist && !acceptTombstones) {
      const types = await this.actions.getTypes({ resourceUri }, { parentCtx: ctx });
      if (types.includes('https://www.w3.org/ns/activitystreams#Tombstone')) return false;
    }

    // Ensure the logged user has the right to see the resource
    // TODO Verify if we really need this kind of check
    if (
      exist &&
      !(await ctx.call('permissions.has', {
        uri: resourceUri,
        type: 'resource',
        mode: 'acl:Read',
        webId
      }))
    ) {
      return false;
    }

    return exist;
  }
});

export default Schema;
