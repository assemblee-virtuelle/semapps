const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { isMirror } = require('../../../utils');

var SparqlParser = require('sparqljs').Parser;
var parser = new SparqlParser();

const regexPrefix = new RegExp('^@prefix ([\\w-]*: +<.*>) .', 'gm');

module.exports = {
  api: async function api(ctx) {
    let { containerUri, ...resource } = ctx.params;
    try {
      let resourceUri;
      //const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });
      if (ctx.meta.parser === 'sparql') {
        resourceUri = await ctx.call('ldp.container.patch', {
          containerUri,
          update: resource.body,
          contentType: ctx.meta.headers['content-type']
        });
      } else throw new MoleculerError(
        `the content-type should be application/sparql-update`,
        400,
        'BAD_REQUEST'
      );
      ctx.meta.$responseHeaders = {
        //Location: resourceUri,
        //Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
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
      update: {
        type: 'string'
      },
      contentType: {
        type: 'string'
      },
      webId: {
        type: 'string',
        optional: true
      }
    },
    async handler(ctx) {
      let { update, containerUri, contentType, webId } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      const containerExist = await ctx.call('ldp.container.exist', { containerUri, webId });
      if (!containerExist) {
        throw new MoleculerError(
          `Cannot update content of non-existing container ${containerUri}`,
          400,
          'BAD_REQUEST'
        );
      }

      // parse the SPARQL-UPDATE content.
      try {
        
        const parsedQuery = parser.parse(update);

        if (parsedQuery.type !== 'update') throw new MoleculerError(
            'Invalid SPARQL. Must be an Update',
            400,
            'BAD_REQUEST'
          );

        let updates = { insert : [], delete : [] }
        parsedQuery.updates.map(p => updates[p.updateType].push(p[p.updateType][0]))

        for (const ins of updates.insert) {
            // check that the containerUri is the same as specified in the params.
            if (ins.triples[0].subject.value === containerUri && ins.triples[0].predicate.value === 'http://www.w3.org/ns/ldp#contains')
            {
                const insUri = ins.triples[0].object.value
                try {
                    await ctx.call('ldp.container.attach', { containerUri, resourceUri:insUri });
                }
                catch (e) {
                    if (e.code == 404 && isMirror(insUri,this.settings.baseUrl)) {
                        // we need to import the remote resource
                        this.logger.log('IMPORTING '+insUri)
                        try {
                            let newResource = await fetch(insUri, { headers: { Accept: MIME_TYPES.TURTLE } });
                            newResource = await newResource.text();

                            const prefixes = [...newResource.matchAll(regexPrefix)];

                            let turtleToSparql = '';
                            for (const pref of prefixes) {
                              turtleToSparql += 'PREFIX ' + pref[1] + '\n';
                            }
                            turtleToSparql += `INSERT DATA { GRAPH <${this.settings.mirrorGraphName}> { \n`;
                            turtleToSparql += newResource.replace(regexPrefix, '');
                            turtleToSparql += '} }';

                            await ctx.call('triplestore.update', { query: turtleToSparql });

                            // now if the import went well, we can retry the attach
                            await ctx.call('ldp.container.attach', { containerUri, resourceUri:insUri });
                            
                        } catch (e) {
                            // fail silently
                        }
                    }
                }
            }
        }

        for (const del of updates.delete) {
            if (del.triples[0].subject.value === containerUri && del.triples[0].predicate.value === 'http://www.w3.org/ns/ldp#contains')
            {
                const delUri = del.triples[0].object.value
                try {
                    await ctx.call('ldp.container.detach', { containerUri, resourceUri:delUri });
                } catch (e) {
                    // fail silently
                }
            }
        }
      
      } catch(e) {
        throw new MoleculerError(
            `Invalid SPARQL UPDATE content`,
            400,
            'BAD_REQUEST'
          );
      }

      ctx.emit(
        'ldp.container.patched',
        {
          containerUri
        },
        { meta: { webId: null, dataset: null } }
      );

    }
  }
};
