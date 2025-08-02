import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
import { cleanUndefined } from '../../../utils.ts';

const { MoleculerError } = require('moleculer').Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    resource: {
      type: 'object'
    },
    webId: {
      type: 'string',
      optional: true
    },
    contentType: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    let { resource, contentType } = ctx.params;
    let { webId } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';
    let newData;

    if (contentType && contentType !== MIME_TYPES.JSON)
      throw new Error(`The ldp.resource.put action now only support JSON-LD. Provided: ${contentType}`);

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
        webId
      },
      {
        meta: {
          $cache: false
        }
      }
    );

    // Adds the default context, if it is missing
    if (!resource['@context']) {
      resource = {
        '@context': await ctx.call('jsonld.context.get'),
        ...resource
      };
    }

    let oldTriples = await ctx.call('jsonld.parser.toQuads', { input: oldData });
    let newTriples = await ctx.call('jsonld.parser.toQuads', { input: resource });

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
      if (triplesToRemove.length > 0) {
        await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Write', webId });
      } else {
        // If we only add new triples, we don't need the acl:Write permission
        await ctx.call('permissions.check', { uri: resourceUri, type: 'resource', mode: 'acl:Append', webId });
      }

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
        webId: 'system'
      });

      // Get the new data, with the same formatting as the old data
      // We skip the cache because it has not been invalidated yet
      newData = await ctx.call(
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
});

export default Schema;
