import path from 'path';
import { ServiceSchema } from 'moleculer';
import ExpoPushDeviceService from './device.ts';
import ExpoPushNotificationService from './notification.ts';

const ExpoPushService = {
  name: 'expo-push' as const,
  settings: {
    baseUrl: null,
    newDeviceNotification: {
      message: null,
      data: {}
    }
  },
  dependencies: ['api'],
  created() {
    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "expo-push.dev... Remove this comment to see the full error message
    this.broker.createService({
      mixins: [ExpoPushDeviceService],
      settings: {
        newDeviceNotification: this.settings.newDeviceNotification
      }
    });

    // @ts-expect-error TS(2345): Argument of type '{ mixins: { name: "expo-push.not... Remove this comment to see the full error message
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
} satisfies ServiceSchema;

export default ExpoPushService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ExpoPushService.name]: typeof ExpoPushService;
    }
  }
}
