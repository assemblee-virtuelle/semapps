const { ContextParser } = require('jsonld-context-parser');
const getAction = require('./actions/get');
const getLocalAction = require('./actions/getLocal');
const mergeAction = require('./actions/merge');
const parseAction = require('./actions/parse');
const validateAction = require('./actions/validate');

module.exports = {
  name: 'jsonld.context',
  settings: {
    localContextUri: null
  },
  dependencies: ['jsonld.document-loader'],
  async started() {
    this.contextParser = new ContextParser({
      documentLoader: {
        load: async url => {
          const result = await this.broker
            .call('jsonld.document-loader.loadWithCache', { url })
            .then(context => context.document);

          // Manually clear the contextParser inner cache as we don't want to use it
          // See https://github.com/rubensworks/jsonld-context-parser.js/issues/75
          this.contextParser.documentCache = {};

          return result;
        }
      }
    });
  },
  actions: {
    get: getAction,
    getLocal: getLocalAction,
    merge: mergeAction,
    parse: parseAction,
    validate: validateAction
  }
};
