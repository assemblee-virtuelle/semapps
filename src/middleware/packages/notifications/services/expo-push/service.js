const path = require('path');
const ExpoPushDeviceService = require('./device');
const ExpoPushNotificationService = require('./notification');

const ExpoPushService = {
  name: 'expo-push',
  settings: {
    baseUrl: null,
    newDeviceNotification: {
      message: null,
      data: {}
    }
  },
  dependencies: ['api'],
  created() {
    this.broker.createService({
      mixins: [ExpoPushDeviceService],
      settings: {
        newDeviceNotification: this.settings.newDeviceNotification
      }
    });

    this.broker.createService({ mixins: [ExpoPushNotificationService] });
  },
  async started() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting is missing from expo-push service');
    const { pathname: basePath } = new URL(this.settings.baseUrl);

    await this.broker.call('api.addRoute', {
      route: {
        path: path.join(basePath, '/push'),
        name: 'push',
        bodyParsers: { json: true },
        authorization: false,
        authentication: true,
        aliases: {
          [`POST /devices`]: 'push.device.subscribe',
          [`GET /devices`]: 'push.device.find',
          [`GET /devices/:id`]: 'push.device.get',
          [`GET /notifications`]: 'push.notification.find',
          [`GET /notifications/:id`]: 'push.notification.get'
        }
      }
    });
  }
};

module.exports = ExpoPushService;
