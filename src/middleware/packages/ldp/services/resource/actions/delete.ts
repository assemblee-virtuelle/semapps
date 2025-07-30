import fs from 'fs';
import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    resourceUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
      return await ctx.call('ldp.remote.delete', { resourceUri, webId });
    }

    // Save the current data, to be able to send it through the event
    // If the resource does not exist, it will throw a 404 error
    const oldData = await ctx.call(
      'ldp.resource.get',
      {
        resourceUri,
        accept: MIME_TYPES.JSON,
        webId
      },
      {
        meta: {
          $cache: false
        }
      }
    );

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE {
          <${resourceUri}> ?p1 ?o1 .
        }
      `,
      webId
    });

    // We must detach the resource from the containers after deletion, otherwise the permissions may fail
    const containersUris = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containersUris) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    if (oldData.type === 'semapps:File') {
      try {
        fs.unlinkSync(oldData['semapps:localPath']);
      } catch (e) {
        // Ignore errors (file may have been deleted already)
      }
    }

    const returnValues = {
      resourceUri,
      containersUris,
      oldData,
      webId,
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset
    };

    ctx.call('triplestore.deleteOrphanBlankNodes');

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.deleted', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
});

export default Schema;
