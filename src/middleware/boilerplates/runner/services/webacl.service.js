const { WebACLService } = require('@semapps/webacl');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebACLService],
  settings: {
    graphName: CONFIG.WEBACL_GRAPH_URI,
    baseUrl: CONFIG.HOME_URL
  }
};
