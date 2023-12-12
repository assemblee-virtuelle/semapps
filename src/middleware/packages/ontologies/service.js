const { TripleStoreAdapter } = require('@semapps/triplestore');
const OntologiesRegistryService = require('./sub-services/registry');
const findPrefixAction = require('./actions/findPrefix');
const getAction = require('./actions/get');
const getPrefixesAction = require('./actions/getPrefixes');
const getRdfPrefixesAction = require('./actions/getRdfPrefixes');
const listAction = require('./actions/list');
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
      await this.broker.createService(OntologiesRegistryService, {
        adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: settingsDataset })
      });
    }
  },
  async started() {
    if (!this.settings.persistRegistry) this.ontologies = {};

    // Do not await to avoid circular dependency with jsonld service
    this.registerAll();
  },
  actions: {
    findPrefix: findPrefixAction,
    get: getAction,
    getPrefixes: getPrefixesAction,
    getRdfPrefixes: getRdfPrefixesAction,
    list: listAction,
    register: registerAction
  },
  methods: {
    async registerAll() {
      for (const ontology of this.settings.ontologies) {
        await this.actions.register({ ...ontology, overwrite: true });
      }
    }
  }
};
