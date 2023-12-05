const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const findPrefixAction = require('./actions/findPrefix');
const getByPrefixAction = require('./actions/getByPrefix');
const getJsonLdContextAction = require('./actions/getJsonLdContext');
const getRdfPrefixesAction = require('./actions/getRdfPrefixes');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');

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
    getByPrefix: getByPrefixAction,
    getJsonLdContext: getJsonLdContextAction,
    getRdfPrefixes: getRdfPrefixesAction,
    list: listAction,
    register: registerAction
  }
};
