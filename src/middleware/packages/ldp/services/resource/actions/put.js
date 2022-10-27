const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { isMirror } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    const { containerUri, id, body, ...resource } = ctx.params;
    // PUT have to stay in same container and @id can't be different
    // TODO generate an error instead of overwriting the ID
    resource['@id'] = urlJoin(containerUri, id);

    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: resource['@id'] });

    if (ctx.meta.parser === 'file') {
      throw new MoleculerError(`PUT method is not supported for non-RDF resources`, 400, 'BAD_REQUEST');
    }

    try {
      await ctx.call(controlledActions.put || 'ldp.resource.put', {
        resource,
        contentType: ctx.meta.headers['content-type'],
        containerUri,
        body,
        slug: id
      });
      ctx.meta.$statusCode = 204;
      ctx.meta.$responseHeaders = {
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      resource: { type: 'object' },
      webId: { type: 'string', optional: true },
      body: { type: 'string', optional: true },
      contentType: { type: 'string' },
      disassembly: { type: 'array', optional: true }
    },
    async handler(ctx) {
      let { resource, contentType, body } = ctx.params;
      let { webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';
      let newData;

      const resourceUri = resource.id || resource['@id'];

      const { disassembly, jsonContext } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri })),
        ...ctx.params
      };

      // Save the current data, to be able to send it through the event
      // If the resource does not exist, it will throw a 404 error
      let oldData = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        webId
      });

      // Adds the default context, if it is missing
      if (contentType === MIME_TYPES.JSON && !resource['@context'] && jsonContext) {
        resource = {
          '@context': jsonContext,
          ...resource
        };
      }

      if (disassembly && contentType === MIME_TYPES.JSON) {
        await this.updateDisassembly(ctx, disassembly, resource, oldData, 'PUT');
      }

      // If we put in the mirror graph, don't do a diff to increase performance
      // We can avoid the diff because these data are not protected by WebACL
      if (isMirror(resourceUri, this.settings.baseUrl)) {
        await ctx.call('triplestore.update', {
          query: `
            DELETE
            WHERE { 
              GRAPH <${this.settings.mirrorGraphName}> {
                <${resourceUri}> ?p1 ?o1 .
              }
            }
          `
        });

        await ctx.call('triplestore.insert', {
          resource,
          contentType,
          graphName: this.settings.mirrorGraphName
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
          { meta: { $cache: false } }
        );

        ctx.call('triplestore.deleteOrphanBlankNodes', { graphName: this.settings.mirrorGraphName });
      } else {
        let oldTriples = await this.bodyToTriples(oldData, MIME_TYPES.JSON);
        let newTriples = await this.bodyToTriples(body || resource, contentType);

        const blankNodesVarsMap = this.mapBlankNodesOnVars([...oldTriples, ...newTriples]);

        // Filter out triples whose subject is not the resource itself
        // We don't want to update or delete resources with IDs
        oldTriples = this.filterOtherNamedNodes(oldTriples, resourceUri);
        newTriples = this.filterOtherNamedNodes(newTriples, resourceUri);

        oldTriples = this.convertBlankNodesToVars(oldTriples, blankNodesVarsMap);
        newTriples = this.convertBlankNodesToVars(newTriples, blankNodesVarsMap);

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
          const existingBlankNodes = oldTriples.filter(triple => triple.object.termType === 'Variable');

          // Generate the query
          let query = '';
          if (triplesToRemove.length > 0) query += `DELETE { ${this.triplesToString(triplesToRemove)} } `;
          if (triplesToAdd.length > 0) query += `INSERT { ${this.triplesToString(triplesToAdd)} } `;
          query += 'WHERE { ';
          if (existingBlankNodes.length > 0) query += this.triplesToString(existingBlankNodes);
          if (newBlankNodes.length > 0) query += this.bindNewBlankNodes(newBlankNodes);
          query += ` }`;

          await ctx.call('triplestore.update', { query, webId });

          // Get the new data, with the same formatting as the old data
          // We skip the cache because it has not been invalidated yet
          newData = await ctx.call(
            'ldp.resource.get',
            {
              resourceUri,
              accept: MIME_TYPES.JSON,
              webId
            },
            { meta: { $cache: false } }
          );

          ctx.emit(
            'ldp.resource.updated',
            {
              resourceUri,
              oldData,
              newData,
              webId
            },
            { meta: { webId: null, dataset: null } }
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
  }
};
