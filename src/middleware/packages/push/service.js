const urlJoin = require('url-join');
const DeviceService = require('./services/device');
const NotificationService = require('./services/notification');

const PushService = {
  name: 'push',
  settings: {
    baseUri: null,
    newDeviceNotification: {
      message: null,
      data: {}
    }
  },
  dependencies: ['api'],
  created() {
    this.broker.createService(DeviceService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, '/push/devices'),
        context: {
          semapps: 'http://semapps.org/ns/core#',
          ldp: 'http://www.w3.org/ns/ldp#'
        },
        newDeviceNotification: this.settings.newDeviceNotification
      }
    });

    this.broker.createService(NotificationService, {
      settings: {
        containerUri: urlJoin(this.settings.baseUri, '/push/notifications'),
        context: {
          semapps: 'http://semapps.org/ns/core#',
          ldp: 'http://www.w3.org/ns/ldp#'
        }
      }
    });
  },
  async started() {
    const routes = await this.actions.getApiRoutes();
    for (let element of routes) {
      await this.broker.call('api.addRoute', {
        route: element
      });
    }
  },
  actions: {
    getApiRoutes() {
      return [
        {
          bodyParsers: { json: true },
          authorization: false,
          authentication: true,
          aliases: {
            [`POST push/devices`]: 'push.device.subscribe',
            // For the DMS
            [`GET push/devices`]: 'push.device.find',
            [`GET push/devices/:id`]: 'push.device.get',
            [`GET push/notifications`]: 'push.notification.find',
            [`GET push/notifications/:id`]: 'push.notification.get'
          }
        }
      ];
    }
  }
};

module.exports = PushService;
