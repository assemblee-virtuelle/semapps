import { SparqlJsonParser } from 'sparqljson-parse';
import sparqljsModule from 'sparqljs';
import fetch from 'node-fetch';
import { throw403, throw500 } from '@semapps/middlewares';
import { ServiceSchema, defineAction, Errors } from 'moleculer';
import countTriplesOfSubject from './actions/countTriplesOfSubject.ts';
import deleteOrphanBlankNodes from './actions/deleteOrphanBlankNodes.ts';
import dropAll from './actions/dropAll.ts';
import insert from './actions/insert.ts';
import query from './actions/query.ts';
import update from './actions/update.ts';
import tripleExist from './actions/tripleExist.ts';
import DatasetService from './subservices/dataset.ts';
import ng from 'nextgraph';
import { Writer } from 'n3';

const SparqlGenerator = sparqljsModule.Generator;
const { MoleculerError } = Errors;

const TripleStoreService = {
  name: 'triplestore' as const,
  settings: {
    url: null,
    user: null,
    password: null,
    mainDataset: null,
    nextgraphConfig: null,
    nextgraphAdminUserId: null,
    nextgraphMappingsNuri: null,
    // Sub-services customization
    dataset: {}
  },
  dependencies: ['jsonld.parser'],
  async created() {
    const { nextgraphConfig, nextgraphAdminUserId, nextgraphMappingsNuri, dataset } = this.settings;
    if (!nextgraphConfig) {
      throw new Error('NextGraph config is missing');
    }
    if (!nextgraphAdminUserId) {
      throw new Error('NextGraph admin user id is missing');
    }
    if (!nextgraphMappingsNuri) {
      throw new Error('NextGraph mappings nuri is missing');
    }

    this.subservices = {};
    await ng.init_headless(nextgraphConfig);
    try {
      let session = await ng.session_headless_start(nextgraphAdminUserId);
      this.adminSessionid = session.session_id;
    } catch (err) {
      this.logger.error('Error initializing NextGraph admin session', err);
      throw err;
    }

    if (dataset !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.subservices.dataset = this.broker.createService({
        mixins: [DatasetService],
        settings: {
          nextgraphAdminUserId,
          nextgraphMappingsNuri,
          nextgraphConfig,
          adminSessionid: this.adminSessionid,
          ...dataset
        }
      });
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.sparqlGenerator = new SparqlGenerator({
      /* prefixes, baseIRI, factory, sparqlStar */
    });
  },
  stopped() {
    ng.session_headless_stop(this.adminSessionid, true);
  },
  actions: {
    insert,
    update,
    query,
    dropAll,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ uri: { type: "string"; }; web... Remove this comment to see the full error message
    countTriplesOfSubject,
    tripleExist,
    deleteOrphanBlankNodes
  },
  methods: {
    async fetch(url, { method = 'POST', body, headers }) {
      const response = await fetch(url, {
        method,
        body,
        headers: {
          ...headers,
          Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`
        }
      });

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 403) {
          throw403(text);
        } else {
          // the 3 lines below (until the else) can be removed once we switch to jena-fuseki version 4.0.0 or above
          if (response.status === 500 && text.includes('permissions violation')) {
            throw403(text);
          } else {
            throw500(`Unable to reach SPARQL endpoint ${url}. Error message: ${response.statusText}. Query: ${body}`);
          }
        }
      }

      return response;
    },
    generateSparqlQuery(query) {
      try {
        return this.sparqlGenerator.stringify(query);
      } catch (e) {
        console.error(e);
        throw new MoleculerError(`Invalid SPARQL.js object: ${JSON.stringify(query)}`, 400, 'BAD_REQUEST');
      }
    },
    convertRdfJsToTurtle(quads: any) {
      return new Promise((resolve, reject) => {
        const writer = new Writer({
          format: 'Turtle',
          prefixes: {
            // Add common prefixes if needed
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            xsd: 'http://www.w3.org/2001/XMLSchema#'
          }
        });

        // Add all quads
        quads.forEach((quad: any) => {
          writer.addQuad(quad);
        });

        // Get the result
        writer.end((error: any, result: any) => {
          if (error) {
            this.logger.error('Error converting to Turtle:', error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }
  }
} satisfies ServiceSchema;

export default TripleStoreService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [TripleStoreService.name]: typeof TripleStoreService;
    }
  } 
}
