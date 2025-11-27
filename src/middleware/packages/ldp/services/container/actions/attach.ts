import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { ActionSchema, Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
    if (!resourceExists) {
      const childContainerExists = await this.actions.exist({ containerUri: resourceUri }, { parentCtx: ctx });
      if (!childContainerExists) {
        throw new MoleculerError(`Cannot attach non-existing resource or container: ${resourceUri}`, 404, 'NOT_FOUND');
      }
    }

    const containerExists = await this.actions.exist({ containerUri, webId: 'system' }, { parentCtx: ctx });
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
      dataset: ctx.meta.dataset
    };

    if (!ctx.meta.skipEmitEvent) {
      ctx.emit('ldp.container.attached', returnValues);
    }

    return returnValues;
  }
} satisfies ActionSchema;

export default Schema;
