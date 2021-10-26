const path = require('path');
const { AuthService } = require('@semapps/auth');
const CONFIG = require('../config');

module.exports = {
  mixins: [AuthService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    jwtPath: path.resolve(__dirname, '../jwt')
  },
  methods: {
    async beforeCreateProfile(profileData, accountData) {
      await this.broker.call('pod.create', {
        username: accountData.username
      });
    }
  }
};
