import { triple, namedNode, variable } from '@rdfjs/data-model';
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

    let exist = await ctx.call('triplestore.tripleExist', {
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      webId
    });

    // If this is a remote URI and the resource is not found in default graph, also look in mirror graph
    if (!exist && (await ctx.call('ldp.remote.isRemote', { resourceUri }))) {
      exist = await ctx.call('triplestore.tripleExist', {
        triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
        webId,
        graphName: this.settings.mirrorGraphName
      });
    }

    // If resource exists but we don't want tombstones, check the resource type
    if (exist && !acceptTombstones) {
      const types = await this.actions.getTypes({ resourceUri }, { parentCtx: ctx });
      if (types.includes('https://www.w3.org/ns/activitystreams#Tombstone')) return false;
    }

    return exist;
  }
});

export default Schema;
