import sparqljsModule from 'sparqljs';

const { MoleculerError } = require('moleculer').Errors;

const SparqlParser = sparqljsModule.Parser;
const parser = new SparqlParser();
const ACCEPTED_OPERATIONS = ['insert', 'delete'];

export default async function patch(ctx) {
  try {
    const { username, slugParts } = ctx.params;

    if (ctx.meta.headers['content-type'] !== 'application/sparql-update')
      throw new MoleculerError(`The Content-Type header should be application/sparql-update`, 400, 'BAD_REQUEST');

    const uri = this.getUriFromSlugParts(slugParts, username);
    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    let parsedQuery;

    try {
      parsedQuery = parser.parse(ctx.meta.rawBody);
    } catch (e) {
      throw new MoleculerError(`Invalid SPARQL Update: ${ctx.meta.rawBody}`, 400, 'BAD_REQUEST');
    }

    if (parsedQuery.type !== 'update')
      throw new MoleculerError('Invalid SPARQL. Must be an Update', 400, 'BAD_REQUEST');

    const triplesByOperation = Object.fromEntries(
      parsedQuery.updates
        .filter(p => ACCEPTED_OPERATIONS.includes(p.updateType))
        .map(p => [p.updateType, p[p.updateType][0].triples])
    );

    if (Object.values(triplesByOperation).length === 0) {
      throw new MoleculerError('Invalid SPARQL operation. Must be INSERT DATA and/or DELETE DATA', 400, 'BAD_REQUEST');
    }

    const triplesToAdd = triplesByOperation.insert;
    const triplesToRemove = triplesByOperation.delete;

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */

      await ctx.call('ldp.container.patch', {
        containerUri: uri,
        sparqlUpdate: ctx.meta.rawBody
      });
    } else {
      /*
       * LDP RESOURCE
       */

      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });

      await ctx.call(controlledActions.patch || 'ldp.resource.patch', {
        resourceUri: uri,
        triplesToAdd,
        triplesToRemove
      });
    }

    ctx.meta.$responseHeaders = {
      'Content-Length': 0
    };
    ctx.meta.$statusCode = 204;
  } catch (e) {
    if (!e.code || e.code < 400) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
}
