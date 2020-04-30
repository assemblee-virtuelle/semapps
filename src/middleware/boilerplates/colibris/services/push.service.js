const { PushService } = require('@semapps/push-notifications');
const CONFIG = require('../config');

module.exports = {
  mixins: [PushService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    newDeviceNotification: {
      message: "Bienvenue !",
      data: {}
    }
  }
};
