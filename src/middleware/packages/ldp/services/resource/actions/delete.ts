import { ActionSchema } from 'moleculer';
import { getSlugFromUri } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (await ctx.call('ldp.binary.isBinary', { resourceUri })) {
      return await ctx.call('ldp.binary.delete', { resourceUri });
    }

    if (await ctx.call('ldp.remote.isRemote', { resourceUri })) {
      return await ctx.call('ldp.remote.delete', { resourceUri, webId });
    }

    await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Write', webId });

    // Save the current data, to be able to send it through the event
    // If the resource does not exist, it will throw a 404 error
    const oldData: any = await ctx.call(
      'ldp.resource.get',
      {
        resourceUri,
        webId
      },
      {
        meta: {
          $cache: false
        }
      }
    );

    await ctx.call('triplestore.named-graph.clear', { uri: getSlugFromUri(resourceUri) });

    await ctx.call('triplestore.named-graph.delete', { uri: getSlugFromUri(resourceUri) });

    // We must detach the resource from the containers after deletion, otherwise the permissions may fail
    const containersUris: string[] = await ctx.call('ldp.resource.getContainers', { resourceUri });
    for (const containerUri of containersUris) {
      await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
    }

    const returnValues = {
      resourceUri,
      containersUris,
      oldData,
      webId,
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.resource.deleted', returnValues);
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
