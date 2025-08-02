import { defineAction } from 'moleculer';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const isRemoteContainer = await ctx.call('ldp.remote.isRemote', { resourceUri: containerUri });

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri, webId });
    if (!resourceExists) {
      const childContainerExists = await this.actions.exist({ containerUri: resourceUri, webId }, { parentCtx: ctx });
      if (!childContainerExists) {
        throw new MoleculerError(`Cannot attach non-existing resource or container: ${resourceUri}`, 404, 'NOT_FOUND');
      }
    }

    const containerExists = await this.actions.exist({ containerUri, webId }, { parentCtx: ctx });
    if (!containerExists) throw new Error(`Cannot attach to a non-existing container: ${containerUri}`);

    await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`,
      webId,
      graphName: isRemoteContainer ? this.settings.mirrorGraphName : undefined
    });

    const returnValues = {
      containerUri,
      resourceUri,
      webId,
      dataset: ctx.meta.dataset
    };

    if (!isRemoteContainer && !ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.container.attached', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
});

export default Schema;
