const ExpoPushDeviceService = require('./device');
const ExpoPushNotificationService = require('./notification');

const ExpoPushService = {
  name: 'expo-push',
  settings: {
    newDeviceNotification: {
      message: null,
      data: {}
    }
  },
  dependencies: ['api'],
  created() {
    this.broker.createService(ExpoPushDeviceService, {
      settings: {
        newDeviceNotification: this.settings.newDeviceNotification
      }
    });

    this.broker.createService(ExpoPushNotificationService);
  },
  async started() {
    await this.broker.call('api.addRoute', {
      route: {
        path: '/push',
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
