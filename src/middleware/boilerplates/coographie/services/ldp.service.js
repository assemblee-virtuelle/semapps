const { LdpService } = require('@semapps/ldp');
const ontologies = require('../ontologies');
const CONFIG = require('../config');

module.exports = {
  mixins: [LdpService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies,
    containers: ['/organizations', '/projects', '/events', '/persons', '/themas', '/skills', '/users'],
    defaultJsonContext:
      'https://gist.githubusercontent.com/srosset81/cc330b63a213e6f68eb5e52d6ded4342/raw/36325e26adf8aeef948d6a3e701dff9c4c4c066b/pair-ontology.json'
  }
};
