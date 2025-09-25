import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema } from 'moleculer';
import OntologiesRegistryService from './sub-services/registry.ts';
import findPrefixAction from './actions/findPrefix.ts';
import findNamespaceAction from './actions/findNamespace.ts';
import getAction from './actions/get.ts';
import getPrefixesAction from './actions/getPrefixes.ts';
import getRdfPrefixesAction from './actions/getRdfPrefixes.ts';
import listAction from './actions/list.ts';
import prefixToUriAction from './actions/prefixToUri.ts';
import registerAction from './actions/register.ts';

const OntologiesSchema = {
  name: 'ontologies' as const,
  settings: {
    ontologies: [],
    persistRegistry: false,
    settingsDataset: 'settings'
  },
  async created() {
    const { persistRegistry, settingsDataset } = this.settings;
    if (persistRegistry) {
      // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "ontologies.re... Remove this comment to see the full error message
      this.broker.createService({
        mixins: [OntologiesRegistryService],
        adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: settingsDataset })
      });
    }
  },
  async started() {
    this.ontologies = {};
    await this.registerAll();
  },
  actions: {
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { uri: strin... Remove this comment to see the full error message
    findPrefix: findPrefixAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { prefix: st... Remove this comment to see the full error message
    findNamespace: findNamespaceAction,
    get: getAction,
    getPrefixes: getPrefixesAction,
    getRdfPrefixes: getRdfPrefixesAction,
    list: listAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { value: str... Remove this comment to see the full error message
    prefixToUri: prefixToUriAction,
    // @ts-expect-error TS(2322): Type '{ visibility: "public"; params: { prefix: st... Remove this comment to see the full error message
    register: registerAction
  },
  methods: {
    async registerAll() {
      if (this.settings.persistRegistry) {
        await this.broker.waitForServices(['ontologies.registry']);
        const persistedOntologies = await this.broker.call('ontologies.registry.list');
        this.ontologies = { ...this.ontologies, ...persistedOntologies };
      }
      for (const ontology of this.settings.ontologies) {
        await this.actions.register(ontology);
      }
    }
  }
} satisfies ServiceSchema;

export default OntologiesSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [OntologiesSchema.name]: typeof OntologiesSchema;
    }
  }
}
