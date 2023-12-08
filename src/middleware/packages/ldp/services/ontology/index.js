const { TripleStoreAdapter } = require('@semapps/triplestore');
const findPrefixAction = require('./actions/findPrefix');
const getByPrefixAction = require('./actions/getByPrefix');
const getPrefixesAction = require('./actions/getPrefixes');
const getRdfPrefixesAction = require('./actions/getRdfPrefixes');
const listAction = require('./actions/list');
const registerAction = require('./actions/register');

module.exports = {
  name: 'ldp.ontology',
  settings: {
    idField: '@id',
    ontologies: [],
    dynamicRegistration: false
  },
  async started() {
    if (this.settings.dynamicRegistration) {
      for (const ontology of this.settings.ontologies) {
        await this.actions.register({ ...ontology, overwrite: true });
      }
    }
  },
  actions: {
    findPrefix: findPrefixAction,
    getByPrefix: getByPrefixAction,
    getPrefixes: getPrefixesAction,
    getRdfPrefixes: getRdfPrefixesAction,
    list: listAction,
    register: registerAction
  }
};
