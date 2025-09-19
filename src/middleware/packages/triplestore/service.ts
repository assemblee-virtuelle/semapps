import sparqljsModule from 'sparqljs';
import { ServiceSchema, Errors } from 'moleculer';
import dropAll from './actions/dropAll.ts';
import insert from './actions/insert.ts';
import query from './actions/query.ts';
import update from './actions/update.ts';
import DatasetService from './subservices/dataset.ts';
import NamedGraphService from './subservices/named-graph.ts';
import { AdapterInterface } from './adapters/base.ts';

const SparqlGenerator = sparqljsModule.Generator;
const { MoleculerError } = Errors;

const TripleStoreService = {
  name: 'triplestore' as const,
  settings: {
    mainDataset: null,
    adapter: null as AdapterInterface | null,
    // Sub-services customization
    dataset: {},
    namedGraph: {}
  },
  dependencies: ['jsonld.parser'],

  async created() {
    const { dataset, namedGraph, adapter } = this.settings;

    if (!adapter) {
      throw new Error('Adapter is required');
    }
    // Initialize the adapter with
    await adapter.init({ broker: this.broker });

    // Create subservices
    if (dataset !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [DatasetService],
        settings: {
          adapter,
          ...dataset
        }
      });
    }

    if (namedGraph !== false) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "triplestore.d... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [NamedGraphService],
        settings: namedGraph
      });
    }
  },

  started() {
    this.sparqlGenerator = new SparqlGenerator({});
  },

  stopped() {
    this.settings.adapter.cleanup();
  },

  actions: {
    insert,
    update,
    query,
    dropAll
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
