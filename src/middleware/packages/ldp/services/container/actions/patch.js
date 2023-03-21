const { MoleculerError } = require('moleculer').Errors;
const { isMirror } = require('../../../utils');
const SparqlParser = require('sparqljs').Parser;
const parser = new SparqlParser();

module.exports = {
  api: async function api(ctx) {
    let { containerUri, body } = ctx.params;
    try {
      if (ctx.meta.parser === 'sparql') {
        await ctx.call('ldp.container.patch', {
          containerUri,
          sparqlUpdate: body
        });
      } else {
        throw new MoleculerError(`The content-type should be application/sparql-update`, 400, 'BAD_REQUEST');
      }
      ctx.meta.$responseHeaders = {
        'Content-Length': 0
      };
      ctx.meta.$statusCode = 204;
    } catch (e) {
      console.error(e);
      ctx.meta.$statusCode = e.code || 500;
      ctx.meta.$statusMessage = e.message;
    }
  },
  action: {
    visibility: 'public',
    params: {
      containerUri: {
        type: 'string'
      },
      sparqlUpdate: {
        type: 'string'
      },
      webId: {
        type: 'string',
        optional: true
      }
    },
    async handler(ctx) {
      let { containerUri, sparqlUpdate, webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      const containerExist = await ctx.call('ldp.container.exist', { containerUri, webId });
      if (!containerExist) {
        throw new MoleculerError(`Cannot update content of non-existing container ${containerUri}`, 400, 'BAD_REQUEST');
      }

      try {
        const parsedQuery = parser.parse(sparqlUpdate);

        if (parsedQuery.type !== 'update')
          throw new MoleculerError('Invalid SPARQL. Must be an Update', 400, 'BAD_REQUEST');

        let updates = { insert: [], delete: [] };
        parsedQuery.updates.forEach(p => updates[p.updateType].push(p[p.updateType][0]));

        for (const inss of updates.insert) {
          // check that the containerUri is the same as specified in the params. ignore if not.
          for (const ins of inss.triples)
            if (ins.subject.value === containerUri && ins.predicate.value === 'http://www.w3.org/ns/ldp#contains') {
              const insUri = ins.object.value;
              try {
                await ctx.call('ldp.container.attach', { containerUri, resourceUri: insUri });
              } catch (e) {
                if (e.code === 404 && isMirror(insUri, this.settings.baseUrl)) {
                  // we need to import the remote resource
                  this.logger.info('IMPORTING ' + insUri);
                  try {
                    await ctx.call('ldp.remote.store', {
                      resourceUri: insUri,
                      keepInSync: true,
                      mirrorGraph: true,
                      webId
                    });

                    // Now if the import went well, we can retry the attach
                    await ctx.call('ldp.container.attach', { containerUri, resourceUri: insUri });
                  } catch (e) {
                    this.logger.warn('ERROR while IMPORTING ' + insUri + ' : ' + e.message);
                  }
                }
              }
            }
        }

        for (const dels of updates.delete) {
          for (const del of dels.triples)
            if (del.subject.value === containerUri && del.predicate.value === 'http://www.w3.org/ns/ldp#contains') {
              const delUri = del.object.value;
              try {
                await ctx.call('ldp.container.detach', { containerUri, resourceUri: delUri });

                // If the mirrored resource is not attached to any container anymore, it must be deleted.
                const containers = await ctx.call('ldp.resource.getContainers', { resourceUri: delUri });
                if (containers.length === 0 && isMirror(delUri, this.settings.baseUrl)) {
                  await ctx.call('ldp.remote.delete', { resourceUri: delUri });

                  // TODO see if this cannot be set in the ldp.remote service
                  ctx.emit(
                    'ldp.resource.deletedSingleMirror',
                    { resourceUri: delUri },
                    { meta: { webId: null, dataset: null, isMirror: true } }
                  );
                }
              } catch (e) {
                // Fail silently
                this.logger.warn(`Error when detaching ${delUri} from ${containerUri}: ${e.message}`);
              }
            }
        }
      } catch (e) {
        console.log(e);
        throw new MoleculerError(`Invalid SPARQL UPDATE content`, 400, 'BAD_REQUEST');
      }

      ctx.emit(
        'ldp.container.patched',
        { containerUri },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
};
