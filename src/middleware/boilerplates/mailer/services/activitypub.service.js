const { ActivityPubService } = require('@semapps/activitypub');
const CONFIG = require('../config');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    additionalContext: {
      pair: 'http://virtual-assembly.org/ontologies/pair#'
    }
  }
};