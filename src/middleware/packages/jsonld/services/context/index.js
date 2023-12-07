const { ContextParser } = require('jsonld-context-parser');
const getAction = require('./actions/get');
const mergeAction = require('./actions/merge');
const parseAction = require('./actions/parse');
const validateAction = require('./actions/validate');

module.exports = {
  name: 'jsonld.context',
  dependencies: ['jsonld.document-loader'],
  async started() {
    this.contextParser = new ContextParser({
      documentLoader: {
        load: url => this.broker.call('jsonld.document-loader.loadWithCache', { url }).then(context => context.document)
      }
    });
  },
  actions: {
    get: getAction,
    merge: mergeAction,
    parse: parseAction,
    validate: validateAction
  }
};
