const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const findPrefixAction = require('./actions/findPrefix');
const getByPrefixAction = require('./actions/getByPrefix');
const getJsonLdPrefixesAction = require('./actions/getJsonLdPrefixes');
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
  async started() {
    for (const ontology of this.settings.ontologies) {
      await this.actions.register({ ...ontology, overwrite: true });
    }
  },
  actions: {
    findPrefix: findPrefixAction,
    getByPrefix: getByPrefixAction,
    getJsonLdPrefixes: getJsonLdPrefixesAction,
    getRdfPrefixes: getRdfPrefixesAction,
    list: listAction,
    register: registerAction
  }
};
