import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    containerUri: 'string',
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    await ctx.call('permissions.check', { uri: containerUri, type: 'container', mode: 'acl:Write', webId });

    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        DELETE
        WHERE {
          <${containerUri}> ?p1 ?o1 .
        }
      `,
      webId
    });

    // Detach the container from parent containers after deletion, otherwise the permissions may fail
    const parentContainers = await ctx.call('ldp.resource.getContainers', { resourceUri: containerUri });
    for (const parentContainerUri of parentContainers) {
      await ctx.call('ldp.container.detach', {
        containerUri: parentContainerUri,
        resourceUri: containerUri,
        webId: 'system'
      });
    }

    const returnValues = {
      containerUri,
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset,
      webId
    };

    // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.container.deleted', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
