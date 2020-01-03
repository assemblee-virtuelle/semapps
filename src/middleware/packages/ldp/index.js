'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');

module.exports = {
  name: 'ldp',
  settings: {
    sparqlEndpoint: null,
    mainDataset: null,
    homeUrl: null
  },
  routes: {
    path: '/ldp/',
    aliases: {
      'GET view/activities': 'ldp.activities',
      'GET type/:container': 'ldp.type',
      'GET :type': 'ldp.automaticContainer',
      'GET :typeURL/:identifier': 'ldp.getSubject',
      'POST :typeURL': 'ldp.post'
    },
    // When using multiple routes we must set the body parser for each route.
    bodyParsers: {
      json: true
    },
    onBeforeCall(ctx, route, req, res){
      // Set request headers to context meta
      ctx.meta.headers = req.headers;
    }
  },
  dependencies: ['triplestore'],
  actions: {
    async activities(ctx) {
      ctx.meta.$responseType = 'application/n-triples';

      return await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
          	?activity rdf:type as:Create.
          	?activity as:object ?object.
          	?object rdf:type ?typeObject.
          	?object as:content ?content.
          	?object as:name ?name.
          	?object as:published ?published.
          }
          WHERE {
          	?activity rdf:type as:Create ;
          	as:object ?object.
          	?object rdf:type ?typeObject;
          	as:content ?content;
          	as:name ?name;
          	as:published ?published.
          }
              `,
        accept: 'turtle'
      });
    },
    async type(ctx) {
      ctx.meta.$responseType = 'application/n-triples';

      return await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
          	?suject ?predicate ?object.
          }
          WHERE {
          	?suject rdf:type ${ctx.params.container} ;
            	?predicate ?object.
          }
              `,
        accept: 'turtle'
      });
    },
    async getSubject(ctx) {
      ctx.meta.$responseType = 'application/n-triples';
      return await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            <${this.settings.homeUrl}ldp/${ctx.params.typeURL}/${ctx.params.identifier}> ?predicate ?object.
          }
          WHERE {
            <${this.settings.homeUrl}ldp/${ctx.params.typeURL}/${ctx.params.identifier}> ?predicate ?object.
          }
              `,
        accept: this.getAcceptHeader(ctx.meta.headers.accept)
      });
    },
    async post(ctx) {
      const { typeURL, ...body } = ctx.params;
      // body.type=typeURL;
      body.id = this.generateId(typeURL);
      const out = await ctx.call('triplestore.insert', {
        resource: body,
        accept: 'turtle'
      });
      ctx.meta.$responseType = 'application/n-triples';
      ctx.meta.$responseStatus = 201;
      ctx.meta.$responseHeaders = {
        Location: body.id,
        Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        'Content-Length': 0
      };
      return out;
    },
    /*
     * Returns a container constructed by the middleware, making a SparQL query on the fly
     */
    async automaticContainer(ctx) {
      ctx.meta.$responseType = 'application/ld+json';

      let result = await ctx.call('triplestore.query', {
        query: `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          CONSTRUCT {
            ?subject ?predicate ?object.
          }
          WHERE {
            ?subject rdf:type ${ctx.params.class} ;
              ?predicate ?object.
          }
              `,
        accept: 'json'
      });

      result = await jsonld.compact(result, {
        as: 'https://www.w3.org/ns/activitystreams#',
        ldp: 'http://www.w3.org/ns/ldp#'
      });

      return {
        '@context': result['@context'],
        '@id': `${this.settings.homeUrl}container/${ctx.params.container}`,
        '@type': ['ldp:Container', 'ldp:BasicContainer'],
        'ldp:contains': result['@graph']
      };
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
        case 'application/n-quad':
          return 'turtle';
        case 'application/n-triples':
          return 'triple';
        case 'application/ld+json':
          return 'json';
        default:
          throw new Error('Unknown accept parameter: ' + accept);
      }
    }
  }

};
