import fs from 'fs';
import { MIME_TYPES } from '@semapps/mime-types';
import type { ActionSchema } from 'moleculer';
import { buildDeleteResourceQuery } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
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

    // Delete the triples of the resource itself with the user's webId, so that Fuseki checks the permissions
    // (if they are missing, the whole update is refused and nothing is deleted)
    await ctx.call('triplestore.update', {
      query: `
        DELETE {
          <${resourceUri}> ?p1 ?o1 .
        }
        WHERE {
          <${resourceUri}> ?p1 ?o1 .
          FILTER(!isBLANK(?o1))
        }
      `,
      webId
    });

    // Then delete its blank nodes. This is done as system, because Fuseki's permissions can't be checked on them.
    await ctx.call('triplestore.update', {
      query: buildDeleteResourceQuery(resourceUri),
      webId: 'system'
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
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.deleted', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
