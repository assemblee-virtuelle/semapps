import { ActionSchema } from 'moleculer';
import { getSlugFromUri } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    acceptTombstones: { type: 'boolean', default: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, acceptTombstones } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    let exist = await ctx.call('triplestore.named-graph.exist', { uri: getSlugFromUri(resourceUri) });

    if (exist) {
      // If the named graph exist, ensure it is not empty (otherwise consider the resource doesn't exist)
      exist = await ctx.call('triplestore.query', {
        query: `
          ASK
          WHERE {
            GRAPH <${getSlugFromUri(resourceUri)}> {
              ?s ?p ?o
            }
          }
        `,
        webId: 'system'
      });
    }

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
} satisfies ActionSchema;

export default Schema;
