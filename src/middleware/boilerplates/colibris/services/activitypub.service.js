const { ActivityPubService } = require('@semapps/activitypub');
const { getPrefixJSON } = require('@semapps/ldp');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    additionalContext: getPrefixJSON(ontologies),
  }
};
