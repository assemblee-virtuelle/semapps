'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const rdfParser = require('rdf-parse').default;
const streamifyString = require('streamify-string');
const N3 = require('n3');
const getAction = require('./actions/get');
const getByTypeAction = require('./actions/getByType');
const postAction = require('./actions/post');
const patchAction = require('./actions/patch');
const deleteAction = require('./actions/delete');
const constants = require('./constants');
const Negotiator = require('negotiator');
const { MoleculerError } = require('moleculer').Errors;

const LdpService = {
  name: 'ldp',
  settings: {
    baseUrl: null,
    ontologies: []
  },
  dependencies: ['triplestore'],
  actions: {
    api_getByType: getByTypeAction.api,
    getByType: getByTypeAction.action,
    api_get: getAction.api,
    get: getAction.action,
    api_post: postAction.api,
    post: postAction.action,
    api_patch: patchAction.api,
    patch: patchAction.action,
    api_delete: deleteAction.api,
    delete: deleteAction.action,
    // /*
    //  * Returns a LDP container persisted in the triple store
    //  * @param containerUri The full URI of the container
    //  */
    // async standardContainer(ctx) {
    //   ctx.meta.$responseType = ctx.meta.headers.accept;
    //
    //   return await ctx.call('triplestore.query', {
    //     query: `
    //       ${this.getPrefixRdf()}
    //       CONSTRUCT {
    //         ?container ldp:contains ?subject .
    //       	?subject ?predicate ?object .
    //       }
    //       WHERE {
    //         <${ctx.params.containerUri}>
    //             a ldp:BasicContainer ;
    //       	    ldp:contains ?subject .
    //       	?container ldp:contains ?subject .
    //         ?subject ?predicate ?object .
    //       }
    //           `,
    //     accept: this.getAcceptHeader(ctx.meta.headers.accept)
    //   });
    // },
    // /*
    //  * Attach an object to a standard container
    //  * @param objectUri The full URI of the object to store
    //  * @param containerUri The full URI of the container where to store the object
    //  */
    // async attachToContainer(ctx) {
    //   const container = {
    //     '@context': 'http://www.w3.org/ns/ldp',
    //     id: ctx.params.containerUri,
    //     type: ['Container', 'BasicContainer'],
    //     contains: ctx.params.objectUri
    //   };
    //
    //   return await ctx.call('triplestore.insert', {
    //     resource: container,
    //     accept: 'json'
    //   });
    // },
    getBaseUrl(ctx) {
      return this.settings.baseUrl;
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
        accept: 'ld+json'
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
    negociateAccept(accept) {
      let availableMediaTypes = [];
      let negotiatorAccept = accept;
      for (const key in constants.SUPPORTED_ACCEPT_MIME_TYPES) {
        let trSupported = constants.TYPES_REPO.filter(tr => tr.mime == constants.SUPPORTED_ACCEPT_MIME_TYPES[key])[0];
        if (constants.SUPPORTED_ACCEPT_MIME_TYPES[key].includes(accept)) {
          negotiatorAccept = trSupported.mimeFull[0];
        }
        trSupported.mimeFull.forEach(tr => availableMediaTypes.push(tr));
      }
      const negotiator = new Negotiator({
        headers: {
          accept: negotiatorAccept
        }
      });
      const rawNegociatedAccept = negotiator.mediaType(availableMediaTypes);
      if (rawNegociatedAccept != undefined) {
        return constants.TYPES_REPO.filter(tr => tr.mimeFull.includes(rawNegociatedAccept))[0].mime;
      } else {
        throw new MoleculerError('Accept not supported : ' + accept, 400, 'ACCEPT_NOT_SUPPORTED');
      }
      return negociatedAccept;
    },
    getTripleStoreAccept(accept) {
      const negociatedAccept = this.negociateAccept(accept);
      const negociatedTypeRepo = constants.TYPES_REPO.filter(tr => tr.mime == negociatedAccept)[0];
      return negociatedTypeRepo.tripleStoreMapping;
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
      const targetTypeRepo = constants.TYPES_REPO.filter(tr => accept.includes(tr.mime))[0];
      if (targetTypeRepo) {
        return targetTypeRepo.N3Mapping;
      } else {
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

module.exports = LdpService;
