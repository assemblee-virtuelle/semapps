'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const N3 = require('n3');

module.exports = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: []
  },
  dependencies: ['triplestore'],
  actions: {
    /*
     * Returns a container constructed by the middleware, making a SparQL query on the fly
     */
    async getByType(ctx) {
      let result = await ctx.call('triplestore.query', {
        query: `
          ${this.getPrefixRdf()}
          CONSTRUCT {
          	?subject ?predicate ?object.
          }
          WHERE {
          	?subject rdf:type ${ctx.params.typeURL} ;
            	?predicate ?object.
          }
              `,
        accept: 'json'
      });
      result = await jsonld.compact(result, this.getPrefixJSON());
      const { '@graph': graph, '@context': context, ...other } = result;

      const contains = graph || (Object.keys(other).length === 0 ? [] : [other]);

      result = {
        '@context': result['@context'],
        '@id': `${this.settings.baseUrl}${ctx.params.typeURL}`,
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': contains
      };

      if (!ctx.meta.headers.accept.includes('json')) {
        result = await this.jsonldToTriples(result, ctx.meta.headers.accept);
      }
      ctx.meta.$responseType = ctx.meta.headers.accept;
      return result;
    },
    async get(ctx) {
      const resourceUri =
        ctx.params.resourceUri || `${this.settings.baseUrl}${ctx.params.typeURL}/${ctx.params.resourceId}`;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri
      });

      if (triplesNb > 0) {
        ctx.meta.$responseType = ctx.meta.headers.accept;
        return await ctx.call('triplestore.query', {
          query: `
            ${this.getPrefixRdf()}
            CONSTRUCT
            WHERE {
              <${resourceUri}> ?predicate ?object.
            }
                `,
          accept: this.getAcceptHeader(ctx.meta.headers.accept)
        });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async post(ctx) {
      const { typeURL, containerUri, slugParam, ...body } = ctx.params;
      const slug = slugParam || ctx.meta.headers.slug;
      const generatedId = this.generateId(typeURL, containerUri, slug);
      body['@id'] = await this.findUnusedUri(ctx, generatedId);
      const out = await ctx.call('triplestore.insert', {
        resource: body,
        accept: 'json'
      });
      ctx.meta.$statusCode = 201;
      ctx.meta.$responseHeaders = {
        Location: body['@id'],
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
      return out;
    },
    async patch(ctx) {
      let { typeURL, resourceId, resourceUri, ...body } = ctx.params;
      if (!resourceUri) resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', { uri: resourceUri });
      if (triplesNb > 0) {
        body['@id'] = resourceUri;
        const out = await ctx.call('triplestore.patch', {
          resource: body
        });
        ctx.meta.$responseType = ctx.meta.headers.accept;
        ctx.meta.$statusCode = 204;
        ctx.meta.$responseHeaders = {
          Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
          'Content-Length': 0
        };
        return out;
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async delete(ctx) {
      let { typeURL, resourceId, resourceUri } = ctx.params;
      if (!resourceUri) resourceUri = `${this.settings.baseUrl}${typeURL}/${resourceId}`;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: resourceUri
      });
      if (triplesNb > 0) {
        const out = await ctx.call('triplestore.delete', {
          uri: resourceUri
        });
        ctx.meta.$responseType = ctx.meta.headers.accept;
        ctx.meta.$statusCode = 204;
        ctx.meta.$responseHeaders = {
          Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
          'Content-Length': 0
        };
        return out;
      } else {
        ctx.meta.$statusCode = 404;
      }
    },

    /*
     * Returns a LDP container persisted in the triple store
     * @param containerUri The full URI of the container
     */
    async standardContainer(ctx) {
      ctx.meta.$responseType = ctx.meta.headers.accept;

      return await ctx.call('triplestore.query', {
        query: `
          ${this.getPrefixRdf()}
          CONSTRUCT {
            ?container ldp:contains ?subject .
          	?subject ?predicate ?object .
          }
          WHERE {
            <${ctx.params.containerUri}>
                a ldp:BasicContainer ;
          	    ldp:contains ?subject .
          	?container ldp:contains ?subject .
            ?subject ?predicate ?object .
          }
              `,
        accept: this.getAcceptHeader(ctx.meta.headers.accept)
      });
    },
    /*
     * Attach an object to a standard container
     * @param objectUri The full URI of the object to store
     * @param containerUri The full URI of the container where to store the object
     */
    async attachToContainer(ctx) {
      const container = {
        '@context': 'http://www.w3.org/ns/ldp',
        id: ctx.params.containerUri,
        type: ['Container', 'BasicContainer'],
        contains: ctx.params.objectUri
      };

      return await ctx.call('triplestore.insert', {
        resource: container,
        accept: 'json'
      });
    }
  },
  methods: {
    generateId(type, containerUri, slug) {
      const id = slug || uuid().substring(0, 8);
      return containerUri ? `${containerUri}${id}` : `${this.settings.baseUrl}${type}/${id}`;
    },
    async findUnusedUri(ctx, generatedId) {
      let existingBegining = await ctx.call('triplestore.query', {
        query: `
          ${this.getPrefixRdf()}
          SELECT distinct ?uri
          WHERE {
            ?uri ?predicate ?object.
            FILTER regex(str(?uri), "^${generatedId}")
          }
              `,
        accept: 'json'
      });
      let counter = 0;
      if (existingBegining.length > 0) {
        counter = 1;
        existingBegining = existingBegining.map(r => r.uri.value);
        while (existingBegining.includes(generatedId.concat(counter))) {
          counter++;
        }
      }
      return generatedId.concat(counter > 0 ? counter.toString() : '');
    },
    getAcceptHeader(accept) {
      switch (accept) {
        case 'text/turtle':
          return 'turtle';
        case 'application/n-triples':
          return 'triple';
        case 'application/ld+json':
          return 'json';
        default:
          throw new Error('Unknown accept parameter: ' + accept);
      }
    },
    getPrefixRdf() {
      return this.settings.ontologies.map(ontology => `PREFIX ${ontology.prefix}: <${ontology.url}>`).join('\n');
    },
    getPrefixJSON() {
      let pattern = {};
      this.settings.ontologies.forEach(ontology => (pattern[ontology.prefix] = ontology.url));
      return pattern;
    },
    getN3Type(accept) {
      switch (accept) {
        case 'application/n-triples':
          return 'N-Triples';
        case 'text/turtle':
          return 'Turtle';
        default:
          throw new Error('Unknown N3 content-type: ' + accept);
      }
    },
    jsonldToTriples(jsonLdObject, outputContentType) {
      return new Promise((resolve, reject) => {
        const textStream = streamifyString(JSON.stringify(jsonLdObject));
        const writer = new N3.Writer({
          prefixes: this.getPrefixJSON(),
          format: this.getN3Type(outputContentType)
        });
        rdfParser
          .parse(textStream, {
            contentType: 'application/ld+json'
          })
          .on('data', quad => {
            writer.addQuad(quad);
          })
          .on('error', error => console.error(error))
          .on('end', () => {
            writer.end((error, result) => {
              resolve(result);
            });
          });
      });
    }
  }
};
