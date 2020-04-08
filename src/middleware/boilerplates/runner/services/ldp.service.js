const { LdpService } = require('@semapps/ldp');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies,
    containers: ['ldp/object']
  }
};
