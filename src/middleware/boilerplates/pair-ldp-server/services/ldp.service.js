const { LdpService } = require('@semapps/ldp');
const urlJoin = require('url-join');
const ontologies = require('../ontologies');
const CONFIG = require('../config');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies,
    containers: ['/organizations', '/organization-types', '/events', '/themes', '/places'],
    defaultJsonContext: urlJoin(CONFIG.HOME_URL, 'context.json')
  }
};
