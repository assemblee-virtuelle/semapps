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
        bodyParsers: { json: true },
        authorization: false,
        authentication: true,
        aliases: {
          [`POST push/devices`]: 'push.device.subscribe',
          [`GET push/devices`]: 'push.device.find',
          [`GET push/devices/:id`]: 'push.device.get',
          [`GET push/notifications`]: 'push.notification.find',
          [`GET push/notifications/:id`]: 'push.notification.get'
        }
      }
    });
  }
};

module.exports = ExpoPushService;
