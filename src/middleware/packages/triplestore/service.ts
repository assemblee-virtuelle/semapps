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
<<<<<<< HEAD
import DocumentService from './subservices/document.ts';

const SparqlGenerator = sparqljsModule.Generator;
const { MoleculerError } = require('moleculer').Errors;
=======

const SparqlGenerator = sparqljsModule.Generator;
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;
>>>>>>> 2.0

const TripleStoreService = {
  name: 'triplestore' as const,
  settings: {
    url: null,
    user: null,
    password: null,
    mainDataset: null,
    fusekiBase: null,
    // Sub-services customization
<<<<<<< HEAD
    dataset: {},
    document: {}
  },
  dependencies: ['jsonld.parser'],
  async created() {
    const { url, user, password, fusekiBase, dataset, document } = this.settings;

    if (dataset !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.broker.createService({
=======
    dataset: {}
  },
  dependencies: ['jsonld.parser'],
  async created() {
    const { url, user, password, dataset, fusekiBase } = this.settings;
    this.subservices = {};

    if (dataset !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.subservices.dataset = this.broker.createService({
>>>>>>> 2.0
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
<<<<<<< HEAD

    if (document !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [DocumentService],
        settings: document
      });
    }
=======
>>>>>>> 2.0
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.sparqlGenerator = new SparqlGenerator({
      /* prefixes, baseIRI, factory, sparqlStar */
    });
  },
  actions: {
<<<<<<< HEAD
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { resource: ... Remove this comment to see the full error message
    insert,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { query: { t... Remove this comment to see the full error message
    update,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { query: { t... Remove this comment to see the full error message
    query,
    dropAll,
    countTriplesOfSubject,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { triple: { ... Remove this comment to see the full error message
=======
    insert,
    update,
    query,
    dropAll,
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ uri: { type: "string"; }; web... Remove this comment to see the full error message
    countTriplesOfSubject,
>>>>>>> 2.0
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
