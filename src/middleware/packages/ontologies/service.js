const { TripleStoreAdapter } = require('@semapps/triplestore');
const OntologiesRegistryService = require('./sub-services/registry');
const findPrefixAction = require('./actions/findPrefix');
const getByPrefixAction = require('./actions/getByPrefix');
const getPrefixesAction = require('./actions/getPrefixes');
const getRdfPrefixesAction = require('./actions/getRdfPrefixes');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');

module.exports = {
  name: 'ontologies',
  settings: {
    ontologies: [],
    dynamicRegistration: false,
    settingsDataset: 'settings'
  },
  async created() {
    const { ontologies, dynamicRegistration, settingsDataset } = this.settings;
    if (dynamicRegistration) {
      await this.broker.createService(OntologiesRegistryService, {
        adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: settingsDataset }),
        settings: {
          ontologies
        }
      });
    }
  },
  async started() {
    // Do not await to avoid circular dependency with jsonld service
    this.registerAll();
  },
  actions: {
    findPrefix: findPrefixAction,
    getByPrefix: getByPrefixAction,
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
