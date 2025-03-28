const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { cleanUndefined } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    resource: {
      type: 'object'
    },
    webId: {
      type: 'string',
      optional: true
    },
    body: {
      type: 'string',
      optional: true
    },
    contentType: {
      type: 'string'
    }
  },
  async handler(ctx) {
    let { resource, contentType, body } = ctx.params;
    let { webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';
    let newData;

    // Remove undefined values as this may cause problems
    resource = resource && cleanUndefined(resource);

    const resourceUri = resource.id || resource['@id'];

    if (await ctx.call('ldp.remote.isRemote', { resourceUri }))
      throw new MoleculerError(
        `Remote resource ${resourceUri} cannot be modified (dataset: ${ctx.meta.dataset})`,
        403,
        'FORBIDDEN'
      );

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

    // Adds the default context, if it is missing
    if (contentType === MIME_TYPES.JSON && !resource['@context']) {
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        ...resource
      };
    }

    let oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
    let newTriples = await this.bodyToTriples(body || resource, contentType);

    // Filter out triples whose subject is not the resource itself
    // We don't want to update or delete resources with IDs
    oldTriples = this.filterOtherNamedNodes(oldTriples, resourceUri);
    newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);

    // blank nodes are convert to variable for sparql query (?variable)
    oldTriples = this.convertBlankNodesToVars(oldTriples);
    newTriples = this.convertBlankNodesToVars(newTriples);

    // same values blackNodes removing because those duplicated values blank nodes cause indiscriminate blank resultings in bug wahen trying to delete both
    newTriples = this.removeDuplicatedVariables(newTriples);

    // Triples to add are reversed, so that blank nodes are linked to resource before being assigned data properties
    // Triples to remove are not reversed, because we want to remove the data properties before unlinking it from the resource
    // This is needed, otherwise we have permissions violations with the WebACL (orphan blank nodes cannot be edited, except as "system")
    const triplesToAdd = this.getTriplesDifference(newTriples, oldTriples).reverse();

    const triplesToRemove = this.getTriplesDifference(oldTriples, newTriples);

    if (triplesToAdd.length === 0 && triplesToRemove.length === 0) {
      // If the exact same data have been posted, skip
      newData = oldData;
    } else {
      // Keep track of blank nodes to use in WHERE clause
      const newBlankNodes = this.getTriplesDifference(newTriples, oldTriples).filter(
        triple => triple.object.termType === 'Variable'
      );
      const existingBlankNodes = oldTriples.filter(
        triple => triple.object.termType === 'Variable' || triple.subject.termType === 'Variable'
      );

      // Generate the query
      let query = '';
      if (triplesToRemove.length > 0) query += `DELETE { ${this.triplesToString(triplesToRemove)} } `;
      if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
      query += 'WHERE { ';
      if (existingBlankNodes.length > 0) query += this.triplesToString(existingBlankNodes);
      if (newBlankNodes.length > 0) query += this.bindNewBlankNodes(newBlankNodes);
      query += ` }`;

      await ctx.call('triplestore.update', {
        query,
        webId
      });

      // Get the new data, with the same formatting as the old data
      // We skip the cache because it has not been invalidated yet
      newData = await ctx.call(
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

      if (!ctx.meta.skipEmitEvent) {
        ctx.emit(
          'ldp.resource.updated',
          {
            resourceUri,
            oldData,
            newData,
            webId,
            dataset: ctx.meta.dataset
          },
          {
            meta: {
              webId: null,
              dataset: null
            }
          }
        );
      }
    }

    return {
      resourceUri,
      oldData,
      newData,
      webId
    };
  }
};
