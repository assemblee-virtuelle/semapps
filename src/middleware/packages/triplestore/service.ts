import { SparqlJsonParser } from 'sparqljson-parse';
import sparqljsModule from 'sparqljs';
import fetch from 'node-fetch';
import { throw403, throw500 } from '@semapps/middlewares';
import { ServiceSchema, defineAction } from 'moleculer';
import countTriplesOfSubject from './actions/countTriplesOfSubject.ts';
import deleteOrphanBlankNodes from './actions/deleteOrphanBlankNodes.ts';
import dropAll from './actions/dropAll.ts';
import insert from './actions/insert.ts';
import query from './actions/query.ts';
import update from './actions/update.ts';
import tripleExist from './actions/tripleExist.ts';
import DatasetService from './subservices/dataset.ts';

const SparqlGenerator = sparqljsModule.Generator;
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const TripleStoreService = {
  name: 'triplestore' as const,
  settings: {
    url: null,
    user: null,
    password: null,
    mainDataset: null,
    fusekiBase: null,
    // Sub-services customization
    dataset: {}
  },
  dependencies: ['jsonld.parser'],
  async created() {
    const { url, user, password, dataset, fusekiBase } = this.settings;
    this.subservices = {};

    if (dataset !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.subservices.dataset = this.broker.createService({
        mixins: [DatasetService],
        settings: {
          url,
          user,
          password,
          fusekiBase,
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
