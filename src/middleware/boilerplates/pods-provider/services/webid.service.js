const { WebIdService } = require('@semapps/webid');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebIdService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    podProvider: true
  }
};
