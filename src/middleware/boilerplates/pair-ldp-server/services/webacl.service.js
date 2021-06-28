const { WebAclService } = require('@semapps/webacl');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebAclService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    superAdmins: [
      CONFIG.HOME_URL + 'users/srosset81',
      CONFIG.HOME_URL + 'users/guillaume.rouyer',
      CONFIG.HOME_URL + 'users/simon.louvet.zen',
      CONFIG.HOME_URL + 'users/pierre',
      CONFIG.HOME_URL + 'users/yannickduthe',
      CONFIG.HOME_URL + 'users/jeremy.dufraisse',
      CONFIG.HOME_URL + 'users/info'
    ]
  }
};
