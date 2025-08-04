const { TripleStoreAdapter } = require('@semapps/triplestore');
const OntologiesRegistryService = require('./sub-services/registry');
const findPrefixAction = require('./actions/findPrefix');
const findNamespaceAction = require('./actions/findNamespace');
const getAction = require('./actions/get');
const getPrefixesAction = require('./actions/getPrefixes');
const getRdfPrefixesAction = require('./actions/getRdfPrefixes');
const listAction = require('./actions/list');
const prefixToUriAction = require('./actions/prefixToUri');
const registerAction = require('./actions/register');

module.exports = {
  name: 'ontologies',
  settings: {
    ontologies: [],
    persistRegistry: false,
    settingsDataset: 'settings'
  },
  async created() {
    const { persistRegistry, settingsDataset } = this.settings;
    if (persistRegistry) {
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
    findPrefix: findPrefixAction,
    findNamespace: findNamespaceAction,
    get: getAction,
    getPrefixes: getPrefixesAction,
    getRdfPrefixes: getRdfPrefixesAction,
    list: listAction,
    prefixToUri: prefixToUriAction,
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
};
