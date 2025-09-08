const { MoleculerError } = require('moleculer').Errors;
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { defineAction } from 'moleculer';

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

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri, webId });
    if (!resourceExists) {
      const childContainerExists = await this.actions.exist({ containerUri: resourceUri }, { parentCtx: ctx });
      if (!childContainerExists) {
        throw new MoleculerError(`Cannot attach non-existing resource or container: ${resourceUri}`, 404, 'NOT_FOUND');
      }
    }

    const containerExists = await this.actions.exist({ containerUri, webId }, { parentCtx: ctx });
    if (!containerExists) throw new Error(`Cannot attach to a non-existing container: ${containerUri}`);

    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        INSERT DATA { 
          GRAPH <${containerUri}> {
            <${containerUri}> ldp:contains <${resourceUri}> 
          }
        }
      `,
      webId: 'system'
    });

    const returnValues = {
      containerUri,
      resourceUri,
      webId,
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.container.attached', returnValues, { meta: { webId: null, dataset: null } });
    }

    return returnValues;
  }
});

export default Schema;
