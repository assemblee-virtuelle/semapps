import { SparqlJsonParser } from 'sparqljson-parse';
import sparqljsModule from 'sparqljs';
import { ServiceSchema, defineAction, Errors } from 'moleculer';
import dropAll from './actions/dropAll.ts';
import insert from './actions/insert.ts';
import query from './actions/query.ts';
import update from './actions/update.ts';
import tripleExist from './actions/tripleExist.ts';
import DatasetService from './subservices/dataset.ts';
import { BackendInterface } from './adapters/base.ts';

const SparqlGenerator = sparqljsModule.Generator;
const { MoleculerError } = Errors;

const TripleStoreService = {
  name: 'triplestore' as const,
  settings: {
    // All possible settings from both backends for backward compatibility
    mainDataset: null,
    adapter: null as BackendInterface|null,
    // Sub-services customization
    dataset: {}
  },
  dependencies: ['jsonld.parser'],
  
  async created() {
    if (!this.settings.adapter) {
      throw new Error('Adapter is required');
    }
    if (this.settings.adapter.setBroker) {
      this.settings.adapter.setBroker(this.broker);
    }
    
    // Create subservices
    this.subservices = {};
    if (this.settings.dataset !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.subservices.dataset = this.broker.createService({
        mixins: [DatasetService],
        settings: {
          adapter: this.settings.adapter,
          ...this.settings.dataset
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
    // Clean up backend if needed
    if (this.backend && typeof this.backend.cleanup === 'function') {
      this.backend.cleanup();
    }
  },
  
  actions: {
    insert,
    update,
    query,
    dropAll,
    tripleExist,
  },
  
  methods: {
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
