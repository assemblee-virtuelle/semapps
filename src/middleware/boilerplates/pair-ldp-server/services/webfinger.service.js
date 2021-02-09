const urlJoin = require('url-join');
const { WebfingerService } = require('@semapps/webfinger');
const CONFIG = require('../config');

module.exports = {
  mixins: [WebfingerService],
  settings: {
    baseUrl: CONFIG.HOME_URL
  }
};
