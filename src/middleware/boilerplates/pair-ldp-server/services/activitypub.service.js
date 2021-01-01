const { ActivityPubService, ACTOR_TYPES } = require('@semapps/activitypub');
const { getPrefixJSON, getSlugFromUri } = require('@semapps/ldp');
const CONFIG = require('../config');
const ontologies = require('../ontologies');
const containers = require('../containers');

module.exports = {
  mixins: [ActivityPubService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    additionalContext: getPrefixJSON(ontologies),
    containers,
    selectActorData: resource => {
      const types = Array.isArray(resource['@type']) ? resource['@type'] : [resource['@type']];
      if (types.includes('foaf:Person')) {
        return {
          '@type': ACTOR_TYPES.PERSON,
          name: resource['foaf:name'] + ' ' + resource['foaf:familyName'],
          preferredUsername: getSlugFromUri(resource['@id'])
        };
      } else if (types.includes('pair:Organization')) {
        return {
          '@type': ACTOR_TYPES.ORGANIZATION,
          name: resource['pair:label'],
          preferredUsername: getSlugFromUri(resource['@id'])
        };
      } else if (types.includes('pair:Project')) {
        return {
          '@type': ACTOR_TYPES.GROUP,
          name: resource['pair:label'],
          preferredUsername: getSlugFromUri(resource['@id'])
        };
      }
    }
  }
};
