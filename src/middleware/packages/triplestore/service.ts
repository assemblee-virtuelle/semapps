import sparqljsModule from 'sparqljs';
import { ServiceSchema, Errors } from 'moleculer';
import dropAll from './actions/dropAll.ts';
import insert from './actions/insert.ts';
import query from './actions/query.ts';
import update from './actions/update.ts';
import tripleExist from './actions/tripleExist.ts';
import DatasetService from './subservices/dataset.ts';
import { AdapterInterface } from './adapters/base.ts';

const SparqlGenerator = sparqljsModule.Generator;
const { MoleculerError } = Errors;

const TripleStoreService = {
  name: 'triplestore' as const,
  settings: {
    mainDataset: null,
    adapter: null as AdapterInterface|null,
    // Sub-services customization
    dataset: {}
  },
  dependencies: ['jsonld.parser'],
  
  async created() {
    if (!this.settings.adapter) {
      throw new Error('Adapter is required');
    }
    // Initialize the adapter with 
    await this.settings.adapter.init({ broker: this.broker });
    
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
    this.sparqlGenerator = new SparqlGenerator({
      /* prefixes, baseIRI, factory, sparqlStar */
    });
  },
  
  stopped() {
    this.settings.adapter.cleanup();
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
