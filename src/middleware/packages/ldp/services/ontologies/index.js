const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const findPrefixAction = require('./actions/findPrefix');
const getOneAction = require('./actions/getOne');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');
const getJsonLdContextAction = require('./actions/getJsonLdContext');

module.exports = {
  name: 'ldp.ontologies',
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'Ontology', dataset: 'settings' }),
  settings: {
    idField: '@id',
    ontologies: []
  },
  dependencies: ['jsonld'],
  async started() {
    for (const ontology of this.settings.ontologies) {
      await this.actions.register({ ...ontology, overwrite: true });
    }
  },
  actions: {
    findPrefix: findPrefixAction,
    getOne: getOneAction,
    getJsonLdContext: getJsonLdContextAction,
    list: listAction,
    register: registerAction
  }
};
