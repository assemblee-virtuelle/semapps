const { LdpService, DocumentTaggerMixin } = require('@semapps/ldp');
const urlJoin = require('url-join');
const ontologies = require('../ontologies');
const CONFIG = require('../config');

module.exports = {
  mixins: [LdpService, DocumentTaggerMixin],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies,
    podProvider: true,
    defaultContainerOptions: {
      jsonContext: urlJoin(CONFIG.HOME_URL, 'context.json'),
      newResourcesPermissions: {
        anon: {
          read: true
        },
        anyUser: {
          read: true,
          write: true
        }
      }
    }
  }
};
