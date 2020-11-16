const { WebIdService } = require('@semapps/webid');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebIdService],
  settings: {
    usersContainer: CONFIG.HOME_URL + 'users'
  }
};
