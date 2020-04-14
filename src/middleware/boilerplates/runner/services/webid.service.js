const { WebIdService } = require('@semapps/webid');
const { getPrefixJSON } = require('@semapps/ldp');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

module.exports = {
  mixins: [WebIdService],
  settings: {
    usersContainer: CONFIG.HOME_URL + 'users/',
    context: ['https://www.w3.org/ns/activitystreams', getPrefixJSON(ontologies)]
  }
};
