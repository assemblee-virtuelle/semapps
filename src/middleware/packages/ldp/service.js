'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const N3 = require('n3');

module.exports = {
  name: 'ldp',
  settings: {
    homeUrl: null,
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
        '@id': `${this.settings.homeUrl}ldp/${ctx.params.typeURL}`,
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': contains
      };

      if (!ctx.meta.headers.accept.includes('json')) {
        result = await this.jsonldToTriples(result, ctx.meta.headers.accept);
      }
      ctx.meta.$responseType = ctx.meta.headers.accept;
      return result;
    },
    async getResource(ctx) {
      const uri = `${this.settings.homeUrl}ldp/${ctx.params.typeURL}/${ctx.params.identifierURL}`;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: uri
      });

      if (triplesNb > 0) {
        ctx.meta.$responseType = ctx.meta.headers.accept;
        return await ctx.call('triplestore.query', {
          query: `
            ${this.getPrefixRdf()}
            CONSTRUCT {
              <${uri}> ?predicate ?object.
            }
            WHERE {
              <${uri}> ?predicate ?object.
            }
                `,
          accept: this.getAcceptHeader(ctx.meta.headers.accept)
        });
      } else {
        ctx.meta.$statusCode = 404;
      }
    },
    async post(ctx) {
      const { typeURL, ...body } = ctx.params;
      const slug = ctx.meta.headers.slug;
      const requiereId = this.generateId(typeURL, slug);
      let existingBegining = await ctx.call('triplestore.query', {
        query: `
          ${this.getPrefixRdf()}
          SELECT distinct ?uri
          WHERE {
            ?uri ?predicate ?object.
            FILTER regex(str(?uri), "^${requiereId}")
          }
              `,
        accept: 'json'
      });
      let counter = 0;
      if (existingBegining.length > 0) {
        counter = 1;
        existingBegining = existingBegining.map(r => r.uri.value);
        while (existingBegining.includes(requiereId.concat(counter))) {
          counter++;
        }
      }
      body['@id'] = requiereId.concat(counter > 0 ? counter.toString() : '');
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
      const { typeURL, identifierURL, ...body } = ctx.params;
      const uri = `${this.settings.homeUrl}ldp/${ctx.params.typeURL}/${ctx.params.identifierURL}`;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: uri
      });
      if (triplesNb > 0) {
        body['@id'] = uri;
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
      const uri = `${this.settings.homeUrl}ldp/${ctx.params.typeURL}/${ctx.params.identifierURL}`;
      const triplesNb = await ctx.call('triplestore.countTripleOfSubject', {
        uri: uri
      });
      if (triplesNb > 0) {
        const out = await ctx.call('triplestore.delete', {
          uri: uri
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
      ctx.meta.$responseType = 'application/n-triples';

      return await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
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
        accept: 'turtle'
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
    generateId(type, slug = undefined) {
      const id = slug || uuid().substring(0, 8);
      return `${this.settings.homeUrl}ldp/${type}/${id}`;
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
