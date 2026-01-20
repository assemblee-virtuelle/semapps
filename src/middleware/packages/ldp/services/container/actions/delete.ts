import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { ActionSchema } from 'moleculer';
import { getSlugFromUri } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    containerUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    await ctx.call('permissions.check', { uri: containerUri, type: 'container', mode: 'acl:Write', webId });

    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        DELETE
        WHERE {
          GRAPH <${getSlugFromUri(containerUri)}> {
            <${containerUri}> ?p1 ?o1 .
          }
        }
      `,
      webId
    });

    await ctx.call('triplestore.named-graph.delete', { uri: containerUri });

    // Detach the container from parent containers after deletion, otherwise the permissions may fail
    const parentContainersUris: string[] = await ctx.call('ldp.resource.getContainers', { resourceUri: containerUri });
    for (const parentContainerUri of parentContainersUris) {
      await ctx.call('ldp.container.detach', {
        containerUri: parentContainerUri,
        resourceUri: containerUri,
        webId: 'system'
      });
    }

    const returnValues = {
      containerUri,
      dataset: ctx.meta.dataset,
      webId
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.container.deleted', returnValues);
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
