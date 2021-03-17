const { WebAclService } = require('@semapps/webacl');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebAclService],
  settings: {
    baseUrl: CONFIG.HOME_URL
  }
};
