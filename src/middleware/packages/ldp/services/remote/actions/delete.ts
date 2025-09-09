import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId;

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!(await this.actions.isRemote({ resourceUri }, { parentCtx: ctx }))) {
      throw new Error(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        `The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId} / dataset ${ctx.meta.dataset})`
      );
    }

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (this.settings.podProvider) {
      if (!webId || webId === 'system' || webId === 'anon') {
        throw new Error(`Cannot delete remote resource in cache without a webId (Provided: ${webId})`);
      }
      const account = await ctx.call('auth.account.findByWebId', { webId });
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      ctx.meta.dataset = account.username;
    }

    const exist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri });
    if (!exist) throw new Error(`No document found with resource ${resourceUri} (webId: ${webId})`);

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const oldData = await this.actions.getStored({ resourceUri, webId }, { parentCtx: ctx });

    await ctx.call('triplestore.document.clear', { documentUri: resourceUri });
    await ctx.call('triplestore.document.delete', { documentUri: resourceUri });

    // Detach from all containers
    const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containers) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    const returnValues = {
      resourceUri,
      oldData,
      webId,
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset
    };

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.remote.deleted', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
