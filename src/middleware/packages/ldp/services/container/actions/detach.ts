import urlJoin from 'url-join';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const isRemoteContainer = await ctx.call('ldp.remote.isRemote', { resourceUri: containerUri });

    if (new URL(containerUri).pathname === '/') {
      if (isRemoteContainer) return; // indeed, we never have the root container on a mirror.
      containerUri = urlJoin(containerUri, '/');
    }
    const containerExists = await this.actions.exist({ containerUri, webId }, { parentCtx: ctx });
    if (!containerExists && isRemoteContainer) return;
    if (!containerExists) throw new Error(`Cannot detach from a non-existing container: ${containerUri}`);

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE { 
          GRAPH <${containerUri}> {
            <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> 
          }
        }
      `,
      webId
    });

    if (!isRemoteContainer && !ctx.meta.skipEmitEvent) {
      ctx.emit(
        'ldp.container.detached',
        {
          containerUri,
          resourceUri,
          dataset: ctx.meta.dataset
        },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
});

export default Schema;
