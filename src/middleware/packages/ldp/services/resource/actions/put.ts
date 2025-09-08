import { MIME_TYPES } from '@semapps/mime-types';
import { ActionSchema } from 'moleculer';
import { cleanUndefined } from '../../../utils.ts';

const { MoleculerError } = require('moleculer').Errors;

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "object"; }' is not assignable to ty... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    webId = webId || ctx.meta.webId || 'anon';
    let newData;

    if (contentType && contentType !== MIME_TYPES.JSON)
      throw new Error(`The ldp.resource.put action now only support JSON-LD. Provided: ${contentType}`);

    // Remove undefined values as this may cause problems
    resource = resource && cleanUndefined(resource);

    const resourceUri = resource.id || resource['@id'];

    if (await ctx.call('ldp.remote.isRemote', { resourceUri }))
      throw new MoleculerError(
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
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
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    oldTriples = this.filterOtherNamedNodes(oldTriples, resourceUri);
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);

    // blank nodes are convert to variable for sparql query (?variable)
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    oldTriples = this.convertBlankNodesToVars(oldTriples);
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    newTriples = this.convertBlankNodesToVars(newTriples);

    // same values blackNodes removing because those duplicated values blank nodes cause indiscriminate blank resultings in bug wahen trying to delete both
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    newTriples = this.removeDuplicatedVariables(newTriples);

    // Triples to add are reversed, so that blank nodes are linked to resource before being assigned data properties
    // Triples to remove are not reversed, because we want to remove the data properties before unlinking it from the resource
    // This is needed, otherwise we have permissions violations with the WebACL (orphan blank nodes cannot be edited, except as "system")
    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    const triplesToAdd = this.getTriplesDifference(newTriples, oldTriples).reverse();

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      const newBlankNodes = this.getTriplesDifference(newTriples, oldTriples).filter(
        (triple: any) => triple.object.termType === 'Variable'
      );
      const existingBlankNodes = oldTriples.filter(
        (triple: any) => triple.object.termType === 'Variable' || triple.subject.termType === 'Variable'
      );

      // Generate the query
      let query = `WITH <${resourceUri}>\n`;
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      if (triplesToRemove.length > 0) query += `DELETE { ${this.triplesToString(triplesToRemove)} } `;
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
      query += 'WHERE { ';
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      if (existingBlankNodes.length > 0) query += this.triplesToString(existingBlankNodes);
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
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

      // @ts-expect-error TS(2339): Property 'skipEmitEvent' does not exist on type '{... Remove this comment to see the full error message
      if (!ctx.meta.skipEmitEvent) {
        ctx.emit(
          'ldp.resource.updated',
          {
            resourceUri,
            oldData,
            newData,
            webId,
            // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
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
} satisfies ActionSchema;

export default Schema;
